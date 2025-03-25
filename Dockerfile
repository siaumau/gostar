# 使用輕量的 Node.js 版本
FROM node:18-alpine

# 建立 app 的工作目錄
WORKDIR /app

# 複製 package*.json（為了安裝依賴）
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製所有專案檔案
COPY . .

# 開放應用使用的 port（根據你 deploy.sh 設定是 3000）
EXPOSE 3000

# 啟動應用（根據你 package.json 裡的 "start" 指令）
CMD ["npm", "start"]
