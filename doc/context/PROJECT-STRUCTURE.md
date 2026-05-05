# Project Structure

Tài liệu này mô tả cấu trúc thư mục hiện tại của project `Ve_Xe_Nhanh_NestJS_NextJs_ReactNative`.

Nguyên tắc ghi nhận:

- Đây là snapshot của cấu trúc hiện tại trong repo local.
- Đã lược bớt các thư mục/generated artifacts quá lớn hoặc ít giá trị đọc tay như `node_modules`, `.git`, `.next`, `dist`, `build`, `coverage`, `.expo`, `.turbo`.
- `docker/osrm/data/` chỉ được mô tả gọn vì chứa nhiều file dữ liệu sinh tự động từ OSRM.

## 1. Cấu trúc tổng thể

```text
Ve_Xe_Nhanh_NestJS_NextJs_ReactNative
|-- .github/
|   `-- workflows/
|       `-- ci.yml
|-- .vscode/
|   |-- extensions.json
|   |-- launch.json
|   `-- settings.json
|-- apps/
|   |-- backend/
|   |-- frontend/
|   `-- mobile/
|-- docker/
|   |-- osrm/
|   |   |-- data/
|   |   `-- prepare-data.sh
|   `-- docker-compose.yml
|-- packages/
|   |-- api-client/
|   `-- shared-types/
|-- .gitignore
|-- .prettierrc
|-- package.json
|-- package-lock.json
|-- PROJECT-STRUCTURE.md
|-- README.md
|-- TECH-STACK.md
`-- tsconfig.base.json
```

## 2. Thư mục `apps`

```text
apps/
|-- backend/
|   |-- src/
|   |   |-- common/
|   |   |-- config/
|   |   |-- database/
|   |   |-- modules/
|   |   |-- app.controller.ts
|   |   |-- app.module.ts
|   |   |-- app.service.ts
|   |   `-- main.ts
|   |-- test/
|   |-- .env
|   |-- .env.development
|   |-- .env.example
|   |-- .env.production
|   |-- .prettierrc
|   |-- .swcrc
|   |-- eslint.config.mjs
|   |-- nest-cli.json
|   |-- package.json
|   |-- README.md
|   |-- tsconfig.build.json
|   `-- tsconfig.json
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- app/
|   |   |-- components/
|   |   `-- theme/
|   |-- .gitignore
|   |-- AGENTS.md
|   |-- eslint.config.mjs
|   |-- next.config.ts
|   |-- next-env.d.ts
|   |-- package.json
|   |-- postcss.config.mjs
|   |-- README.md
|   |-- tsconfig.json
|   `-- tsconfig.tsbuildinfo
`-- mobile/
    |-- src/
    |   |-- app/
    |   |-- lib/
    |   |-- providers/
    |   `-- store/
    |-- app.json
    |-- babel.config.js
    |-- eas.json
    |-- eslint.config.mjs
    |-- expo-env.d.ts
    |-- metro.config.js
    |-- package.json
    |-- README.md
    `-- tsconfig.json
```

## 3. Backend chi tiết

```text
apps/backend/src
|-- common/
|   |-- constants/
|   |-- decorators/
|   |-- dto/
|   |-- filters/
|   |-- guards/
|   |-- interceptors/
|   |-- interfaces/
|   `-- pipes/
|-- config/
|   `-- config.module.ts
|-- database/
|   |-- seeds/
|   `-- database.module.ts
|-- modules/
|   |-- admin/
|   |-- auth/
|   |-- bookings/
|   |-- buses/
|   |-- employees/
|   |-- operators/
|   |-- osrm/
|   |-- redis/
|   |-- routes/
|   |-- search/
|   |-- stop-points/
|   |-- trips/
|   `-- users/
|-- app.controller.ts
|-- app.module.ts
|-- app.service.ts
`-- main.ts
```

Ghi chú:

- `common/` chứa hạ tầng dùng chung như decorators, guards, filters, interceptors và pipes.
- `database/` chứa module kết nối DB và seed data.
- `modules/` là vùng nghiệp vụ chính của backend theo module pattern của NestJS.
- `osrm/` và `redis/` là các tích hợp hạ tầng phục vụ định tuyến, cache và queue.

## 4. Frontend chi tiết

```text
apps/frontend/src
|-- app/
|   |-- (admin)/
|   |-- (operator)/
|   |-- (operator-auth)/
|   |-- (public)/
|   |-- favicon.ico
|   |-- globals.css
|   |-- layout.tsx
|   `-- page.tsx
|-- components/
|   `-- icons/
|       |-- admin/
|       |-- customer/
|       |-- operator/
|       |-- shared/
|       |-- index.ts
|       `-- README.md
`-- theme/
    |-- admin/
    |-- customer/
    |-- operator/
    |-- shared/
    |-- index.css
    `-- README.md
```

Ghi chú:

- `app/` đang dùng route groups của Next.js App Router: `(admin)`, `(operator)`, `(operator-auth)`, `(public)`.
- `components/icons/` tách icon theo từng domain giao diện.
- `theme/` tách theme theo scope `admin`, `customer`, `operator` và phần shared.

## 5. Mobile chi tiết

```text
apps/mobile
|-- src/
|   |-- app/
|   |   |-- _layout.tsx
|   |   |-- index.tsx
|   |   `-- stack.tsx
|   |-- lib/
|   |   |-- api-client.ts
|   |   |-- env.ts
|   |   |-- query-client.ts
|   |   `-- token-storage.ts
|   |-- providers/
|   |   `-- app-provider.tsx
|   `-- store/
|       `-- auth-store.ts
|-- app.json
|-- babel.config.js
|-- eas.json
|-- eslint.config.mjs
|-- expo-env.d.ts
|-- metro.config.js
|-- package.json
|-- README.md
`-- tsconfig.json
```

Ghi chú:

- `src/app/` là entry routing của Expo Router.
- `src/lib/` chứa API client wiring, env, query client và token storage.
- `src/providers/` gom các provider mức ứng dụng.
- `src/store/` hiện có auth store.

## 6. Packages dùng chung

```text
packages/
|-- api-client/
|   |-- src/
|   |   |-- create-api-client.ts
|   |   |-- index.ts
|   |   `-- types.ts
|   |-- package.json
|   `-- tsconfig.json
`-- shared-types/
    |-- src/
    |   |-- admin.types.ts
    |   |-- api.types.ts
    |   |-- booking.types.ts
    |   |-- bus.types.ts
    |   |-- constants.ts
    |   |-- enums.ts
    |   |-- index.ts
    |   |-- operator.types.ts
    |   |-- payment.types.ts
    |   |-- route.types.ts
    |   |-- stop-point.types.ts
    |   |-- ticket.types.ts
    |   |-- trip.types.ts
    |   `-- user.types.ts
    |-- package.json
    `-- tsconfig.json
```

Ghi chú:

- `packages/api-client/` là client API dùng chung cho frontend/mobile.
- `packages/shared-types/` là nguồn DTO/type/enums dùng chung toàn hệ thống.

## 7. Docker và hạ tầng local

```text
docker/
|-- osrm/
|   |-- data/
|   |   `-- vietnam-latest.*  (nhiều file dữ liệu OSRM đã được prepare)
|   `-- prepare-data.sh
`-- docker-compose.yml
```

Ghi chú:

- `docker-compose.yml` đang gom MongoDB, Redis, Mongo Express, Redis Commander và OSRM.
- `osrm/data/` chứa dữ liệu map Việt Nam và các artifact routing được tạo sau khi prepare.
