import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Route, RouteDocument } from './schemas/route.schema';
import {
  StopPoint,
  StopPointDocument,
} from '../stop-points/schemas/stop-point.schema';
import { CreateRouteDto, RouteStopDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { ActorType, RouteStopRole } from '@ve_xe_nhanh_ts/shared-types';

export interface RouteQuery {
  originStopPointId?: string;
  destinationStopPointId?: string;
  operatorId?: string;
  isActive?: string | boolean;
}

@Injectable()
export class RoutesService {
  constructor(
    @InjectModel(Route.name) private routeModel: Model<RouteDocument>,
    @InjectModel(StopPoint.name)
    private stopPointModel: Model<StopPointDocument>,
  ) {}

  async create(operatorId: string, createDto: CreateRouteDto): Promise<Route> {
    const existingCode = await this.routeModel.findOne({
      routeCode: createDto.routeCode,
    });
    if (existingCode) {
      throw new ConflictException('Mã tuyến đường này đã tồn tại');
    }

    const stops = await this.buildStopsWithStopPointData(createDto.stops);

    const data = {
      ...createDto,
      operatorId: new Types.ObjectId(operatorId),
      stops,
    };

    return this.routeModel.create(data);
  }

  async findAll(query: RouteQuery = {}): Promise<RouteDocument[]> {
    const filter: Record<string, unknown> = {};

    if (query.originStopPointId) {
      filter['stops'] = {
        $elemMatch: {
          role: RouteStopRole.ORIGIN,
          stopPointId: new Types.ObjectId(query.originStopPointId),
        },
      };
    }
    if (query.destinationStopPointId) {
      // Nếu đã có $elemMatch cho origin, dùng $and
      if (filter['stops']) {
        const originFilter = filter['stops'];
        delete filter['stops'];
        filter['$and'] = [
          { stops: originFilter },
          {
            stops: {
              $elemMatch: {
                role: RouteStopRole.DESTINATION,
                stopPointId: new Types.ObjectId(query.destinationStopPointId),
              },
            },
          },
        ];
      } else {
        filter['stops'] = {
          $elemMatch: {
            role: RouteStopRole.DESTINATION,
            stopPointId: new Types.ObjectId(query.destinationStopPointId),
          },
        };
      }
    }
    if (query.operatorId)
      filter.operatorId = new Types.ObjectId(query.operatorId);
    if (query.isActive !== undefined && query.isActive !== '') {
      filter.isActive = query.isActive === 'true' || query.isActive === true;
    }

    const queryFilter = filter as unknown as Parameters<
      Model<RouteDocument>['find']
    >[0];

    return this.routeModel
      .find(queryFilter)
      .populate('stops.stopPointId', 'name wardName provinceName coordinates')
      .populate('stops.transitPickupIds', 'name address coordinates type')
      .populate('stops.transitDropoffIds', 'name address coordinates type')
      .populate('operatorId', 'companyName')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Route> {
    const route = await this.routeModel
      .findById(id)
      .populate('stops.stopPointId', 'name wardName provinceName coordinates')
      .populate('stops.transitPickupIds', 'name address coordinates type')
      .populate('stops.transitDropoffIds', 'name address coordinates type')
      .exec();

    if (!route) {
      throw new NotFoundException('Không tìm thấy tuyến đường');
    }
    return route;
  }

  async update(
    id: string,
    operatorId: string,
    actorType: ActorType,
    updateDto: UpdateRouteDto,
  ): Promise<Route> {
    const route = await this.findOne(id);

    if (
      actorType !== ActorType.ADMIN &&
      route.operatorId.toString() !== operatorId
    ) {
      throw new ForbiddenException(
        'Bạn không có quyền sửa tuyến đường của nhà xe khác',
      );
    }

    if (updateDto.routeCode && updateDto.routeCode !== route.routeCode) {
      const existingCode = await this.routeModel.findOne({
        routeCode: updateDto.routeCode,
      });
      if (existingCode) {
        throw new ConflictException('Mã tuyến đường mới này đã tồn tại');
      }
    }

    // Convert ObjectId + auto-populate cho stops nếu có update
    const data: Record<string, unknown> = { ...updateDto };
    if (updateDto.stops) {
      data.stops = await this.buildStopsWithStopPointData(updateDto.stops);
    }

    return this.routeModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec() as unknown as Route;
  }

  /**
   * Validate tất cả stopPointIds tồn tại, convert ObjectId.
   * name/address/coordinates lấy từ StopPoint qua populate — không lưu trùng.
   */
  private async buildStopsWithStopPointData(stops: RouteStopDto[]) {
    const allIds = stops.map((s) => new Types.ObjectId(s.stopPointId));
    const count = await this.stopPointModel.countDocuments({
      _id: { $in: allIds },
    });

    if (count !== allIds.length) {
      // Tìm ID nào bị thiếu
      const found = await this.stopPointModel
        .find({ _id: { $in: allIds } })
        .select('_id')
        .exec();
      const foundSet = new Set(found.map((sp) => String(sp._id)));
      const missingIds = stops
        .filter((s) => !foundSet.has(s.stopPointId))
        .map((s) => s.stopPointId);
      throw new BadRequestException(
        `StopPoint không tồn tại: ${missingIds.join(', ')}`,
      );
    }

    return stops.map((s) => ({
      stopPointId: new Types.ObjectId(s.stopPointId),
      role: s.role,
      order: s.order,
      estimatedArrivalMinutes: s.estimatedArrivalMinutes,
      stopDuration: s.stopDuration ?? 15,
      transitPickupIds:
        s.transitPickupIds?.map((id) => new Types.ObjectId(id)) ?? [],
      transitDropoffIds:
        s.transitDropoffIds?.map((id) => new Types.ObjectId(id)) ?? [],
    }));
  }

  async remove(
    id: string,
    operatorId: string,
    actorType: ActorType,
  ): Promise<void> {
    const route = await this.findOne(id);

    if (
      actorType !== ActorType.ADMIN &&
      route.operatorId.toString() !== operatorId
    ) {
      throw new ForbiddenException(
        'Bạn không có quyền xóa tuyến đường của nhà xe khác',
      );
    }

    await this.routeModel.findByIdAndDelete(id).exec();
  }
}
