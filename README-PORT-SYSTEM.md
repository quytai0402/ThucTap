# 🚀 Dynamic Port Configuration System

Hệ thống tự động phát hiện và cấu hình port để đảm bảo frontend và backend luôn đồng bộ.

## ✨ Tính năng

- **Tự động phát hiện port**: Khi frontend chạy trên port nào, hệ thống sẽ tự động cập nhật cấu hình
- **Đồng bộ tức thời**: Email links và API URLs được cập nhật ngay lập tức
- **Chuyên nghiệp**: Không cần cấu hình manual, mọi thứ hoạt động tự động

## 🛠️ Cách sử dụng

### Chạy với port mặc định (3000)
```bash
cd frontend
npm run dev
```

### Chạy với port tùy chọn
```bash
cd frontend
PORT=3005 npm run dev
# hoặc
PORT=3003 npm run dev
# hoặc bất kỳ port nào bạn muốn
```

### Chạy frontend đơn giản (không có auto-detection)
```bash
cd frontend
npm run dev:simple
```

## 📧 Email Links

Khi bạn chạy frontend trên port nào, email sẽ tự động sử dụng port đó:

- Port 3000 → Email links: `http://localhost:3000/reset-password?token=...`
- Port 3005 → Email links: `http://localhost:3005/reset-password?token=...`
- Port 3003 → Email links: `http://localhost:3003/reset-password?token=...`

## 🔧 Cấu hình

### Files được tự động cập nhật:

1. **Backend `.env`**:
   ```
   FRONTEND_URL=http://localhost:<detected-port>
   ```

2. **Frontend `.env.local`**:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

### Scripts:

- **`npm run dev`**: Smart dev server với auto port detection
- **`npm run dev:simple`**: Chạy Next.js truyền thống
- **`npm run detect-port`**: Chỉ cập nhật cấu hình port

## 📝 Backend Logs

Khi gửi email, bạn sẽ thấy log như này:
```
[EmailService] Sending password reset email to user@example.com with frontend URL: http://localhost:3005
[EmailService] Password reset email sent to user@example.com
```

## 🎯 Lợi ích

1. **Linh hoạt**: Chạy trên bất kỳ port nào mà không cần cấu hình thêm
2. **Chuyên nghiệp**: Tự động đồng bộ mọi thứ
3. **Developer-friendly**: Không cần nhớ cập nhật config manual
4. **Production-ready**: Fallback tốt cho production environment

## 🔍 Troubleshooting

Nếu gặp vấn đề:

1. Kiểm tra file `.env` và `.env.local` đã được tạo chưa
2. Restart backend sau khi thay đổi port
3. Kiểm tra logs để xem port detection có hoạt động không

## 🏗️ Cấu trúc

```
frontend/
├── scripts/
│   ├── detect-port.js      # Script phát hiện và cập nhật port
│   └── smart-dev.js        # Smart development server
├── package.json            # Updated scripts
└── .env.local             # Auto-generated

backend/
├── src/common/
│   └── port-detection.service.ts  # Service phát hiện port
├── src/email/
│   ├── email.service.ts           # Updated để dùng dynamic URL
│   └── email.module.ts           # Include PortDetectionService
└── .env                          # Auto-updated
```
