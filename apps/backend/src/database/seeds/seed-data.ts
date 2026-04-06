/**
 * Seed Script: Tạo dữ liệu mẫu thực tế cho Vé Xe Nhanh
 *
 * Chạy: npx ts-node src/database/seeds/seed-data.ts
 * Yêu cầu: MongoDB đang chạy, file .env đã cấu hình MONGODB_URI
 *
 * Dữ liệu bao gồm:
 * - 10 StopPoints (Bến xe + điểm đón/trả trung chuyển)
 * - 2 Operators (Nhà xe Phương Trang, Hoàng Long)
 * - 4 Buses (2 xe mỗi hãng)
 * - 6 Routes (Unified format: stops[] với role)
 * - 10 Trips (Chuyến xe trong 7 ngày tới)
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcryptjs';

dotenv.config();

// ============================================================
// 1. STOP POINTS - Bến xe + điểm đón/trả trung chuyển
// ============================================================
const stopPoints = [
  // === BẾN XE LỚN (STATION) ===
  {
    name: 'Bến Xe Miền Đông Mới',
    type: 'station',
    city: 'Hồ Chí Minh',
    province: 'Hồ Chí Minh',
    address: 'Xa lộ Hà Nội, TP. Thủ Đức',
    coordinates: { lat: 10.8772, lng: 106.8211 },
    location: { type: 'Point', coordinates: [106.8211, 10.8772] },
    isActive: true,
  },
  {
    name: 'Bến Xe Miền Tây',
    type: 'station',
    city: 'Hồ Chí Minh',
    province: 'Hồ Chí Minh',
    address: '395 Kinh Dương Vương, Q. Bình Tân',
    coordinates: { lat: 10.738, lng: 106.6197 },
    location: { type: 'Point', coordinates: [106.6197, 10.738] },
    isActive: true,
  },
  {
    name: 'Bến Xe Đà Lạt',
    type: 'station',
    city: 'Đà Lạt',
    province: 'Lâm Đồng',
    address: '01 Tô Hiến Thành, Phường 3',
    coordinates: { lat: 11.9404, lng: 108.4419 },
    location: { type: 'Point', coordinates: [108.4419, 11.9404] },
    isActive: true,
  },
  {
    name: 'Bến Xe Nha Trang',
    type: 'station',
    city: 'Nha Trang',
    province: 'Khánh Hòa',
    address: '58 Nguyễn Trãi, Phước Tân',
    coordinates: { lat: 12.2579, lng: 109.1826 },
    location: { type: 'Point', coordinates: [109.1826, 12.2579] },
    isActive: true,
  },
  {
    name: 'Bến Xe Nước Ngầm',
    type: 'station',
    city: 'Hà Nội',
    province: 'Hà Nội',
    address: '1 Ngọc Hồi, Hoàng Liệt, Hoàng Mai',
    coordinates: { lat: 20.9708, lng: 105.8413 },
    location: { type: 'Point', coordinates: [105.8413, 20.9708] },
    isActive: true,
  },
  {
    name: 'Bến Xe Niệm Nghĩa - Hải Phòng',
    type: 'station',
    city: 'Hải Phòng',
    province: 'Hải Phòng',
    address: '34 Đường Trần Nguyên Hãn, Niệm Nghĩa',
    coordinates: { lat: 20.8448, lng: 106.6881 },
    location: { type: 'Point', coordinates: [106.6881, 20.8448] },
    isActive: true,
  },
  // === ĐIỂM ĐÓN TRUNG CHUYỂN (PICKUP) ===
  {
    name: 'VP Phương Trang - Quận 1',
    type: 'pickup',
    city: 'Hồ Chí Minh',
    province: 'Hồ Chí Minh',
    address: '272 Đề Thám, Quận 1',
    coordinates: { lat: 10.7628, lng: 106.6932 },
    location: { type: 'Point', coordinates: [106.6932, 10.7628] },
    isActive: true,
  },
  // === ĐIỂM DỪng TRUNG GIAN (REST_STOP / POINT) ===
  {
    name: 'Trạm Dừng Phan Rang',
    type: 'rest_stop',
    city: 'Phan Rang',
    province: 'Ninh Thuận',
    address: 'Quốc lộ 1A, Phan Rang',
    coordinates: { lat: 11.5712, lng: 108.9869 },
    location: { type: 'Point', coordinates: [108.9869, 11.5712] },
    isActive: true,
  },
  // === ĐIỂM TRẢ TRUNG CHUYỂN (DROPOFF) ===
  {
    name: 'Trung tâm Đà Lạt',
    type: 'dropoff',
    city: 'Đà Lạt',
    province: 'Lâm Đồng',
    address: 'Hồ Xuân Hương, Phường 1',
    coordinates: { lat: 11.9416, lng: 108.4381 },
    location: { type: 'Point', coordinates: [108.4381, 11.9416] },
    isActive: true,
  },
  // === ĐIỂM DỪng TRUNG GIAN (POINT) — Bảo Lộc ===
  {
    name: 'Trạm Dừng Bảo Lộc',
    type: 'point',
    city: 'Bảo Lộc',
    province: 'Lâm Đồng',
    address: 'QL20, TP. Bảo Lộc',
    coordinates: { lat: 11.5412, lng: 107.8098 },
    location: { type: 'Point', coordinates: [107.8098, 11.5412] },
    isActive: true,
  },
];

// ============================================================
// 2. OPERATORS - Nhà xe
// ============================================================
const operators = [
  {
    companyName: 'Nhà Xe Phương Trang (FUTA)',
    username: 'phuongtrang',
    operatorAuth: 'operator',
    email: 'contact@futabus.vn',
    phone: '1900 6067',
    password: '', // Sẽ hash bên dưới
    businessLicense: 'GP-001-SGDHCM',
    taxCode: '0301234567',
    address: '272 Đề Thám, Quận 1, TP. HCM',
    description:
      'Hãng xe khách lớn nhất Việt Nam với hơn 500 xe giường nằm và limousine.',
    status: 'approved',
    totalRoutes: 3,
    totalBuses: 2,
  },
  {
    companyName: 'Nhà Xe Hoàng Long',
    username: 'hoanglong',
    operatorAuth: 'operator',
    email: 'info@hoanglong.com.vn',
    phone: '1900 1717',
    password: '',
    businessLicense: 'GP-002-HNDHCM',
    taxCode: '0109876543',
    address: '28 Trần Nhật Duật, Hoàn Kiếm, Hà Nội',
    description: 'Nhà xe chất lượng cao tuyến Bắc - Nam và nội vùng Bắc Bộ.',
    status: 'approved',
    totalRoutes: 3,
    totalBuses: 2,
  },
];

// ============================================================
// 3. BUSES - Xe khách (sẽ gán operatorId sau)
// ============================================================
const buses = [
  // Xe Phương Trang
  {
    _operatorIndex: 0, // -> Phương Trang
    busNumber: '51B-12345',
    busType: 'sleeper',
    seatLayout: {
      floors: 2,
      rows: 10,
      columns: 3,
      layout: [
        ['A1', 'AISLE', 'A2'],
        ['A3', 'AISLE', 'A4'],
        ['A5', 'AISLE', 'A6'],
        ['A7', 'AISLE', 'A8'],
        ['A9', 'AISLE', 'A10'],
        ['B1', 'AISLE', 'B2'],
        ['B3', 'AISLE', 'B4'],
        ['B5', 'AISLE', 'B6'],
        ['B7', 'AISLE', 'B8'],
        ['B9', 'AISLE', 'B10'],
      ],
      totalSeats: 20,
    },
    amenities: ['wifi', 'ac', 'blanket', 'water', 'charging'],
    status: 'active',
  },
  {
    _operatorIndex: 0,
    busNumber: '51B-67890',
    busType: 'limousine',
    seatLayout: {
      floors: 1,
      rows: 4,
      columns: 3,
      layout: [
        ['VIP1', 'AISLE', 'VIP2'],
        ['VIP3', 'AISLE', 'VIP4'],
        ['VIP5', 'AISLE', 'VIP6'],
        ['VIP7', 'AISLE', 'VIP8'],
      ],
      totalSeats: 8,
    },
    amenities: [
      'wifi',
      'ac',
      'blanket',
      'water',
      'charging',
      'snack',
      'entertainment',
    ],
    status: 'active',
  },
  // Xe Hoàng Long
  {
    _operatorIndex: 1, // -> Hoàng Long
    busNumber: '29B-11111',
    busType: 'sleeper',
    seatLayout: {
      floors: 2,
      rows: 12,
      columns: 3,
      layout: [
        ['A1', 'AISLE', 'A2'],
        ['A3', 'AISLE', 'A4'],
        ['A5', 'AISLE', 'A6'],
        ['A7', 'AISLE', 'A8'],
        ['A9', 'AISLE', 'A10'],
        ['A11', 'AISLE', 'A12'],
        ['B1', 'AISLE', 'B2'],
        ['B3', 'AISLE', 'B4'],
        ['B5', 'AISLE', 'B6'],
        ['B7', 'AISLE', 'B8'],
        ['B9', 'AISLE', 'B10'],
        ['B11', 'AISLE', 'B12'],
      ],
      totalSeats: 24,
    },
    amenities: ['wifi', 'ac', 'blanket', 'water'],
    status: 'active',
  },
  {
    _operatorIndex: 1,
    busNumber: '29B-22222',
    busType: 'seater',
    seatLayout: {
      floors: 1,
      rows: 4,
      columns: 4,
      layout: [
        ['DRIVER', 'AISLE', 'C1', 'C2'],
        ['C3', 'AISLE', 'C4', 'C5'],
        ['C6', 'AISLE', 'C7', 'C8'],
        ['C9', 'AISLE', 'C10', 'C11'],
      ],
      totalSeats: 11,
    },
    amenities: ['ac', 'water'],
    status: 'active',
  },
];

// ============================================================
// HELPER: Tạo ngày trong tương lai
// ============================================================
function futureDate(
  daysFromNow: number,
  hour: number,
  minute: number = 0,
): Date {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, minute, 0, 0);
  return d;
}

// ============================================================
// MAIN SEED FUNCTION
// ============================================================
async function seed(): Promise<void> {
  const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/vexenhanh';
  console.log(`[Seed] Kết nối MongoDB: ${uri}`);
  await mongoose.connect(uri);

  const db = mongoose.connection.db;
  if (!db) throw new Error('Không thể kết nối DB');

  // Xóa dữ liệu cũ
  console.log('[Seed] Xóa dữ liệu cũ...');
  await db.collection('stoppoints').deleteMany({});
  await db.collection('operators').deleteMany({});
  await db.collection('buses').deleteMany({});
  await db.collection('routes').deleteMany({});
  await db.collection('trips').deleteMany({});
  await db.collection('bookings').deleteMany({});

  // === 1. SEED STOP POINTS ===
  console.log('[Seed] Tạo 10 StopPoints...');
  const insertedStops = await db
    .collection('stoppoints')
    .insertMany(stopPoints);
  const stopIds = Object.values(insertedStops.insertedIds);
  console.log(
    '  StopPoint IDs:',
    stopIds.map((id) => id.toString()),
  );

  // Map tên -> ID
  const BXMD = stopIds[0]; // Bến Xe Mi��n Đông Mới (station)
  const BXMT = stopIds[1]; // Bến Xe Miền Tây (station)
  const BXDL = stopIds[2]; // Bến Xe Đà Lạt (station)
  const BXNT = stopIds[3]; // Bến Xe Nha Trang (station)
  const BXNN = stopIds[4]; // Bến Xe Nước Ngầm - HN (station)
  const BXHP = stopIds[5]; // Bến Xe Hải Phòng (station)
  const VP_Q1 = stopIds[6]; // VP Phương Trang Q1 (pickup)
  const TRAM_PR = stopIds[7]; // Trạm Dừng Phan Rang (rest_stop)
  const TT_DL = stopIds[8]; // Trung tâm Đà L���t (dropoff)
  const TRAM_BL = stopIds[9]; // Trạm Dừng Bảo Lộc (point)

  // === 2. SEED OPERATORS ===
  console.log('[Seed] Tạo 2 Operators...');
  const hashedPw = await bcrypt.hash('Test@12345', 10);
  operators[0].password = hashedPw;
  operators[1].password = hashedPw;
  const insertedOps = await db.collection('operators').insertMany(operators);
  const opIds = Object.values(insertedOps.insertedIds);
  const PT_OP = opIds[0]; // Phương Trang
  const HL_OP = opIds[1]; // Hoàng Long

  // === 3. SEED BUSES ===
  console.log('[Seed] Tạo 4 Buses...');
  const busDocs = buses.map((b) => ({
    ...b,
    operatorId: opIds[b._operatorIndex],
  }));
  // Xóa trường tạm
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  busDocs.forEach((b: any) => delete b._operatorIndex);
  const insertedBuses = await db.collection('buses').insertMany(busDocs);
  const busIds = Object.values(insertedBuses.insertedIds);
  const BUS_PT_SLEEPER = busIds[0]; // Phương Trang Giường Nằm
  const BUS_PT_LIMOUSINE = busIds[1]; // Phương Trang Limousine
  const BUS_HL_SLEEPER = busIds[2]; // Hoàng Long Giường Nằm
  const BUS_HL_SEATER = busIds[3]; // Hoàng Long 11 Chỗ

  // === 4. SEED ROUTES (Unified format: stops[] with role) ===
  console.log('[Seed] Tạo 6 Routes (unified format)...');
  const routes = [
    // ── Phương Trang ──────────────────────────────────────────
    {
      operatorId: PT_OP,
      routeName: 'Sài Gòn - Đà Lạt',
      routeCode: 'PT-SGN-DL',
      stops: [
        {
          stopPointId: BXMD,
          role: 'origin',
          order: 0,
          estimatedArrivalMinutes: 0,
          stopDuration: 0,
          transitPickupIds: [VP_Q1], // Shuttle đón khách Q1 → đưa về BXMĐ
          transitDropoffIds: [],
        },
        {
          stopPointId: TRAM_BL,
          role: 'stop',
          order: 1,
          estimatedArrivalMinutes: 240,
          stopDuration: 20,
          transitPickupIds: [],
          transitDropoffIds: [],
        },
        {
          stopPointId: BXDL,
          role: 'destination',
          order: 2,
          estimatedArrivalMinutes: 420,
          stopDuration: 0,
          transitPickupIds: [],
          transitDropoffIds: [TT_DL], // Shuttle đưa khách từ BX Đà Lạt → trung tâm
        },
      ],
      distance: 310,
      estimatedDuration: 420, // 7 tiếng
      isActive: true,
    },
    {
      operatorId: PT_OP,
      routeName: 'Sài Gòn - Nha Trang',
      routeCode: 'PT-SGN-NT',
      stops: [
        {
          stopPointId: BXMD,
          role: 'origin',
          order: 0,
          estimatedArrivalMinutes: 0,
          stopDuration: 0,
          transitPickupIds: [VP_Q1],
          transitDropoffIds: [],
        },
        {
          stopPointId: TRAM_PR,
          role: 'stop',
          order: 1,
          estimatedArrivalMinutes: 360,
          stopDuration: 20,
          transitPickupIds: [],
          transitDropoffIds: [],
        },
        {
          stopPointId: BXNT,
          role: 'destination',
          order: 2,
          estimatedArrivalMinutes: 540,
          stopDuration: 0,
          transitPickupIds: [],
          transitDropoffIds: [],
        },
      ],
      distance: 440,
      estimatedDuration: 540, // 9 tiếng
      isActive: true,
    },
    {
      operatorId: PT_OP,
      routeName: 'Sài Gòn - Hà Nội',
      routeCode: 'PT-SGN-HN',
      stops: [
        {
          stopPointId: BXMD,
          role: 'origin',
          order: 0,
          estimatedArrivalMinutes: 0,
          stopDuration: 0,
          transitPickupIds: [VP_Q1],
          transitDropoffIds: [],
        },
        {
          stopPointId: BXNT,
          role: 'stop',
          order: 1,
          estimatedArrivalMinutes: 540,
          stopDuration: 30,
          transitPickupIds: [],
          transitDropoffIds: [],
        },
        {
          stopPointId: BXMT, // Dùng BX Miền Tây làm proxy cho Đà Nẵng (seed data)
          role: 'stop',
          order: 2,
          estimatedArrivalMinutes: 1080,
          stopDuration: 30,
          transitPickupIds: [],
          transitDropoffIds: [],
        },
        {
          stopPointId: BXNN,
          role: 'destination',
          order: 3,
          estimatedArrivalMinutes: 2040,
          stopDuration: 0,
          transitPickupIds: [],
          transitDropoffIds: [],
        },
      ],
      distance: 1730,
      estimatedDuration: 2040, // 34 tiếng
      isActive: true,
    },
    // ── Hoàng Long ────────────────────────────────────────────
    {
      operatorId: HL_OP,
      routeName: 'Hà Nội - Hải Phòng',
      routeCode: 'HL-HN-HP',
      stops: [
        {
          stopPointId: BXNN,
          role: 'origin',
          order: 0,
          estimatedArrivalMinutes: 0,
          stopDuration: 0,
          transitPickupIds: [],
          transitDropoffIds: [],
        },
        {
          stopPointId: BXHP,
          role: 'destination',
          order: 1,
          estimatedArrivalMinutes: 150,
          stopDuration: 0,
          transitPickupIds: [],
          transitDropoffIds: [],
        },
      ],
      distance: 120,
      estimatedDuration: 150, // 2.5 tiếng
      isActive: true,
    },
    {
      operatorId: HL_OP,
      routeName: 'Hà Nội - Sài Gòn',
      routeCode: 'HL-HN-SGN',
      stops: [
        {
          stopPointId: BXNN,
          role: 'origin',
          order: 0,
          estimatedArrivalMinutes: 0,
          stopDuration: 0,
          transitPickupIds: [],
          transitDropoffIds: [],
        },
        {
          stopPointId: BXMD,
          role: 'destination',
          order: 1,
          estimatedArrivalMinutes: 2040,
          stopDuration: 0,
          transitPickupIds: [],
          transitDropoffIds: [],
        },
      ],
      distance: 1730,
      estimatedDuration: 2040,
      isActive: true,
    },
    {
      operatorId: HL_OP,
      routeName: 'Sài Gòn - Hà Nội (Hoàng Long)',
      routeCode: 'HL-SGN-HN',
      stops: [
        {
          stopPointId: BXMD,
          role: 'origin',
          order: 0,
          estimatedArrivalMinutes: 0,
          stopDuration: 0,
          transitPickupIds: [],
          transitDropoffIds: [],
        },
        {
          stopPointId: BXNN,
          role: 'destination',
          order: 1,
          estimatedArrivalMinutes: 2040,
          stopDuration: 0,
          transitPickupIds: [],
          transitDropoffIds: [],
        },
      ],
      distance: 1730,
      estimatedDuration: 2040,
      isActive: true,
    },
  ];

  const insertedRoutes = await db.collection('routes').insertMany(routes);
  const routeIds = Object.values(insertedRoutes.insertedIds);

  // === 5. SEED TRIPS ===
  console.log('[Seed] Tạo 10 Trips (trong 7 ngày tới)...');
  const trips = [
    // ===== PH��ƠNG TRANG =====
    // SGN -> Đà Lạt (Sáng)
    {
      routeId: routeIds[0],
      busId: BUS_PT_LIMOUSINE,
      operatorId: PT_OP,
      departureTime: futureDate(1, 8, 0),
      arrivalTime: futureDate(1, 15, 0),
      basePrice: 350000,
      discount: 0,
      finalPrice: 350000,
      totalSeats: 8,
      availableSeats: 8,
      status: 'scheduled',
      bookedSeats: [],
    },
    // SGN -> Đà Lạt (Tối)
    {
      routeId: routeIds[0],
      busId: BUS_PT_SLEEPER,
      operatorId: PT_OP,
      departureTime: futureDate(1, 22, 0),
      arrivalTime: futureDate(2, 5, 0),
      basePrice: 280000,
      discount: 10,
      finalPrice: 252000,
      totalSeats: 20,
      availableSeats: 20,
      status: 'scheduled',
      bookedSeats: [],
    },
    // SGN -> Nha Trang
    {
      routeId: routeIds[1],
      busId: BUS_PT_SLEEPER,
      operatorId: PT_OP,
      departureTime: futureDate(2, 20, 0),
      arrivalTime: futureDate(3, 5, 0),
      basePrice: 350000,
      discount: 0,
      finalPrice: 350000,
      totalSeats: 20,
      availableSeats: 20,
      status: 'scheduled',
      bookedSeats: [],
    },
    // SGN -> Hà Nội (Phương Trang - Giường nằm)
    {
      routeId: routeIds[2],
      busId: BUS_PT_SLEEPER,
      operatorId: PT_OP,
      departureTime: futureDate(3, 18, 0),
      arrivalTime: futureDate(5, 4, 0),
      basePrice: 850000,
      discount: 5,
      finalPrice: 807500,
      totalSeats: 20,
      availableSeats: 20,
      status: 'scheduled',
      bookedSeats: [],
    },
    // SGN -> Hà Nội (Phương Trang - Ngày khác)
    {
      routeId: routeIds[2],
      busId: BUS_PT_SLEEPER,
      operatorId: PT_OP,
      departureTime: futureDate(4, 18, 0),
      arrivalTime: futureDate(6, 4, 0),
      basePrice: 850000,
      discount: 0,
      finalPrice: 850000,
      totalSeats: 20,
      availableSeats: 20,
      status: 'scheduled',
      bookedSeats: [],
    },

    // ===== HOÀNG LONG =====
    // HN -> Hải Phòng (Sáng - Ngày D+5)
    {
      routeId: routeIds[3],
      busId: BUS_HL_SEATER,
      operatorId: HL_OP,
      departureTime: futureDate(5, 7, 0),
      arrivalTime: futureDate(5, 9, 30),
      basePrice: 120000,
      discount: 0,
      finalPrice: 120000,
      totalSeats: 11,
      availableSeats: 11,
      status: 'scheduled',
      bookedSeats: [],
    },
    // HN -> Hải Phòng (Trưa - Ngày D+5)
    {
      routeId: routeIds[3],
      busId: BUS_HL_SEATER,
      operatorId: HL_OP,
      departureTime: futureDate(5, 12, 0),
      arrivalTime: futureDate(5, 14, 30),
      basePrice: 120000,
      discount: 0,
      finalPrice: 120000,
      totalSeats: 11,
      availableSeats: 11,
      status: 'scheduled',
      bookedSeats: [],
    },
    // HN -> SGN (Hoàng Long)
    {
      routeId: routeIds[4],
      busId: BUS_HL_SLEEPER,
      operatorId: HL_OP,
      departureTime: futureDate(3, 19, 0),
      arrivalTime: futureDate(5, 5, 0),
      basePrice: 800000,
      discount: 0,
      finalPrice: 800000,
      totalSeats: 24,
      availableSeats: 24,
      status: 'scheduled',
      bookedSeats: [],
    },
    // SGN -> HN (Hoàng Long - cùng ngày với PT để test Cross-Operator)
    {
      routeId: routeIds[5],
      busId: BUS_HL_SLEEPER,
      operatorId: HL_OP,
      departureTime: futureDate(3, 17, 0),
      arrivalTime: futureDate(5, 3, 0),
      basePrice: 780000,
      discount: 0,
      finalPrice: 780000,
      totalSeats: 24,
      availableSeats: 24,
      status: 'scheduled',
      bookedSeats: [],
    },
    // HN -> HP (D+5, match cho Cross-operator transfer)
    {
      routeId: routeIds[3],
      busId: BUS_HL_SEATER,
      operatorId: HL_OP,
      departureTime: futureDate(5, 8, 30),
      arrivalTime: futureDate(5, 11, 0),
      basePrice: 130000,
      discount: 0,
      finalPrice: 130000,
      totalSeats: 11,
      availableSeats: 11,
      status: 'scheduled',
      bookedSeats: [],
    },
  ];

  await db.collection('trips').insertMany(trips);

  // === IN KẾT QUẢ ===
  console.log('\n========================================');
  console.log('SEED HOAN TAT! Du lieu da san sang.');
  console.log('========================================\n');

  console.log('STOP POINTS:');
  console.log(`  [0] Ben Xe Mien Dong Moi   : ${BXMD.toString()} (station)`);
  console.log(`  [1] Ben Xe Mien Tay         : ${BXMT.toString()} (station)`);
  console.log(`  [2] Ben Xe Da Lat           : ${BXDL.toString()} (station)`);
  console.log(`  [3] Ben Xe Nha Trang        : ${BXNT.toString()} (station)`);
  console.log(`  [4] Ben Xe Nuoc Ngam (HN)   : ${BXNN.toString()} (station)`);
  console.log(`  [5] Ben Xe Hai Phong        : ${BXHP.toString()} (station)`);
  console.log(`  [6] VP Phuong Trang Q1      : ${VP_Q1.toString()} (pickup)`);
  console.log(
    `  [7] Tram Dung Phan Rang     : ${TRAM_PR.toString()} (rest_stop)`,
  );
  console.log(`  [8] Trung tam Da Lat        : ${TT_DL.toString()} (dropoff)`);
  console.log(`  [9] Tram Dung Bao Loc       : ${TRAM_BL.toString()} (point)`);

  console.log('\nOPERATORS:');
  console.log(`  Phuong Trang : ${PT_OP.toString()}`);
  console.log(`  Hoang Long   : ${HL_OP.toString()}`);
  console.log(`  Password chung: Test@12345`);

  console.log('\nBUSES:');
  console.log(`  PT Sleeper (20 ghe)  : ${BUS_PT_SLEEPER.toString()}`);
  console.log(`  PT Limousine (8 ghe) : ${BUS_PT_LIMOUSINE.toString()}`);
  console.log(`  HL Sleeper (24 ghe)  : ${BUS_HL_SLEEPER.toString()}`);
  console.log(`  HL Seater (11 ghe)   : ${BUS_HL_SEATER.toString()}`);

  console.log('\nROUTES (unified format):');
  routeIds.forEach((id, i) => {
    const r = routes[i];
    const transitCount = r.stops.reduce(
      (sum, s) =>
        sum +
        (s.transitPickupIds?.length ?? 0) +
        (s.transitDropoffIds?.length ?? 0),
      0,
    );
    console.log(
      `  [${i}] ${r.routeCode} | ${r.routeName} | ${r.stops.length} stops | ${transitCount} transit points | ${id.toString()}`,
    );
  });

  console.log('\nDung cac ID tren de test o Swagger/Postman!');
  console.log(
    'Ngay test Transfer SGN->HP: Ngay D+3 (khoi hanh) den D+5 (toi HN roi di HP)',
  );

  await mongoose.disconnect();
  console.log('[Seed] Da ngat ket noi MongoDB.');
}

seed().catch((err) => {
  console.error('[Seed] LOI:', err);
  process.exit(1);
});
