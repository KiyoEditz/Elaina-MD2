import { sticker } from '../lib/sticker.js';
import axios from 'axios';
 
let handler = async (m, { conn, text, usedPrefix, command }) => {
   let q = m.quoted ? m.quoted : m;
   let mime = (q.msg || q).mimetype || '';
   let capt = `*Contoh:* ${usedPrefix + command} putih,halo selamat datang!\n\n` +
              `*[ ${global.htjava || '•'} LIST WARNA ]*\n` +
              `◦ pink, biru, merah, hijau, kuning, ungu, birutua, birumuda, abu, orange, hitam, putih, teal, merahmuda, cokelat, salmon, magenta, tan, wheat, deeppink, cyan, emas, perak`;

   if (!text) return m.reply(capt);
   if (text.length > 120) return m.reply('Maksimal 120 Karakter Teks!');

   let teks1 = text.split(',')[0]?.trim();
   let teks2 = text.split(',').slice(1).join(',').trim();

   let colors = {
      "pink": "#f68ac9", "biru": "#6cace4", "merah": "#f44336", "hijau": "#4caf50", "kuning": "#ffeb3b",
      "ungu": "#9c27b0", "birutua": "#0d47a1", "birumuda": "#03a9f4", "abu": "#9e9e9e", "orange": "#ff9800",
      "hitam": "#000000", "putih": "#ffffff", "teal": "#009688", "merahmuda": "#e91e63", "cokelat": "#795548",
      "salmon": "#ff8a65", "magenta": "#e040fb", "tan": "#d2b48c", "wheat": "#f5deb3", "deeppink": "#ff1493",
      "cyan": "#00bcd4", "emas": "#ffd700", "perak": "#c0c0c0"
   };

   let color = colors[teks1.toLowerCase()] || '#ffffff';
   let textToQuote = teks2 || teks1;

   let avatar;
   try {
      avatar = await conn.profilePictureUrl(m.quoted ? m.quoted.sender : m.sender, 'image');
   } catch {
      avatar = 'https://i.ibb.co/2kR4p86/avatar.png';
   }

   let name = conn.getName(m.quoted ? m.quoted.sender : m.sender) || 'User';

   let obj = {
      "type": "quote",
      "format": "png",
      "backgroundColor": color,
      "width": 512,
      "height": 768,
      "scale": 2,
      "messages": [{
         "entities": [],
         "avatar": true,
         "from": {
            "id": 1,
            "name": name,
            "photo": { "url": avatar }
         },
         "text": textToQuote,
         "replyMessage": {}
      }]
   };

   try {
      const result = await axios.post('https://quote.btch.bz/generate', obj, {
         headers: { 'Content-Type': 'application/json' },
         timeout: 15000
      });
      const buffer = Buffer.from(result.data.result.image, 'base64');
      let stik = await sticker(buffer, false, global.packname, global.author);
      if (stik) return conn.sendFile(m.chat, stik, 'Quotly.webp', '', m);
   } catch (error) {
      console.error(error);
      throw 'Tidak dapat membuat sticker quote saat ini.';
   }
};

handler.help = ['qcr <warna>,<teks>'];
handler.tags = ['sticker'];
handler.command = /^(qcr|quotedr|quotlyr)$/i;
handler.limit = true;

export default handler;
