# 📸 Photo Journal

Một ứng dụng nhật ký ảnh đơn giản và đẹp mắt, được xây dựng với React và Capacitor để chạy trên cả web và mobile.

## ✨ Tính năng

- 📷 **Chụp ảnh**: Chụp ảnh trực tiếp từ camera của thiết bị
- 💾 **Lưu trữ**: Tự động lưu ảnh vào bộ nhớ thiết bị
- 📝 **Thêm tiêu đề**: Thêm tiêu đề mô tả cho mỗi ảnh
- 🖼️ **Thư viện ảnh**: Xem tất cả ảnh đã chụp trong giao diện đẹp mắt
- ✏️ **Chỉnh sửa**: Sửa tiêu đề ảnh bất kỳ lúc nào
- 🗑️ **Xóa ảnh**: Xóa những ảnh không cần thiết
- 📤 **Chia sẻ**: Chia sẻ ảnh với bạn bè và gia đình
- 📱 **Responsive**: Giao diện thân thiện trên mọi thiết bị

## 🚀 Cài đặt và Chạy

### Yêu cầu hệ thống
- Node.js (phiên bản 16 trở lên)
- npm hoặc yarn
- Android Studio (để chạy trên Android)
- Xcode (để chạy trên iOS - chỉ macOS)

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy ứng dụng trên web
```bash
npm run dev
```
Ứng dụng sẽ mở tại `http://localhost:3000`

### 3. Build ứng dụng
```bash
npm run build
```

### 4. Chạy trên thiết bị di động

#### Android:
```bash
# Đồng bộ với Capacitor
npm run sync

# Chạy trên Android
npm run android
```

#### iOS (chỉ trên macOS):
```bash
# Đồng bộ với Capacitor
npm run sync

# Mở Xcode để chạy
npx cap open ios
```

## 📁 Cấu trúc dự án

```
src/
├── components/
│   ├── CameraCapture.jsx      # Component chụp ảnh
│   ├── CameraCapture.css      # Styles cho camera
│   ├── PhotoGallery.jsx       # Component thư viện ảnh
│   ├── PhotoGallery.css       # Styles cho gallery
│   ├── PhotoDetail.jsx        # Component xem chi tiết ảnh
│   └── PhotoDetail.css        # Styles cho chi tiết ảnh
├── services/
│   └── PhotoStorage.js        # Service quản lý lưu trữ ảnh
├── App.js                     # Component chính
├── App.css                    # Styles chính
├── main.js                    # Entry point
└── index.css                  # Global styles
```

## 🛠️ Công nghệ sử dụng

- **React 18**: Framework UI
- **Vite**: Build tool và dev server
- **Capacitor**: Chạy trên mobile
- **Capacitor Camera**: Plugin chụp ảnh
- **Capacitor Filesystem**: Plugin lưu trữ file
- **Capacitor Preferences**: Plugin lưu trữ dữ liệu

## 📱 Quyền ứng dụng

Ứng dụng cần các quyền sau:
- **Camera**: Để chụp ảnh
- **Storage**: Để lưu ảnh vào thiết bị
- **Photos**: Để truy cập thư viện ảnh (iOS)

## 🎨 Giao diện

Ứng dụng có giao diện hiện đại với:
- Gradient backgrounds đẹp mắt
- Animations mượt mà
- Responsive design
- Dark/Light theme support
- Touch-friendly interface

## 🔧 Cấu hình

### Capacitor Config (`capacitor.config.json`)
```json
{
  "appId": "com.example.photojournal",
  "appName": "Photo Journal",
  "webDir": "dist",
  "plugins": {
    "Camera": {
      "cameraPermission": "Allow Photo Journal to access your camera to take photos.",
      "photosPermission": "Allow Photo Journal to access your photo library to save photos."
    }
  }
}
```

## 📝 Cách sử dụng

1. **Chụp ảnh mới**: Nhấn nút "📸 Chụp ảnh" và cho phép truy cập camera
2. **Thêm tiêu đề**: Sau khi chụp, nhập tiêu đề cho ảnh
3. **Lưu ảnh**: Nhấn "💾 Lưu ảnh" để lưu vào thư viện
4. **Xem ảnh**: Tất cả ảnh sẽ hiển thị trong thư viện bên dưới
5. **Chỉnh sửa**: Nhấn vào ảnh để xem chi tiết và chỉnh sửa tiêu đề
6. **Xóa ảnh**: Trong chế độ xem chi tiết, nhấn "🗑️ Xóa ảnh"
7. **Chia sẻ**: Nhấn "📤 Chia sẻ" để chia sẻ ảnh với ứng dụng khác

## 🐛 Troubleshooting

### Lỗi camera không hoạt động
- Kiểm tra quyền camera đã được cấp
- Đảm bảo ứng dụng đang chạy trên thiết bị thật (không phải browser)

### Lỗi không lưu được ảnh
- Kiểm tra quyền storage
- Đảm bảo có đủ dung lượng thiết bị

### Lỗi build
- Chạy `npm run sync` trước khi build
- Kiểm tra Capacitor CLI đã được cài đặt

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request.

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

---

**Made with ❤️ by [Your Name]**