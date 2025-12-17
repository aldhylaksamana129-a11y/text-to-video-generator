import { spawn } from 'child_process';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { text, font = 'Arial', fontSize = 32, color = '#ffffff', background = '/bg.jpg', durationPerWord = 1.5 } = req.body;

  const tempDir = path.join(process.cwd(), 'temp');
  const audioFile = path.join(tempDir, 'audio.mp3');
  const videoFile = path.join(tempDir, 'output.mp4');

  try {
    // Simulasi TTS (gunakan Google TTS di sini)
    await writeFile(audioFile, Buffer.from('dummy-audio-content')); // Ganti dengan TTS API

    const duration = text.split(' ').length * durationPerWord;

    const command = spawn('ffmpeg', [
      '-f', 'lavfi', '-i', `color=c=${background.replace('#', '0x')}:s=1280x720:d=${duration}`,
      '-i', audioFile,
      '-vf', `drawtext=fontfile=Arial.ttf:text='${text}':fontsize=${fontSize}:fontcolor=${color}@0.8:x=(w-text_w)/2:y=(h-text_h)/2`,
      '-c:v', 'libx264', '-c:a', 'aac', '-y', videoFile
    ]);

    await new Promise((resolve, reject) => {
      command.on('close', resolve);
      command.on('error', reject);
    });

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'attachment; filename="hasil_video.mp4"');
    res.sendFile(videoFile);

    // Cleanup
    setTimeout(() => {
      unlink(audioFile).catch(console.error);
      unlink(videoFile).catch(console.error);
    }, 1000);
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal membuat video.');
  }
}

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '20mb'
  }
};
