import { useState } from 'react'
import { Camera, CameraResultType } from '@capacitor/camera'

function App() {
  const [photos, setPhotos] = useState([])

  const takePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri
      })

      const newPhoto = {
        webPath: image.webPath,
        timestamp: new Date().toISOString()
      }

      setPhotos([newPhoto, ...photos])
    } catch (err) {
      console.error('Camera error:', err)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>📸 Photo Journal</h1>
      <button onClick={takePhoto}>Chụp ảnh</button>
      <div style={{ marginTop: 20 }}>
        {photos.map((p, idx) => (
          <div key={idx} style={{ marginBottom: 10 }}>
            <img src={p.webPath} alt="Captured" width="200" />
            <p>{p.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
