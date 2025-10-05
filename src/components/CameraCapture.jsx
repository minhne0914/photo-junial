import React, { useState } from 'react';
import { Camera, CameraResultType } from '@capacitor/camera';
import PhotoStorage from '../services/PhotoStorage';
import './CameraCapture.css';

const CameraCapture = ({ onPhotoAdded }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [showTitleInput, setShowTitleInput] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [title, setTitle] = useState('');

  const takePhoto = async () => {
    try {
      setIsCapturing(true);
      
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri
      });

      setCapturedPhoto(image);
      setShowTitleInput(true);
    } catch (error) {
      console.error('Camera error:', error);
      alert('Không thể chụp ảnh. Vui lòng thử lại.');
    } finally {
      setIsCapturing(false);
    }
  };

  const savePhoto = async () => {
    if (!capturedPhoto || !title.trim()) {
      alert('Vui lòng nhập tiêu đề cho ảnh');
      return;
    }

    try {
      setIsCapturing(true);
      const savedPhoto = await PhotoStorage.addPhoto(capturedPhoto.webPath, title.trim());
      
      // Reset form
      setCapturedPhoto(null);
      setShowTitleInput(false);
      setTitle('');
      
      // Notify parent component
      if (onPhotoAdded) {
        onPhotoAdded(savedPhoto);
      }
      
      alert('Đã lưu ảnh thành công!');
    } catch (error) {
      console.error('Error saving photo:', error);
      alert('Không thể lưu ảnh. Vui lòng thử lại.');
    } finally {
      setIsCapturing(false);
    }
  };

  const cancelCapture = () => {
    setCapturedPhoto(null);
    setShowTitleInput(false);
    setTitle('');
  };

  return (
    <div className="camera-capture">
      <div className="capture-section">
        {!showTitleInput ? (
          <button 
            className="capture-btn"
            onClick={takePhoto}
            disabled={isCapturing}
          >
            {isCapturing ? 'Đang chụp...' : '📸 Chụp ảnh'}
          </button>
        ) : (
          <div className="title-input-section">
            <div className="captured-photo-preview">
              <img src={capturedPhoto?.webPath} alt="Captured" />
            </div>
            
            <div className="input-group">
              <input
                type="text"
                placeholder="Nhập tiêu đề cho ảnh..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="title-input"
                maxLength={100}
              />
            </div>
            
            <div className="action-buttons">
              <button 
                className="save-btn"
                onClick={savePhoto}
                disabled={isCapturing || !title.trim()}
              >
                {isCapturing ? 'Đang lưu...' : '💾 Lưu ảnh'}
              </button>
              
              <button 
                className="cancel-btn"
                onClick={cancelCapture}
                disabled={isCapturing}
              >
                ❌ Hủy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;

