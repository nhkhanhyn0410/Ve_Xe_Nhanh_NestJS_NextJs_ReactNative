import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Route, RouteDocument } from './schemas/route.schema';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { SystemRole, RouteStopRole } from '@ve_xe_nhanh_ts/shared-types';

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
  ) {}

  async create(operatorId: string, createDto: CreateRouteDto): Promise<Route> {
    const existingCode = await this.routeModel.findOne({
      routeCode: createDto.routeCode,
    });
    if (existingCode) {
      throw new ConflictException('Mã tuyến đường này đã tồn tại');
    }

    const data = {
      ...createDto,
      operatorId: new Types.ObjectId(operatorId),
      stops: createDto.stops.map((s) => ({
        ...s,
        stopPointId: new Types.ObjectId(s.stopPointId),
        transitPickupIds:
          s.transitPickupIds?.map((id) => new Types.ObjectId(id)) ?? [],
        transitDropoffIds:
          s.transitDropoffIds?.map((id) => new Types.ObjectId(id)) ?? [],
      })),
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
      .populate('stops.stopPointId', 'name city province coordinates')
      .populate('stops.transitPickupIds', 'name address coordinates type')
      .populate('stops.transitDropoffIds', 'name address coordinates type')
      .populate('operatorId', 'companyName')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Route> {
    const route = await this.routeModel
      .findById(id)
      .populate('stops.stopPointId', 'name city province coordinates')
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
    role: SystemRole,
    updateDto: UpdateRouteDto,
  ): Promise<Route> {
    const route = await this.findOne(id);

    if (
      role !== SystemRole.ADMIN &&
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

    // Convert ObjectId cho stops nếu có update
    const data: Record<string, unknown> = { ...updateDto };
    if (updateDto.stops) {
      data.stops = updateDto.stops.map((s) => ({
        ...s,
        stopPointId: new Types.ObjectId(s.stopPointId),
        transitPickupIds:
          s.transitPickupIds?.map((id) => new Types.ObjectId(id)) ?? [],
        transitDropoffIds:
          s.transitDropoffIds?.map((id) => new Types.ObjectId(id)) ?? [],
      }));
    }

    return this.routeModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec() as unknown as Route;
  }

  async remove(
    id: string,
    operatorId: string,
    role: SystemRole,
  ): Promise<void> {
    const route = await this.findOne(id);

    if (
      role !== SystemRole.ADMIN &&
      route.operatorId.toString() !== operatorId
    ) {
      throw new ForbiddenException(
        'Bạn không có quyền xóa tuyến đường của nhà xe khác',
      );
    }

    await this.routeModel.findByIdAndDelete(id).exec();
  }
}
