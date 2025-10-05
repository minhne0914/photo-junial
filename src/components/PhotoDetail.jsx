import React, { useState } from 'react';
import PhotoStorage from '../services/PhotoStorage';
import './PhotoDetail.css';

const PhotoDetail = ({ photo, onClose, onPhotoUpdated, onPhotoDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(photo.title);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setEditTitle(photo.title);
  };

  const handleSave = async () => {
    if (!editTitle.trim()) {
      alert('Vui lòng nhập tiêu đề cho ảnh');
      return;
    }

    try {
      setIsLoading(true);
      const updatedPhoto = await PhotoStorage.updatePhotoTitle(photo.id, editTitle.trim());
      
      setIsEditing(false);
      if (onPhotoUpdated) {
        onPhotoUpdated(updatedPhoto);
      }
      
      alert('Đã cập nhật tiêu đề thành công!');
    } catch (error) {
      console.error('Error updating photo:', error);
      alert('Không thể cập nhật tiêu đề. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(photo.title);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa ảnh này không?');
    if (!confirmDelete) return;

    try {
      setIsLoading(true);
      await PhotoStorage.deletePhoto(photo.id);
      
      if (onPhotoDeleted) {
        onPhotoDeleted(photo.id);
      }
      
      alert('Đã xóa ảnh thành công!');
      onClose();
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Không thể xóa ảnh. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share && photo.imageData) {
        // Convert base64 to blob for sharing
        const response = await fetch(photo.imageData);
        const blob = await response.blob();
        const file = new File([blob], `${photo.title}.jpg`, { type: 'image/jpeg' });
        
        await navigator.share({
          title: photo.title,
          text: `Ảnh từ Photo Journal: ${photo.title}`,
          files: [file]
        });
      } else {
        // Fallback: copy to clipboard or show alert
        alert('Tính năng chia sẻ không khả dụng trên thiết bị này');
      }
    } catch (error) {
      console.error('Error sharing photo:', error);
      alert('Không thể chia sẻ ảnh. Vui lòng thử lại.');
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="photo-detail-overlay">
      <div className="photo-detail-modal">
        <div className="photo-detail-header">
          <button className="close-btn" onClick={onClose} disabled={isLoading}>
            ✕
          </button>
        </div>

        <div className="photo-detail-content">
          <div className="photo-display">
            {photo.imageData ? (
              <img src={photo.imageData} alt={photo.title} />
            ) : (
              <div className="photo-error">
                <span>❌</span>
                <p>Không thể hiển thị ảnh</p>
              </div>
            )}
          </div>

          <div className="photo-info">
            <div className="photo-meta">
              <p className="photo-date">{formatDate(photo.timestamp)}</p>
            </div>

            <div className="photo-title-section">
              {isEditing ? (
                <div className="edit-title">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="title-edit-input"
                    placeholder="Nhập tiêu đề mới..."
                    maxLength={100}
                  />
                  <div className="edit-actions">
                    <button 
                      className="save-edit-btn"
                      onClick={handleSave}
                      disabled={isLoading || !editTitle.trim()}
                    >
                      {isLoading ? 'Đang lưu...' : '💾 Lưu'}
                    </button>
                    <button 
                      className="cancel-edit-btn"
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      ❌ Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <div className="title-display">
                  <h2 className="photo-title">{photo.title}</h2>
                  <button 
                    className="edit-title-btn"
                    onClick={handleEdit}
                    disabled={isLoading}
                  >
                    ✏️ Sửa tiêu đề
                  </button>
                </div>
              )}
            </div>

            <div className="photo-actions">
              <button 
                className="share-btn"
                onClick={handleShare}
                disabled={isLoading}
              >
                📤 Chia sẻ
              </button>
              <button 
                className="delete-btn"
                onClick={handleDelete}
                disabled={isLoading}
              >
                🗑️ Xóa ảnh
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetail;
