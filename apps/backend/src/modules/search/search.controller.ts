import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '@common/decorators/public.decorator';
import { SearchService } from './search.service';
import { SearchTripDto, NearbySearchDto } from './dto/search-trip.dto';

@ApiTags('Search')
@Controller('search')
@Public()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /**
   * Tìm StopPoints gần nhất theo tọa độ GPS.
   * Trả về khoảng cách đường bộ thực tế (OSRM) + gợi ý điểm đón trung chuyển.
   */
  @Get('nearby')
  @ApiOperation({ summary: 'Tìm bến xe / điểm đón gần vị trí khách hàng' })
  async findNearby(@Query() dto: NearbySearchDto) {
    return this.searchService.findNearbyStops(
      dto.lat,
      dto.lng,
      dto.radiusKm ?? 10,
    );
  }

  /**
   * Tìm kiếm chuyến xe tổng hợp.
   * Trả về kết quả Trực tiếp + Sub-route + Nối chuyến, có filter/sort/pagination.
   */
  @Get('trips')
  @ApiOperation({
    summary: 'Tìm chuyến xe (Trực tiếp + Sub-route + Nối chuyến)',
  })
  async searchTrips(@Query() dto: SearchTripDto) {
    return this.searchService.searchTrips(dto);
  }
}
