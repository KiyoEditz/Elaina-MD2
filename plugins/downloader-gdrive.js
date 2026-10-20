import axios from 'axios';
import { writeFileSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';

let handler = async (m, { args, usedPrefix, command, conn }) => {
  const url = args[0];
  if (!url) throw `Contoh: ${usedPrefix + command} https://drive.google.com/file/d/xxxxxxxxx/view`;

  const fileId = await extractGDrive(url);
  if (!fileId) throw 'URL Google Drive tidak valid!';

  try {
    const apiKey = 'AIzaSyAA9ERw-9LZVEohRYtCWka_TQc6oXmvcVU';
    const metaUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?fields=name,size,mimeType&key=${apiKey}`;
    const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;

    const metadata = await axios.get(metaUrl);
    const { name, size, mimeType } = metadata.data;

    m.reply(`Mendownload file...\n\n• Nama: ${name}\n• Ukuran: ${await formatSize(size)}\n• Tipe: ${mimeType}`);

    const res = await axios.get(downloadUrl, { responseType: 'arraybuffer' });

    if (res.status !== 200) {
      throw `Gagal mengunduh file: ${res.status} ${res.statusText}`;
    }

    const buffer = Buffer.from(res.data, 'binary');
    const tmpPath = path.join(tmpdir(), name);
    writeFileSync(tmpPath, buffer);

    await conn.sendMessage(m.chat, {
      document: { url: tmpPath },
      fileName: name,
      mimetype: mimeType || 'application/octet-stream',
      caption: `File berhasil diunduh!\n\n• Nama: ${name}\n• Ukuran: ${await formatSize(size)}`
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    throw typeof err === 'string' ? err : `Terjadi kesalahan: ${err.response?.status || err.message} ${err.response?.statusText || ''}`;
  }
};

handler.help = ['gdrive <url>'];
handler.tags = ['downloader'];
handler.command = /^gdrive$/i;

export default handler;

async function extractGDrive(url) {
  const match = url.match(/\/d\/([^/]+)|open\?id=([^&]+)/);
  return match ? (match[1] || match[2]) : null;
}

async function formatSize(bytes) {
  if (!bytes) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}
