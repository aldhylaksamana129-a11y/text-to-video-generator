import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    text: '',
    template: 'simple',
    background: '/bg.jpg',
    font: 'Arial',
    fontSize: 32,
    durationPerWord: 1.5,
    color: '#ffffff',
  });

  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Text-to-Video Generator</h1>
      <label>Teks:</label>
      <textarea
        name="text"
        value={formData.text}
        onChange={handleChange}
        rows="6"
        cols="60"
      />
      <br />
      <label>Template:</label>
      <select name="template" value={formData.template} onChange={handleChange}>
        <option value="simple">Simple</option>
        <option value="slide">Slide</option>
        <option value="motion">Motion</option>
      </select>
      <br />
      <label>Background:</label>
      <input type="text" name="background" value={formData.background} onChange={handleChange} placeholder="/bg.jpg" />
      <br />
      <label>Font:</label>
      <input type="text" name="font" value={formData.font} onChange={handleChange} />
      <br />
      <label>Ukuran Font:</label>
      <input type="number" name="fontSize" value={formData.fontSize} onChange={handleChange} />
      <br />
      <label>Warna Teks:</label>
      <input type="color" name="color" value={formData.color} onChange={handleChange} />
      <br />
      <label>Durasi per Kata (detik):</label>
      <input type="number" step="0.1" name="durationPerWord" value={formData.durationPerWord} onChange={handleChange} />
      <br />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Membuat Video...' : 'Buat Video'}
      </button>

      {videoUrl && (
        <div>
          <h3>Hasil Video:</h3>
          <video controls src={videoUrl} />
          <a href={videoUrl} download="hasil_video.mp4">Download Video</a>
        </div>
      )}
    </div>
  );
}
