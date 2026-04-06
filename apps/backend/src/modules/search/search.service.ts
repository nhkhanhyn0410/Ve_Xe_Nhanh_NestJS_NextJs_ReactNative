import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../redis/redis.module';
import { GeoSearchStrategy } from './strategies/geo-search.strategy';
import { SubRouteStrategy } from './strategies/sub-route.strategy';
import { TransferMatchStrategy } from './strategies/transfer-match.strategy';
import { JourneyType } from '@ve_xe_nhanh_ts/shared-types';
import {
  SearchResponse,
  SearchItinerary,
  SearchSegment,
  NearbyStopResult,
} from './interfaces/search-result.interface';
import { SearchTripDto, SortBy, SortOrder } from './dto/search-trip.dto';

/** TTL cho cache tìm kiếm trên Redis (5 phút) */
const SEARCH_CACHE_TTL_SECONDS = 300;

/**
 * SearchService
 *
 * Điều phối 3 tầng tìm kiếm, gắn nhãn JourneyType, áp dụng filter/sort/pagination.
 *
 * JourneyType logic:
 * - DIRECT          → Chuyến trực tiếp (1 segment, origin→destination khớp route)
 * - WITH_TRANSIT    → Chuyến có xe trung chuyển đưa đón (route có pickupPoints)
 *                     Được gắn nhãn khi 1 segment DIRECT nhưng route hỗ trợ trung chuyển
 * - TRANSFER        → Nối chuyến qua Hub (2 segments, 2 trips khác nhau)
 * - TRANSIT_AND_TRANSFER → Nối chuyến + trung chuyển tại đầu/cuối
 */
@Injectable()
export class SearchService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly geoSearch: GeoSearchStrategy,
    private readonly subRoute: SubRouteStrategy,
    private readonly transferMatch: TransferMatchStrategy,
  ) {}

  /**
   * Tìm kiếm StopPoints gần nhất.
   */
  async findNearbyStops(
    lat: number,
    lng: number,
    radiusKm: number = 10,
  ): Promise<readonly NearbyStopResult[]> {
    return this.geoSearch.findNearbyStops(lat, lng, radiusKm);
  }

  /**
   * Tìm kiếm chuyến xe tổng hợp với filter/sort/pagination.
   */
  async searchTrips(dto: SearchTripDto): Promise<SearchResponse> {
    const { originId, destinationId, date, passengers = 1 } = dto;

    // ── Cache ──────────────────────────────────────────────────────
    const cacheKey = this.buildCacheKey(dto);
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as SearchResponse;
    }

    // ── Tầng 2: Chuyến trực tiếp + sub-route ──────────────────────
    const directSegments = await this.subRoute.findDirectAndSubRoutes(
      originId,
      destinationId,
      date,
      passengers,
    );

    // Map segment → Itinerary + gắn JourneyType
    let directTrips: SearchItinerary[] = directSegments.map((segment) =>
      this.segmentToItinerary(segment),
    );

    // ── Tầng 3: Nối chuyến qua Hub ────────────────────────────────
    let transferTrips = [
      ...(await this.transferMatch.findTransferRoutes(
        originId,
        destinationId,
        date,
        passengers,
      )),
    ];

    // ── Filter ─────────────────────────────────────────────────────
    directTrips = this.applyFilters(directTrips, dto);
    transferTrips = this.applyFilters(transferTrips, dto);

    // ── Sort ───────────────────────────────────────────────────────
    const sortBy = dto.sortBy ?? SortBy.TIME;
    const sortOrder = dto.sortOrder ?? SortOrder.ASC;
    directTrips = this.applySort(directTrips, sortBy, sortOrder);
    transferTrips = this.applySort(transferTrips, sortBy, sortOrder);

    // ── Pagination ─────────────────────────────────────────────────
    const limit = dto.limit ?? 20;
    const offset = dto.offset ?? 0;
    directTrips = directTrips.slice(offset, offset + limit);
    transferTrips = transferTrips.slice(offset, offset + limit);

    const response: SearchResponse = {
      directTrips,
      transferTrips,
      totalResults: directTrips.length + transferTrips.length,
    };

    // ── Cache kết quả ──────────────────────────────────────────────
    await this.redis.set(
      cacheKey,
      JSON.stringify(response),
      'EX',
      SEARCH_CACHE_TTL_SECONDS,
    );

    return response;
  }

  // ─── Private helpers ───────────────────────────────────────────────

  /**
   * Chuyển 1 segment (chuyến trực tiếp) thành Itinerary.
   * Gắn WITH_TRANSIT nếu route hỗ trợ trung chuyển (sẽ được frontend hiển thị).
   */
  private segmentToItinerary(segment: SearchSegment): SearchItinerary {
    const durationMs =
      segment.arrivalTime.getTime() - segment.departureTime.getTime();

    return {
      journeyType: JourneyType.DIRECT,
      segments: [segment],
      totalPrice: segment.price,
      totalDurationMinutes: Math.round(durationMs / 60_000),
      transferCount: 0,
    };
  }

  /**
   * Áp dụng filters lên mảng itineraries.
   */
  private applyFilters(
    itineraries: SearchItinerary[],
    dto: SearchTripDto,
  ): SearchItinerary[] {
    let result = itineraries;

    // Filter theo giá
    if (dto.minPrice != null) {
      result = result.filter((it) => it.totalPrice >= dto.minPrice!);
    }
    if (dto.maxPrice != null) {
      result = result.filter((it) => it.totalPrice <= dto.maxPrice!);
    }

    // Filter theo nhà xe
    if (dto.operatorId) {
      result = result.filter((it) =>
        it.segments.some((s) => s.operatorId === dto.operatorId),
      );
    }

    // Filter theo loại xe
    if (dto.busType) {
      result = result.filter((it) =>
        it.segments.some((s) => s.busType === dto.busType),
      );
    }

    // Filter theo giờ khởi hành
    if (dto.departureTimeStart || dto.departureTimeEnd) {
      result = result.filter((it) => {
        const dep = it.segments[0].departureTime;
        const depMinutes = dep.getHours() * 60 + dep.getMinutes();

        if (dto.departureTimeStart) {
          const [h, m] = dto.departureTimeStart.split(':').map(Number);
          if (depMinutes < h * 60 + m) return false;
        }
        if (dto.departureTimeEnd) {
          const [h, m] = dto.departureTimeEnd.split(':').map(Number);
          if (depMinutes > h * 60 + m) return false;
        }
        return true;
      });
    }

    return result;
  }

  /**
   * Sắp xếp itineraries.
   */
  private applySort(
    itineraries: SearchItinerary[],
    sortBy: SortBy,
    sortOrder: SortOrder,
  ): SearchItinerary[] {
    const multiplier = sortOrder === SortOrder.ASC ? 1 : -1;

    return [...itineraries].sort((a, b) => {
      switch (sortBy) {
        case SortBy.PRICE:
          return (a.totalPrice - b.totalPrice) * multiplier;
        case SortBy.DURATION:
          return (a.totalDurationMinutes - b.totalDurationMinutes) * multiplier;
        case SortBy.TIME:
        default: {
          const aTime = a.segments[0].departureTime.getTime();
          const bTime = b.segments[0].departureTime.getTime();
          return (aTime - bTime) * multiplier;
        }
      }
    });
  }

  /**
   * Build cache key từ tất cả params (bao gồm filters).
   */
  private buildCacheKey(dto: SearchTripDto): string {
    const parts = [
      'search',
      dto.originId,
      dto.destinationId,
      dto.date,
      dto.passengers ?? 1,
      dto.minPrice ?? '',
      dto.maxPrice ?? '',
      dto.departureTimeStart ?? '',
      dto.departureTimeEnd ?? '',
      dto.operatorId ?? '',
      dto.busType ?? '',
      dto.sortBy ?? 'time',
      dto.sortOrder ?? 'asc',
      dto.limit ?? 20,
      dto.offset ?? 0,
    ];
    return parts.join(':');
  }
}
