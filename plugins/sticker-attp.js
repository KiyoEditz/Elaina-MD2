import fetch from 'node-fetch';
import { sticker } from '../lib/sticker.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.text;
  if (!teks) throw `Reply pesan atau ketik pesan!\n\nContoh:\n${usedPrefix + command} Halo Dunia`;

  try {
    let api = global.API ? global.API('https://api.erdwpe.com/api/maker/', 'attp', { text: teks }) : `https://api.siputzx.my.id/api/m/attp?text=${encodeURIComponent(teks)}`;
    let res = await sticker(null, api, global.packname, global.author);
    if (res) return await conn.sendFile(m.chat, res, 'sticker.webp', '', m);
    throw new Error('Gagal mengonversi ke stiker');
  } catch (e) {
    console.error(e);
    throw 'Terjadi kesalahan saat membuat stiker ATTP.';
  }
};

handler.help = ['attp <teks>', 'attp2 <teks>'];
handler.command = /^a?ttp$/i;
handler.tags = ['stickertext'];
handler.limit = true;

export default handler;
