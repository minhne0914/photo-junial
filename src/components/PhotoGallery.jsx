import React, { useState, useEffect } from 'react';
import PhotoStorage from '../services/PhotoStorage';
import PhotoDetail from './PhotoDetail';
import './PhotoGallery.css';

const PhotoGallery = ({ photos = [], onPhotoUpdated, onPhotoDeleted }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photosWithImages, setPhotosWithImages] = useState([]);

  useEffect(() => {
    loadPhotos();
  }, [photos]);

  const loadPhotos = async () => {
    if (photos.length === 0) {
      setPhotosWithImages([]);
      return;
    }

    try {
      setLoading(true);
      
      // Load actual image data for each photo
      const loadedPhotos = await Promise.all(
        photos.map(async (photo) => {
          try {
            const imageData = await PhotoStorage.readPhotoFromFilesystem(photo.filePath);
            return {
              ...photo,
              imageData
            };
          } catch (error) {
            console.error('Error loading image:', error);
            return {
              ...photo,
              imageData: null
            };
          }
        })
      );
      
      setPhotosWithImages(loadedPhotos);
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
  };

  const handleCloseDetail = () => {
    setSelectedPhoto(null);
  };

  const handlePhotoUpdated = async (updatedPhoto) => {
    if (onPhotoUpdated) {
      onPhotoUpdated(updatedPhoto);
    }
  };

  const handlePhotoDeleted = async (deletedPhotoId) => {
    if (onPhotoDeleted) {
      onPhotoDeleted(deletedPhotoId);
    }
    if (selectedPhoto && selectedPhoto.id === deletedPhotoId) {
      setSelectedPhoto(null);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="photo-gallery">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Đang tải ảnh...</p>
        </div>
      </div>
    );
  }

  if (photosWithImages.length === 0 && !loading) {
    return (
      <div className="photo-gallery">
        <div className="empty-gallery">
          <div className="empty-icon">📷</div>
          <h3>Chưa có ảnh nào</h3>
          <p>Hãy chụp ảnh đầu tiên để bắt đầu nhật ký!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="photo-gallery">
      <div className="gallery-header">
        <h2>📸 Nhật ký ảnh của bạn</h2>
        <p className="photo-count">{photosWithImages.length} ảnh</p>
      </div>

      <div className="gallery-grid">
        {photosWithImages.map((photo) => (
          <div 
            key={photo.id} 
            className="photo-card"
            onClick={() => handlePhotoClick(photo)}
          >
            <div className="photo-thumbnail">
              {photo.imageData ? (
                <img src={photo.imageData} alt={photo.title} />
              ) : (
                <div className="photo-error">
                  <span>❌</span>
                  <p>Không thể tải ảnh</p>
                </div>
              )}
            </div>
            <div className="photo-info">
              <h4 className="photo-title">{photo.title}</h4>
              <p className="photo-date">{formatDate(photo.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <PhotoDetail
          photo={selectedPhoto}
          onClose={handleCloseDetail}
          onPhotoUpdated={handlePhotoUpdated}
          onPhotoDeleted={handlePhotoDeleted}
        />
      )}
    </div>
  );
};

export default PhotoGallery;

