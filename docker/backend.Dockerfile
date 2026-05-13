ARG NODE_VERSION=22.22.2
ARG NPM_VERSION=11.14.1
ARG NODE_IMAGE=node:${NODE_VERSION}-bookworm-slim

FROM ${NODE_IMAGE} AS base
ARG NPM_VERSION
RUN npm install --global npm@${NPM_VERSION}
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
COPY .npmrc .npmrc
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json
COPY apps/mobile/package.json apps/mobile/package.json
COPY packages/api-client/package.json packages/api-client/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json
RUN npm ci

FROM deps AS build
COPY . .
RUN npm run build:backend

FROM base AS runtime
ENV NODE_ENV=production
COPY package.json package-lock.json ./
COPY .npmrc .npmrc
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json
COPY apps/mobile/package.json apps/mobile/package.json
COPY packages/api-client/package.json packages/api-client/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json
RUN npm ci --omit=dev --workspace=apps/backend --workspace=packages/shared-types --workspace=packages/api-client --include-workspace-root=false
COPY --from=build /app/apps/backend/dist apps/backend/dist
COPY --from=build /app/packages/shared-types packages/shared-types
COPY --from=build /app/packages/api-client packages/api-client
WORKDIR /app/apps/backend
EXPOSE 3000
CMD ["node", "dist/src/main.js"]
