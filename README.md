# Campaign Dashboard - Almana Centre Esthétique

Một ứng dụng web quản lý prospects từ các chiến dịch quảng cáo trên Google, Facebook, Instagram và các nền tảng khác.

## Tính năng

- **Dashboard tổng quan**: Hiển thị thống kê số lượng prospects, tỷ lệ chuyển đổi
- **Quản lý prospects**: Bảng dữ liệu chi tiết với các bộ lọc
- **Upload Excel**: Nhập dữ liệu từ file Excel của các chiến dịch quảng cáo
- **Responsive design**: Giao diện thân thiện trên mọi thiết bị

## Công nghệ sử dụng

### Backend
- Node.js + Express
- Multer (upload file)
- XLSX (xử lý Excel)
- CORS

### Frontend
- React + TypeScript
- Axios (API calls)
- Lucide React (icons)
- CSS Grid/Flexbox

## Cài đặt

### 1. Clone repository
```bash
git clone <repository-url>
cd campaign-dashboard
```

### 2. Cài đặt dependencies
```bash
# Cài đặt backend dependencies
npm install

# Cài đặt frontend dependencies
cd client
npm install
cd ..
```

### 3. Chạy ứng dụng

#### Chạy cả backend và frontend:
```bash
npm run dev
```

#### Hoặc chạy riêng biệt:

**Backend (port 5000):**
```bash
npm run server
```

**Frontend (port 3000):**
```bash
npm run client
```

## Sử dụng

### 1. Truy cập ứng dụng
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### 2. Upload dữ liệu Excel

#### Format file Excel cần:
| Date | Product | Source | Name | Email | Phone | PostalCode | Status | Notes |
|------|---------|---------|------|-------|-------|------------|--------|-------|
| 09/03/2024 | Cryolipolyse | Google | John Doe | john@example.com | 0123456789 | 75001 | Nouveau | Note here |

#### Các cột có thể sử dụng (linh hoạt):
- **Date/date**: Ngày
- **Product/product/Produit**: Sản phẩm
- **Source/source/Provenance**: Nguồn
- **Name/name/Nom**: Tên
- **Email/email**: Email
- **Phone/phone/Telephone**: Số điện thoại
- **PostalCode/postalCode/CP**: Mã bưu điện
- **Status/status/Statut**: Trạng thái
- **Notes/notes**: Ghi chú

### 3. Các tính năng chính

#### Dashboard
- Tổng số prospects
- Số prospects mới
- Số prospects cần xử lý
- Số rendez-vous đã đặt
- Tỷ lệ chuyển đổi

#### Bảng prospects
- Lọc theo sản phẩm, nguồn, trạng thái
- Hiển thị đầy đủ thông tin
- Link gọi điện trực tiếp
- Màu sắc phân biệt nguồn traffic

## API Endpoints

### GET /api/campaigns
Lấy danh sách campaigns với filter
```
Query params:
- produit: filter theo sản phẩm
- provenance: filter theo nguồn
- statut: filter theo trạng thái
```

### POST /api/upload-excel
Upload file Excel
```
Form data:
- excelFile: file Excel
```

### GET /api/stats
Lấy thống kê tổng quan

## Cấu trúc thư mục

```
campaign-dashboard/
├── server/
│   └── index.js          # Backend server
├── client/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── App.tsx       # Main app component
│   │   └── App.css       # Styles
│   └── public/
├── uploads/              # Uploaded files (auto-created)
├── package.json          # Backend dependencies
└── README.md
```

## Tùy chỉnh

### Thêm nguồn traffic mới
Chỉnh sửa trong `CampaignTable.tsx`:
```tsx
// Thêm option mới trong filter provenance
<option value="tiktok">TikTok</option>

// Thêm màu sắc cho nguồn mới
color: campaign.provenance === 'TikTok' ? '#000000' : '#666'
```

### Thêm trạng thái mới
Chỉnh sửa trong `CampaignTable.tsx` và `App.css`:
```css
.status-nouveau-statut {
  background-color: #color;
  color: #color;
}
```

## Lưu ý

1. File Excel sẽ được xóa sau khi xử lý để tiết kiệm dung lượng
2. Dữ liệu được lưu trong memory, sẽ mất khi restart server
3. Có thể tích hợp database (MongoDB, PostgreSQL) để lưu trữ lâu dài
4. Có thể thêm authentication để bảo mật

## Phát triển tiếp

- [ ] Tích hợp database
- [ ] Authentication/Authorization
- [ ] Tích hợp trực tiếp với Google Ads, Facebook Ads API
- [ ] Notifications real-time
- [ ] Báo cáo chi tiết theo thời gian
- [ ] CRM features (ghi chú, lịch hẹn)