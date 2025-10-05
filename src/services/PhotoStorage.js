import { Preferences } from '@capacitor/preferences';
import { Filesystem, Directory } from '@capacitor/filesystem';

const PHOTOS_KEY = 'photo_journal_photos';

class PhotoStorage {
  // Lưu danh sách ảnh vào Preferences
  async savePhotos(photos) {
    try {
      await Preferences.set({
        key: PHOTOS_KEY,
        value: JSON.stringify(photos)
      });
    } catch (error) {
      console.error('Error saving photos:', error);
      throw error;
    }
  }

  // Lấy danh sách ảnh từ Preferences
  async getPhotos() {
    try {
      const { value } = await Preferences.get({ key: PHOTOS_KEY });
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.error('Error getting photos:', error);
      return [];
    }
  }

  // Lưu ảnh vào Filesystem và trả về đường dẫn
  async savePhotoToFilesystem(photoUri, fileName) {
    try {
      // Đọc file từ URI
      const response = await fetch(photoUri);
      const blob = await response.blob();
      const base64Data = await this.blobToBase64(blob);

      // Lưu vào Filesystem
      const filePath = `photos/${fileName}`;
      await Filesystem.writeFile({
        path: filePath,
        data: base64Data,
        directory: Directory.Data
      });

      return filePath;
    } catch (error) {
      console.error('Error saving photo to filesystem:', error);
      throw error;
    }
  }

  // Đọc ảnh từ Filesystem
  async readPhotoFromFilesystem(filePath) {
    try {
      const { data } = await Filesystem.readFile({
        path: filePath,
        directory: Directory.Data
      });
      return `data:image/jpeg;base64,${data}`;
    } catch (error) {
      console.error('Error reading photo from filesystem:', error);
      return null;
    }
  }

  // Xóa ảnh khỏi Filesystem
  async deletePhotoFromFilesystem(filePath) {
    try {
      await Filesystem.deleteFile({
        path: filePath,
        directory: Directory.Data
      });
    } catch (error) {
      console.error('Error deleting photo from filesystem:', error);
      throw error;
    }
  }

  // Chuyển đổi Blob thành Base64
  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Tạo tên file duy nhất
  generateFileName() {
    const timestamp = new Date().getTime();
    return `photo_${timestamp}.jpg`;
  }

  // Thêm ảnh mới
  async addPhoto(photoUri, title) {
    try {
      const fileName = this.generateFileName();
      const filePath = await this.savePhotoToFilesystem(photoUri, fileName);
      
      const newPhoto = {
        id: Date.now().toString(),
        filePath,
        title: title || 'Untitled',
        timestamp: new Date().toISOString(),
        webPath: photoUri // Lưu webPath để hiển thị ngay lập tức
      };

      const photos = await this.getPhotos();
      photos.unshift(newPhoto);
      await this.savePhotos(photos);

      return newPhoto;
    } catch (error) {
      console.error('Error adding photo:', error);
      throw error;
    }
  }

  // Cập nhật tiêu đề ảnh
  async updatePhotoTitle(photoId, newTitle) {
    try {
      const photos = await this.getPhotos();
      const photoIndex = photos.findIndex(p => p.id === photoId);
      
      if (photoIndex !== -1) {
        photos[photoIndex].title = newTitle;
        await this.savePhotos(photos);
        return photos[photoIndex];
      }
      
      throw new Error('Photo not found');
    } catch (error) {
      console.error('Error updating photo title:', error);
      throw error;
    }
  }

  // Xóa ảnh
  async deletePhoto(photoId) {
    try {
      const photos = await this.getPhotos();
      const photoIndex = photos.findIndex(p => p.id === photoId);
      
      if (photoIndex !== -1) {
        const photo = photos[photoIndex];
        
        // Xóa file khỏi Filesystem
        await this.deletePhotoFromFilesystem(photo.filePath);
        
        // Xóa khỏi danh sách
        photos.splice(photoIndex, 1);
        await this.savePhotos(photos);
        
        return true;
      }
      
      throw new Error('Photo not found');
    } catch (error) {
      console.error('Error deleting photo:', error);
      throw error;
    }
  }
}

export default new PhotoStorage();

