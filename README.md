# QuickTalk

## 簡介

簡單即時聊天網頁，採全端開發，提供公開聊天室，私人聊天，搜尋使用者及交友等功能。

部署於 AWS:[QuickTalk](https://www.quicktalk.xyz/)

可使用此帳號進行操作：

```
使用者email: user1@example.com
使用者密碼：12345678
```

## 目錄

- [功能](#功能)
- [安裝](#安裝)
  - [取得環境變數](#取得環境變數)
- [使用套件](#使用套件)

## 功能

登入:  
![demo 登入](https://github.com/HuangYiLun/side-project-realtime-chatroom/public/assets/demo-login.gif)

註冊:
![demo 註冊](https://github.com/HuangYiLun/side-project-realtime-chatroom/public/assets/demo-register.gif)

編輯個人頁面:
![demo 編輯個人頁面](https://github.com/HuangYiLun/side-project-realtime-chatroom/public/assets/demo-edit.gif)

交友功能
![demo 交友功能](https://github.com/HuangYiLun/side-project-realtime-chatroom/public/assets/demo-friends.gif)

公開聊天室:
![demo 公開聊天室](https://github.com/HuangYiLun/side-project-realtime-chatroom/public/assets/demo-public-chats.gif)

1on1 聊天室:
![demo 私人聊天是](https://github.com/HuangYiLun/side-project-realtime-chatroom/public/assets/demo-1on1-chats.gif)

## 安裝 (如果打算在本地運行)

1. 請先確認安裝 Node.js (18.17.1) 與 npm
2. 創建一個資料夾, 打開 Terminal, 使用`cd`指令進入剛創建的資料夾
3. 將專案 clone 到本地:

```
git clone https://github.com/HuangYiLun/side-project-realtime-chatroom.git
```

4. 在專案內新增 temp 資料夾（用以管理暫存圖片使用）， 再將 .env.example 檔案改名成 .env ，並根據檔案中使用到的環境變數名稱填入相應的資料(本專案使用 mongodb 做為資料庫，必須準備 mongodb uri 才能成正常使用)。

5. CD 進入您剛剛建立的資料夾，輸入以下指令自動安裝所需套件:

```
npm install
```

6. 安裝完套件後，輸入以下指令建立種子資料:

```
npm run seed
```

7. 輸入以下指令啟動:

```
npm run dev
```

8. 在終端機輸入 "ctrl + c" 可終止專案運行

## 使用技術
**Client:**  Javascript / HTML / Bootstrap / Socket.IO / axios

**Server:** Node / Express / Socket.IO / Passport / multer / imgur

**Database:** mongoose / MongoDB Atlas

**AWS Cloud service:** Elastic Beanstalk / Route 53 / EC2
