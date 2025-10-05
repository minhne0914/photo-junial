import React, { useState, useEffect } from 'react';
import CameraCapture from './components/CameraCapture';
import PhotoGallery from './components/PhotoGallery';
import PhotoStorage from './services/PhotoStorage';
import './App.css';

function App() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const savedPhotos = await PhotoStorage.getPhotos();
      setPhotos(savedPhotos);
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoAdded = (newPhoto) => {
    setPhotos(prevPhotos => [newPhoto, ...prevPhotos]);
  };

  const handlePhotoUpdated = (updatedPhoto) => {
    setPhotos(prevPhotos => 
      prevPhotos.map(photo => 
        photo.id === updatedPhoto.id ? updatedPhoto : photo
      )
    );
  };

  const handlePhotoDeleted = (deletedPhotoId) => {
    setPhotos(prevPhotos => 
      prevPhotos.filter(photo => photo.id !== deletedPhotoId)
    );
  };

  if (loading) {
    return (
      <div className="app">
        <header className="app-header">
          <div className="container">
            <h1 className="app-title">📸 Photo Journal</h1>
            <p className="app-subtitle">Ghi lại những khoảnh khắc đáng nhớ</p>
          </div>
        </header>
        <main className="app-main">
          <div className="container">
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Đang tải ứng dụng...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1 className="app-title">📸 Photo Journal</h1>
          <p className="app-subtitle">Ghi lại những khoảnh khắc đáng nhớ</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <CameraCapture onPhotoAdded={handlePhotoAdded} />
          <PhotoGallery 
            photos={photos}
            onPhotoUpdated={handlePhotoUpdated}
            onPhotoDeleted={handlePhotoDeleted}
          />
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2024 Photo Journal - Made with ❤️</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
