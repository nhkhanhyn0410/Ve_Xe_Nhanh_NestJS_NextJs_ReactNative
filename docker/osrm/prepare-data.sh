#!/bin/bash
# ──────────────────────────────────────────────────────────────────────
# Chuẩn bị dữ liệu OSRM cho Việt Nam (chạy 1 lần duy nhất).
#
# Yêu cầu: Docker đã cài sẵn.
# Dữ liệu OSM (~100 MB) sẽ được tải về và xử lý trong thư mục này.
# Sau khi chạy xong, `docker compose up osrm` sẽ hoạt động.
# ──────────────────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DATA_DIR="$SCRIPT_DIR/data"
PBF_FILE="vietnam-latest.osm.pbf"
OSRM_IMAGE="osrm/osrm-backend:latest"
PROFILE="/opt/car.lua"

mkdir -p "$DATA_DIR"
cd "$DATA_DIR"

# 1. Tải bản đồ Việt Nam từ Geofabrik (nếu chưa có)
if [ ! -f "$PBF_FILE" ]; then
  echo "▸ Đang tải $PBF_FILE từ Geofabrik..."
  curl -L -o "$PBF_FILE" "https://download.geofabrik.de/asia/vietnam-latest.osm.pbf"
else
  echo "▸ $PBF_FILE đã tồn tại, bỏ qua tải."
fi

# 2. Extract
echo "▸ osrm-extract (có thể mất 5-10 phút)..."
docker run --rm -t -v "$DATA_DIR:/data" "$OSRM_IMAGE" \
  osrm-extract -p "$PROFILE" "/data/$PBF_FILE"

# 3. Partition (MLD algorithm)
echo "▸ osrm-partition..."
docker run --rm -t -v "$DATA_DIR:/data" "$OSRM_IMAGE" \
  osrm-partition "/data/vietnam-latest.osrm"

# 4. Customize
echo "▸ osrm-customize..."
docker run --rm -t -v "$DATA_DIR:/data" "$OSRM_IMAGE" \
  osrm-customize "/data/vietnam-latest.osrm"

echo ""
echo "✓ Hoàn tất! Giờ có thể chạy: npm run docker:dev"
echo "  OSRM sẽ lắng nghe tại http://localhost:5000"
