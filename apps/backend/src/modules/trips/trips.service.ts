import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Trip, TripDocument } from './schemas/trip.schema';
import { Bus, BusDocument } from '../buses/schemas/bus.schema';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { AssignBusDto, AssignCrewDto } from './dto/assign-resource.dto';
import { ActorType, TripStatus } from '@ve_xe_nhanh_ts/shared-types';

export interface TripQuery {
  operatorId?: string;
  routeId?: string;
  busId?: string;
  status?: TripStatus;
  date?: string;
}

@Injectable()
export class TripsService {
  constructor(
    @InjectModel(Trip.name) private tripModel: Model<TripDocument>,
    @InjectModel(Bus.name) private busModel: Model<BusDocument>,
  ) {}

  // ─── Overlap check ────────────────────────────────────────────────

  private async checkBusOverlap(
    busId: string,
    departureTime: string | Date,
    arrivalTime: string | Date,
    excludeTripId?: string,
  ): Promise<void> {
    const depTime = new Date(departureTime);
    const arrTime = new Date(arrivalTime);

    if (arrTime <= depTime) {
      throw new BadRequestException('Giờ đến phải sau giờ khởi hành');
    }

    const query: Record<string, unknown> = {
      busId: new Types.ObjectId(busId),
      departureTime: { $lt: arrTime },
      arrivalTime: { $gt: depTime },
      status: { $nin: [TripStatus.CANCELLED, TripStatus.DRAFT] },
    };
    if (excludeTripId) {
      query._id = { $ne: new Types.ObjectId(excludeTripId) };
    }

    const overlappingTrip = await this.tripModel.findOne(query);

    if (overlappingTrip) {
      throw new ConflictException(
        `Xe này đã có chuyến từ ${overlappingTrip.departureTime.toLocaleString()} đến ${overlappingTrip.arrivalTime.toLocaleString()}`,
      );
    }
  }

  // ─── CRUD ─────────────────────────────────────────────────────────

  async create(
    operatorId: string,
    createDto: CreateTripDto,
  ): Promise<TripDocument> {
    // Overlap check chỉ khi có busId
    if (createDto.busId) {
      await this.checkBusOverlap(
        createDto.busId,
        createDto.departureTime,
        createDto.arrivalTime,
      );
    }

    const tripData: Record<string, unknown> = {
      ...createDto,
      routeId: new Types.ObjectId(createDto.routeId),
      operatorId: new Types.ObjectId(operatorId),
      crew: createDto.crew?.map((id) => new Types.ObjectId(id)) ?? [],
    };

    // busId + status tùy thuộc vào việc gắn xe ngay hay không
    if (createDto.busId) {
      tripData.busId = new Types.ObjectId(createDto.busId);
      tripData.status = TripStatus.SCHEDULED;
    }
    // Không có busId → status = DRAFT (default từ schema)

    const trip = new this.tripModel(tripData);
    return trip.save();
  }

  async findAll(query: TripQuery = {}): Promise<TripDocument[]> {
    const { operatorId, routeId, busId, status, date } = query;

    const filter: Record<string, unknown> = {};
    if (operatorId) filter.operatorId = new Types.ObjectId(operatorId);
    if (routeId) filter.routeId = new Types.ObjectId(routeId);
    if (busId) filter.busId = new Types.ObjectId(busId);
    if (status) filter.status = status;

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      filter.departureTime = { $gte: startOfDay, $lte: endOfDay };
    }

    return this.tripModel
      .find(filter)
      .populate({
        path: 'routeId',
        select: 'routeName routeCode stops distance estimatedDuration',
        populate: { path: 'stops.stopPointId', select: 'name' },
      })
      .populate('operatorId', 'companyName')
      .populate('busId', 'busNumber busType')
      .sort({ departureTime: 1 })
      .exec();
  }

  async findOne(id: string): Promise<TripDocument> {
    const trip = await this.tripModel
      .findById(id)
      .populate({
        path: 'routeId',
        select: 'routeName routeCode stops distance estimatedDuration',
        populate: { path: 'stops.stopPointId', select: 'name' },
      })
      .populate('operatorId', 'companyName')
      .populate('busId', 'busNumber busType seatLayout')
      .exec();

    if (!trip) {
      throw new NotFoundException('Không tìm thấy chuyến xe');
    }
    return trip;
  }

  async update(
    id: string,
    operatorId: string,
    actorType: ActorType,
    updateDto: UpdateTripDto,
  ): Promise<TripDocument> {
    const trip = await this.findOne(id);
    this.assertOwnership(trip, operatorId, actorType);

    // Overlap check nếu thay đổi xe/thời gian VÀ có busId
    const effectiveBusId =
      updateDto.busId ?? trip.busId?.toString() ?? undefined;

    if (
      effectiveBusId &&
      (updateDto.busId || updateDto.departureTime || updateDto.arrivalTime)
    ) {
      await this.checkBusOverlap(
        effectiveBusId,
        updateDto.departureTime || trip.departureTime,
        updateDto.arrivalTime || trip.arrivalTime,
        id,
      );
    }

    return this.tripModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec() as unknown as TripDocument;
  }

  async remove(
    id: string,
    operatorId: string,
    actorType: ActorType,
  ): Promise<void> {
    const trip = await this.findOne(id);
    this.assertOwnership(trip, operatorId, actorType);
    await this.tripModel.findByIdAndDelete(id).exec();
  }

  // ─── Phân công xe ─────────────────────────────────────────────────

  async assignBus(
    id: string,
    operatorId: string,
    actorType: ActorType,
    dto: AssignBusDto,
  ): Promise<TripDocument> {
    const trip = await this.findOne(id);
    this.assertOwnership(trip, operatorId, actorType);

    // Kiểm tra bus tồn tại + lấy totalSeats
    const bus = await this.busModel.findById(dto.busId).exec();
    if (!bus) {
      throw new NotFoundException('Không tìm thấy xe');
    }
    if (!bus.seatLayout?.totalSeats) {
      throw new BadRequestException('Xe chưa có sơ đồ ghế hợp lệ');
    }

    // Overlap check
    await this.checkBusOverlap(
      dto.busId,
      trip.departureTime,
      trip.arrivalTime,
      id,
    );

    // Update
    const totalSeats = bus.seatLayout.totalSeats;
    const bookedCount = trip.bookedSeats?.length ?? 0;

    const updated = await this.tripModel
      .findByIdAndUpdate(
        id,
        {
          busId: new Types.ObjectId(dto.busId),
          totalSeats,
          availableSeats: totalSeats - bookedCount,
          // Auto-transition DRAFT → SCHEDULED khi gắn xe
          ...(trip.status === TripStatus.DRAFT
            ? { status: TripStatus.SCHEDULED }
            : {}),
        },
        { new: true },
      )
      .exec();

    return this.findOne(String(updated!._id));
  }

  // ─── Bỏ gắn xe (SCHEDULED → DRAFT) ────────────────────────────────

  async unassignBus(
    id: string,
    operatorId: string,
    actorType: ActorType,
  ): Promise<TripDocument> {
    const trip = await this.findOne(id);
    this.assertOwnership(trip, operatorId, actorType);

    if (trip.bookedSeats && trip.bookedSeats.length > 0) {
      throw new ConflictException(
        'Không thể bỏ gắn xe khi đã có hành khách đặt vé',
      );
    }

    const allowedStatuses = [TripStatus.DRAFT, TripStatus.SCHEDULED];
    if (!allowedStatuses.includes(trip.status)) {
      throw new BadRequestException(
        `Không thể bỏ gắn xe khi chuyến đang ở trạng thái ${trip.status}`,
      );
    }

    await this.tripModel.findByIdAndUpdate(id, {
      $unset: { busId: 1, totalSeats: 1, availableSeats: 1 },
      status: TripStatus.DRAFT,
    });

    return this.findOne(id);
  }

  // ─── Phân công nhân viên ──────────────────────────────────────────

  async assignCrew(
    id: string,
    operatorId: string,
    actorType: ActorType,
    dto: AssignCrewDto,
  ): Promise<TripDocument> {
    const trip = await this.findOne(id);
    this.assertOwnership(trip, operatorId, actorType);

    // TODO: Khi có Employee module → validate employee IDs tồn tại + check overlap

    await this.tripModel.findByIdAndUpdate(id, {
      crew: dto.crew.map((crewId) => new Types.ObjectId(crewId)),
    });

    return this.findOne(id);
  }

  // ─── Helpers ──────────────────────────────────────────────────────

  private assertOwnership(
    trip: TripDocument,
    operatorId: string,
    actorType: ActorType,
  ): void {
    if (
      actorType !== ActorType.ADMIN &&
      trip.operatorId.toString() !== operatorId
    ) {
      throw new ForbiddenException(
        'Bạn không có quyền thao tác chuyến xe của nhà cung cấp khác',
      );
    }
  }
}
