#!/bin/bash

# === 參數區（可修改） ===
REPO_URL="https://github.com/siaumau/gostar"
PROJECT_DIR="/opt/myapp"
IMAGE_NAME="myapp-image"
CONTAINER_NAME="myapp-container"
CONTAINER_PORT=4173
HOST_PORT=80

# === 開始部署 ===
echo "🚀 開始部署..."

# 1. Clone 或更新專案
if [ -d "$PROJECT_DIR/.git" ]; then
  echo "📦 專案已存在，執行 git pull"
  cd "$PROJECT_DIR" && git pull
else
  echo "📥 Clone 專案"
  git clone "$REPO_URL" "$PROJECT_DIR"
  cd "$PROJECT_DIR"
fi

# 2. 建立 Docker image
echo "🔨 建立 Docker image: $IMAGE_NAME"
docker build -t "$IMAGE_NAME" .

# 3. 停止並刪除舊 container
if docker ps -a --format '{{.Names}}' | grep -Eq "^${CONTAINER_NAME}$"; then
  echo "🧹 停止並移除舊 container"
  docker stop "$CONTAINER_NAME"
  docker rm "$CONTAINER_NAME"
fi

# 4. 啟動新的 container
echo "🚀 啟動新的 container"
docker run -d --name "$CONTAINER_NAME" -p "$HOST_PORT":"$CONTAINER_PORT" "$IMAGE_NAME"

# 5. 檢查 container 是否啟動成功
echo "🔍 檢查 container 狀態..."
docker ps --filter "name=$CONTAINER_NAME"

if ! docker ps --filter "name=$CONTAINER_NAME" --format '{{.Names}}' | grep -q "$CONTAINER_NAME"; then
  echo "❌ Container 啟動失敗，顯示 log："
  docker logs "$CONTAINER_NAME"
else
  echo "✅ Container 正常執行中！"
fi

echo "✅ 部署完成！"
