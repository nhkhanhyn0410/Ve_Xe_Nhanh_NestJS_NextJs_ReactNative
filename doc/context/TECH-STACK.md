# Tech Stack

Tài liệu này liệt kê tech stack của project `Ve_Xe_Nhanh_NestJS_NextJs_ReactNative` theo version đang được khóa trong repo tại thời điểm hiện tại.

Nguồn dữ liệu:

- `package.json` ở root và từng workspace
- `package-lock.json` để lấy installed version thực tế
- `docker/docker-compose.yml` để lấy version image/service

Quy ước:

- `Khai báo`: version/range trong `package.json`
- `Khóa hiện tại`: version thực tế đang có trong `package-lock.json`
- `Workspace`: package nội bộ trong monorepo

## 1. Monorepo và công cụ gốc

| Thành phần | Khai báo | Khóa hiện tại | Ghi chú |
| --- | --- | --- | --- |
| Monorepo | `npm workspaces` | `apps/*`, `packages/*` | Root package version `1.0.0` |
| Lockfile | `package-lock.json` | `lockfileVersion: 3` | npm lock hiện tại của repo |
| Node.js | Không khai báo | Chưa pin cứng | Không có `engines`, `packageManager`, `.nvmrc`, `.node-version` |
| npm | Không khai báo | Chưa pin cứng | Chỉ suy ra đang dùng npm qua `package-lock.json` |
| TypeScript (toàn repo) | `^5.x` ở nhiều workspace | `5.9.3` | Bản đang được cài dùng chung phần lớn workspace |
| `@swc/cli` | `^0.8.1` | `0.8.1` | Root devDependency |
| `@swc/core` | `^1.15.30` | `1.15.30` | Root devDependency |
| `concurrently` | `^8.2.0` | `8.2.2` | Root devDependency |
| `prettier` | `^3.1.0` | `3.8.1` | Root cài thực tế; backend khai báo riêng `^3.4.2` |

## 2. Backend (`apps/backend`)

Workspace version: `0.0.1`

| Thành phần | Khai báo | Khóa hiện tại | Ghi chú |
| --- | --- | --- | --- |
| NestJS core/common/platform-express/platform-socket.io/websockets | `^11.1.19` | `11.1.19` | Framework backend chính |
| `@nestjs/axios` | `^4.0.1` | `4.0.1` | HTTP client module |
| `@nestjs/config` | `^4.0.4` | `4.0.4` | Config module |
| `@nestjs/bull` | `^11.0.4` | `11.0.4` | Queue integration |
| `@nestjs/jwt` | `^11.0.2` | `11.0.2` | JWT auth |
| `@nestjs/mongoose` | `^11.0.4` | `11.0.4` | Mongo integration |
| `@nestjs/passport` | `^11.0.5` | `11.0.5` | Passport integration |
| `@nestjs/schedule` | `^6.1.3` | `6.1.3` | Scheduler/cron |
| `@nestjs/swagger` | `^11.4.1` | `11.4.1` | API docs |
| `@nestjs/throttler` | `^6.5.0` | `6.5.0` | Rate limiting |
| `mongoose` | `^9.3.3` | `9.3.3` | ODM cho MongoDB |
| `ioredis` | `^5.10.1` | `5.10.1` | Redis client |
| `bull` | `^4.16.5` | `4.16.5` | Queue engine |
| `socket.io` | `^4.8.3` | `4.8.3` | Realtime transport |
| `passport` | `^0.7.0` | `0.7.0` | Auth middleware |
| `passport-jwt` | `^4.0.1` | `4.0.1` | JWT strategy |
| `passport-local` | `^1.0.0` | `1.0.0` | Local strategy |
| `bcryptjs` | `^3.0.3` | `3.0.3` | Password hashing |
| `class-transformer` | `^0.5.1` | `0.5.1` | DTO transform |
| `class-validator` | `^0.14.4` | `0.14.4` | DTO validation |
| `helmet` | `^8.1.0` | `8.1.0` | HTTP security headers |
| `joi` | `^18.1.2` | `18.1.2` | Schema validation |
| `nanoid` | `^3.3.11` | `3.3.11` | ID generator |
| `rxjs` | `^7.8.1` | `7.8.2` | Reactive primitives |
| `swagger-ui-express` | `^5.0.1` | `5.0.1` | Swagger UI |
| `winston` | `^3.19.0` | `3.19.0` | Logging |
| `eslint` | `^9.18.0` | `9.39.4` | Linting |
| `jest` | `^30.0.0` | `30.3.0` | Unit/e2e test runner |
| `ts-jest` | `^29.2.5` | `29.4.6` | TypeScript test transform |
| `ts-node` | `^10.9.2` | `10.9.2` | TS execution |
| `typescript` | `^5.7.3` | `5.9.3` | Compile/typecheck |
| `@ve_xe_nhanh_ts/shared-types` | `*` | Workspace `1.0.0` | Package nội bộ |

## 3. Frontend Web (`apps/frontend`)

Workspace version: `0.1.0`

| Thành phần | Khai báo | Khóa hiện tại | Ghi chú |
| --- | --- | --- | --- |
| `next` | `16.2.4` | `16.2.4` | App Router web |
| `react` | `19.2.4` | `19.2.4` | UI runtime |
| `react-dom` | `19.2.4` | `19.2.4` | DOM renderer |
| `antd` | `^6.3.5` | `6.3.5` | UI component library |
| `@ant-design/icons` | `^6.1.1` | `6.1.1` | Icon set |
| `@ant-design/nextjs-registry` | `^1.3.0` | `1.3.0` | Ant Design + Next integration |
| `tailwindcss` | `^4` | `4.2.2` | Utility CSS |
| `@tailwindcss/postcss` | `^4` | `4.2.2` | Tailwind PostCSS |
| `@tailwindcss/node` | `^4.2.2` | `4.2.2` | Tailwind Node tooling |
| `@tanstack/react-query` | `^5.96.1` | `5.96.1` | Server-state management |
| `react-hook-form` | `^7.72.0` | `7.72.0` | Form handling |
| `@hookform/resolvers` | `^5.2.2` | `5.2.2` | Resolver bridge |
| `zod` | `^4.3.6` | `4.3.6` | Schema validation |
| `zustand` | `^5.0.12` | `5.0.12` | Client-state management |
| `recharts` | `^3.8.1` | `3.8.1` | Charting |
| `socket.io-client` | `^4.8.3` | `4.8.3` | Realtime client |
| `typescript` | `^5` | `5.9.3` | Compile/typecheck |
| `eslint` | `^9` | `9.39.4` | Linting |
| `eslint-config-next` | `16.2.4` | `16.2.4` | Next ESLint config |
| `eslint-plugin-tailwindcss` | `^4.0.0-beta.0` | `4.0.0-beta.0` | Tailwind lint rules |
| `eslint-plugin-tailwind-canonical-classes` | `^1.3.2` | `1.3.2` | Canonical class ordering |
| `@ve_xe_nhanh_ts/api-client` | `*` | Workspace `1.0.0` | API client nội bộ |

## 4. Mobile (`apps/mobile`)

Workspace version: `1.0.0`

| Thành phần | Khai báo | Khóa hiện tại | Ghi chú |
| --- | --- | --- | --- |
| `expo` | `^55.0.17` | `55.0.17` | Expo SDK |
| `expo-router` | `~55.0.13` | `55.0.13` | Router cho Expo |
| `expo-constants` | `^55.0.15` | `55.0.15` | Constants/runtime info |
| `expo-linking` | `^55.0.14` | `55.0.14` | Deep link handling |
| `expo-secure-store` | `^55.0.13` | `55.0.13` | Secure storage |
| `expo-status-bar` | `^3.0.8` | `3.0.9` | Status bar handling |
| `react` | `19.2.0` | `19.2.0` | Mobile React runtime |
| `react-native` | `0.83.2` | `0.83.2` | Native runtime |
| `react-native-safe-area-context` | `^5.6.2` | `5.7.0` | Safe area support |
| `react-native-screens` | `^4.16.0` | `4.24.0` | Native screen primitives |
| `@tanstack/react-query` | `^5.96.1` | `5.96.1` | Server-state management |
| `react-hook-form` | `^7.72.0` | `7.72.0` | Form handling |
| `@hookform/resolvers` | `^5.2.2` | `5.2.2` | Resolver bridge |
| `zod` | `^4.3.6` | `4.3.6` | Schema validation |
| `zustand` | `^5.0.12` | `5.0.12` | Client-state management |
| `typescript` | `^5.9.3` | `5.9.3` | Compile/typecheck |
| `eslint` | `^9` | `9.39.4` | Linting |
| `@ve_xe_nhanh_ts/api-client` | `*` | Workspace `1.0.0` | API client nội bộ |
| `@ve_xe_nhanh_ts/shared-types` | `*` | Workspace `1.0.0` | Shared DTO/types |

## 5. Packages nội bộ

| Package | Workspace version | Thành phần chính | Khóa hiện tại | Ghi chú |
| --- | --- | --- | --- | --- |
| `@ve_xe_nhanh_ts/shared-types` | `1.0.0` | `typescript` | `5.9.3` | Chia sẻ kiểu dữ liệu giữa backend/frontend/mobile |
| `@ve_xe_nhanh_ts/api-client` | `1.0.0` | `axios` | `1.15.2` | Client gọi API dùng chung |

## 6. Hạ tầng và dịch vụ Docker

| Service | Khai báo trong repo | Mức pin hiện tại | Ghi chú |
| --- | --- | --- | --- |
| MongoDB | `mongo:7.0` | Pin tới major.minor | Chưa pin patch version |
| Redis | `redis:7-alpine` | Pin tới major + distro | Chưa pin minor/patch |
| Mongo Express | `mongo-express` | Không pin cứng | Không chỉ định tag |
| Redis Commander | `rediscommander/redis-commander:latest` | Không pin cứng | Dùng `latest` |
| OSRM | `osrm/osrm-backend:latest` | Không pin cứng | Dùng `latest` |
| Docker Compose schema | `version: '3.8'` | Pin theo file | Khai báo trong `docker/docker-compose.yml` |

## 7. Các điểm cần lưu ý về version cứng

- Repo đang pin cứng tốt nhất ở tầng JavaScript package nhờ `package-lock.json`.
- `frontend` pin cứng `next`, `react`, `react-dom`; `mobile` pin cứng `react`, `react-native`, `expo-router`.
- `Node.js` và `npm` chưa được pin cứng ở repo level. Nếu cần reproducible environment mạnh hơn, nên thêm `engines`, `packageManager` hoặc `.nvmrc`.
- Một số Docker image chưa pin cứng hoặc chỉ pin ở mức major/minor. Nếu cần môi trường build/deploy ổn định hơn, nên đổi sang tag cụ thể thay vì `latest`.
