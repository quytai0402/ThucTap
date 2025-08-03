# Backend Scripts

Thư mục này chứa các scripts hữu ích để quản lý dữ liệu trong ứng dụng.

## Available Scripts

### Seed Data Scripts

#### `seed-admin.ts`
Tạo tài khoản admin mặc định trong hệ thống.
```bash
npm run seed:admin
```
- Email: `admin@admin.com`
- Password: `admin`
- Role: ADMIN

### Maintenance Scripts

#### `clear-all-data.ts`
Xóa toàn bộ dữ liệu trong database (giữ lại admin).
```bash
npm run clear:data
```
⚠️ **Cảnh báo**: Script này sẽ xóa toàn bộ dữ liệu!

#### `sync-category-counts.ts`
Đồng bộ số lượng sản phẩm trong từng category.
```bash
npm run sync:categories
```

## Usage

Các scripts được chạy bằng ts-node và có thể được thực thi thông qua npm scripts:

```bash
# Tạo admin user
npm run seed:admin

# Đồng bộ categories
npm run sync:categories

# Xóa toàn bộ dữ liệu
npm run clear:data
```

## Setup Order

Khi setup lần đầu, chỉ cần chạy:
1. `npm run seed:admin`

Dữ liệu sẽ được tạo tự động thông qua admin panel.
