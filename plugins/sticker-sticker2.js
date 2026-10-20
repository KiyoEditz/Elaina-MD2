import { sticker } from '../lib/sticker.js';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  if (/image|video/.test(mime)) {
    throw `Fitur ini khusus stiker via link/URL.\nUntuk gambar/video biasa gunakan *${usedPrefix}stiker*`;
  }
  if (!args[0]) {
    throw `Masukkan URL gambar/stiker!\n\nContoh:\n${usedPrefix + command} https://example.com/image.png`;
  }

  let stiker = await sticker(false, args[0], global.packname, global.author);
  if (stiker) {
    conn.sendFile(m.chat, stiker, 'stiker.webp', '', m);
  } else {
    throw 'Gagal mengonversi link menjadi stiker.';
  }
};

handler.help = ['stiker2 <link>'];
handler.tags = ['sticker'];
handler.command = /^s(tic?ker)?2$/i;

export default handler;
