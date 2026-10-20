import axios from 'axios';
import moewalls from '../lib/moewalls.js';
import { toVideo } from '../lib/converter.js';

// Downloader MoeWalls Live Wallpaper

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    throw `Masukkan teks dan angka dengan pemisah sebagai index\n\nContoh:\n${usedPrefix}${command} elaina|1\n\n *index bisa membanyak hasil yang di temukan.*`;
  }

  let [query, page] = text.split('|');
  let pageNum = parseInt(page) || 1;
  let index = Math.max(0, pageNum - 1);

  try {
    conn.reply(m.chat, `_Sedang memproses, harap tunggu..._`, m);

    // Mengambil respons dari scraper 
    const res = await moewalls(query.trim());

    if (!res || !res.wallpapers || res.wallpapers.length === 0) {
      throw `Wallpaper "${query.trim()}" tidak ditemukan!`;
    }

    if (!res.wallpapers[index]) {
      throw `Index tidak valid! Ditemukan total *${res.total}* wallpaper (Pilih index 1 - ${res.total}).`;
    }

    const item = res.wallpapers[index];

    if (!item.video) {
      throw `Gagal mendapatkan tautan video untuk wallpaper "${item.title}".`;
    }

    let capt = `╭──── 〔MOEWALLS〕 ─⬣\n`;
    capt += ` ⬡ *Pencarian* : ${res.query}\n`;
    capt += ` ⬡  *Index* : ${res.total}\n`;
    capt += `╰────────⬣\n`;
    capt += ` ⬡  *Judul* : ${item.title}\n`;
    capt += ` ⬡  *Source* : ${item.source}\n`;
    capt += ` ⬡  *Menampilkan* : ${item.index} - ${res.total}\n`;

    const isWebm = /\.webm($|\?)/i.test(item.video);
    let videoPayload;

    if (isWebm) {
      try {
        const response = await axios.get(item.video, {
          responseType: 'arraybuffer',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });

        // Konversi WebM ke MP4 agar dapat diputar langsung di WhatsApp
        const converted = await toVideo(Buffer.from(response.data), 'webm');
        videoPayload = converted.data;
        setTimeout(() => converted.delete().catch(() => {}), 15000);
      } catch (convErr) {
        console.error('Konversi webm ke mp4 gagal, mengirim sebagai dokumen:', convErr);
        return await conn.sendMessage(m.chat, {
          document: { url: item.video },
          mimetype: 'video/webm',
          fileName: `${item.title.replace(/[\\/:*?"<>|]/g, '_')}.webm`,
          caption: capt
        }, { quoted: m });
      }
    } else {
      videoPayload = { url: item.video };
    }

    await conn.sendMessage(m.chat, {
      video: videoPayload,
      caption: capt,
      mimetype: 'video/mp4'
    }, { quoted: m });
  } catch (e) {
    throw `Error: ${e.message || e}`;
  }
};

handler.help = ['moewalls'];
handler.command = /^(moewalls)$/i;
handler.tags = ['downloader', 'tools'];
handler.premium = false;

export default handler;