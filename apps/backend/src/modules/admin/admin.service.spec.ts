import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import * as bcrypt from 'bcryptjs';
import { AdminService } from './admin.service';
import { Admin } from './schemas/admin.schema';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

describe('AdminService', () => {
  let service: AdminService;

  const mockAdminModel = {
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  const createQueryMock = <T>(resolvedValue: T) => ({
    select: jest.fn().mockReturnThis(),
    exec: jest.fn().mockImplementation(() => Promise.resolve(resolvedValue)),
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getModelToken(Admin.name),
          useValue: mockAdminModel,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return admin with selected password field', async () => {
      const admin = { email: 'admin@test.com' };
      const query = createQueryMock(admin);
      mockAdminModel.findOne.mockReturnValue(query);

      const result = await service.findByEmail('admin@test.com');

      expect(mockAdminModel.findOne).toHaveBeenCalledWith({
        email: 'admin@test.com',
      });
      expect(query.select).toHaveBeenCalledWith('+password');
      expect(query.exec).toHaveBeenCalledTimes(1);
      expect(result).toBe(admin);
    });
  });

  describe('findByUsername', () => {
    it('should return admin with selected password field', async () => {
      const admin = { username: 'superadmin' };
      const query = createQueryMock(admin);
      mockAdminModel.findOne.mockReturnValue(query);

      const result = await service.findByUsername('superadmin');

      expect(mockAdminModel.findOne).toHaveBeenCalledWith({
        username: 'superadmin',
      });
      expect(query.select).toHaveBeenCalledWith('+password');
      expect(query.exec).toHaveBeenCalledTimes(1);
      expect(result).toBe(admin);
    });
  });

  describe('findById', () => {
    it('should return admin when found', async () => {
      const admin = { _id: 'admin-id' };
      mockAdminModel.findById.mockImplementation(() => Promise.resolve(admin));

      const result = await service.findById('admin-id');

      expect(mockAdminModel.findById).toHaveBeenCalledWith('admin-id');
      expect(result).toBe(admin);
    });

    it('should throw NotFoundException when admin does not exist', async () => {
      mockAdminModel.findById.mockImplementation(() => Promise.resolve(null));

      await expect(service.findById('missing-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockAdminModel.findById).toHaveBeenCalledWith('missing-id');
    });
  });

  describe('findByIdWithRefreshToken', () => {
    it('should return admin with selected refresh token field', async () => {
      const admin = { _id: 'admin-id', refreshToken: 'hashed-token' };
      const query = createQueryMock(admin);
      mockAdminModel.findById.mockReturnValue(query);

      const result = await service.findByIdWithRefreshToken('admin-id');

      expect(mockAdminModel.findById).toHaveBeenCalledWith('admin-id');
      expect(query.select).toHaveBeenCalledWith('+refreshToken');
      expect(query.exec).toHaveBeenCalledTimes(1);
      expect(result).toBe(admin);
    });
  });

  describe('updateRefreshToken', () => {
    it('should hash refresh token before updating', async () => {
      const hashMock = bcrypt.hash as unknown as jest.Mock<
        (password: string, salt: number | string) => Promise<string>
      >;
      hashMock.mockResolvedValue('hashed-refresh-token');
      mockAdminModel.findByIdAndUpdate.mockImplementation(() =>
        Promise.resolve(undefined),
      );

      await service.updateRefreshToken('admin-id', 'plain-refresh-token');

      expect(hashMock).toHaveBeenCalledWith('plain-refresh-token', 12);
      expect(mockAdminModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'admin-id',
        { refreshToken: 'hashed-refresh-token' },
      );
    });

    it('should save null refresh token without hashing', async () => {
      const hashMock = bcrypt.hash as unknown as jest.Mock<
        (password: string, salt: number | string) => Promise<string>
      >;
      mockAdminModel.findByIdAndUpdate.mockImplementation(() =>
        Promise.resolve(undefined),
      );

      await service.updateRefreshToken('admin-id', null);

      expect(hashMock).not.toHaveBeenCalled();
      expect(mockAdminModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'admin-id',
        {
          refreshToken: null,
        },
      );
    });
  });

  describe('updateLastLogin', () => {
    it('should update last login timestamp', async () => {
      mockAdminModel.findByIdAndUpdate.mockImplementation(() =>
        Promise.resolve(undefined),
      );

      await service.updateLastLogin('admin-id');

      expect(mockAdminModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      const updateCalls = mockAdminModel.findByIdAndUpdate.mock.calls as Array<
        [string, { lastLoginAt?: Date }]
      >;
      const updateArg = updateCalls[0]?.[1];

      expect(mockAdminModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'admin-id',
        updateArg,
      );
      expect(updateArg.lastLoginAt).toBeInstanceOf(Date);
    });
  });
});
