import { sticker } from '../lib/sticker.js';
import fetch from 'node-fetch';

let handler = async (m, { usedPrefix, conn, args, command }) => {
  let er = `_Masukkan emoji_\n\n` +
          `_Contoh:_\n` +
          `*${usedPrefix + command} wa ❤️*\n` +
          `*${usedPrefix + command} ap 🔥*\n\n` +
          `╔══「 Pilihan Type 」\n` +
          `╟ ap = apple\n` +
          `╟ fb = facebook\n` +
          `╟ go = google\n` +
          `╟ sa = samsung\n` +
          `╟ tw = twitter\n` +
          `╟ wa = whatsapp (default)\n` +
          `╚════════════════`;

  if (!args[0]) throw er;

  let template = 'whatsapp';
  let emo = args.join(' ').replace(/[A-Za-z0-9]/g, '').trim();

  let typeInput = args[0].toLowerCase();
  switch (typeInput) {
    case 'apple':
    case 'ip':
    case 'ap':
      template = 'apple';
      break;
    case 'facebook':
    case 'fb':
    case 'fa':
      template = 'facebook';
      break;
    case 'google':
    case 'go':
      template = 'google';
      break;
    case 'samsung':
    case 'ss':
    case 'sa':
      template = 'samsung';
      break;
    case 'twitter':
    case 'tw':
      template = 'twitter';
      break;
    case 'whatsapp':
    case 'wa':
    case 'wh':
      template = 'whatsapp';
      break;
    default:
      if (!emo) emo = args[0];
      break;
  }

  if (!emo) emo = args.slice(1).join(' ').replace(/[A-Za-z0-9]/g, '').trim();
  if (!emo) throw er;

  try {
    let emojiUrl = `https://emojicdn.elk.sh/${encodeURIComponent(emo)}?style=${template}`;
    let res = await fetch(emojiUrl);
    if (!res.ok) throw new Error('Gagal mengambil gambar emoji');
    let buffer = await res.buffer();
    let stik = await sticker(buffer, false, global.packname, global.author);
    if (stik) {
      await conn.sendMessage(m.chat, { sticker: stik }, { quoted: m });
    } else {
      throw new Error('Gagal membuat stiker');
    }
  } catch (e) {
    console.error(e);
    throw er;
  }
};

handler.help = ['emo [tipe] <emoji>', 'semoji [tipe] <emoji>'];
handler.tags = ['stickerother'];
handler.command = /^s?emo(ji)?$/i;

export default handler;
