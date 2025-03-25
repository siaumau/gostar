# 使用 Node.js 環境
FROM node:18-alpine

# 建立工作目錄
WORKDIR /app

# 複製必要檔案並安裝
COPY . .
RUN npm install && npm run build

# 開啟 vite preview port（預設為 4173）
EXPOSE 4173

# 啟動應用
CMD ["npm", "run", "preview"]
