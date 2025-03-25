# GoStar - GitHub 趨勢排行

GoStar 是一個簡潔的 React 應用程式，用於顯示 GitHub 上最受歡迎的開源專案。

## 功能

- 查看 GitHub 上的熱門專案
- 可依不同時間範圍篩選：今日、本週、本月、今年
- 顯示專案詳細資訊：擁有者、星數、程式語言、分支數

## 技術棧

- React 18
- TypeScript
- Tailwind CSS
- Vite
- date-fns

## 開始使用

### 必要條件

- Node.js 16+
- npm 或 yarn

### 安裝

```bash
# 安裝依賴
npm install
# 或
yarn
```

### 開發

```bash
npm run dev
# 或
yarn dev
```

### 建置

```bash
npm run build
# 或
yarn build
```

### 部署注意事項

#### Windows 用戶注意事項

如果您在 Windows 環境下編輯部署腳本（如 `deploy.sh`），可能會遇到以下錯誤：

```bash
-bash: ./deploy.sh: /bin/bash^M: bad interpreter: No such file or directory
```

這是因為 Windows 和 Unix/Linux 系統使用不同的換行符號所導致。要解決這個問題，您可以：

1. 使用以下命令修復腳本：
```bash
sed -i 's/\r//' deploy.sh
```

2. 確保腳本具有執行權限：
```bash
chmod +x deploy.sh
```

建議在編輯部署腳本時使用支援 Unix 風格換行符號（LF）的編輯器，或在編輯器中將檔案格式設定為 "LF" 而非 "CRLF"。

## 授權

MIT
