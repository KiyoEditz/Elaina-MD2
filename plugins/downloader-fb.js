import axios from 'axios';
import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    throw `Masukkan URL!\n\nContoh:\n${usedPrefix}${command} https://www.facebook.com/share/r/ZM2xDeQdQ5y31jR5/?mibextid=D5vuiz`;
  }
  
  if (!args[0].match(/facebook|fb\.watch/gi)) {
    throw `Berikan URL dari Facebook yang valid!`;
  }

  await conn.reply(m.chat, 'Tunggu sebentar...', m);

  try {
    let videoUrl = null;
    let title = 'Facebook Video';

    // Coba metode 1: Dynamic import api-dylux jika ada
    try {
      const { default: fg } = await import('api-dylux');
      const response = await fg.fbdl(args[0]);
      if (response && response.videoUrl) {
        videoUrl = response.videoUrl;
        title = response.title || title;
      }
    } catch (e) {
      // api-dylux tidak ada, lanjutkan ke metode fallback
    }

    // Coba metode 2: API publik Siputzx
    if (!videoUrl) {
      try {
        const res = await axios.get(`https://api.siputzx.my.id/api/d/facebook?url=${encodeURIComponent(args[0])}`, { timeout: 15000 });
        if (res.data?.status && (res.data.data?.video_hd || res.data.data?.video_sd)) {
          videoUrl = res.data.data.video_hd || res.data.data.video_sd;
          title = res.data.data.title || title;
        }
      } catch (e) {}
    }

    // Coba metode 3: API publik Velyn
    if (!videoUrl) {
      try {
        const res = await axios.get(`https://www.velyn.biz.id/api/downloader/facebook?url=${encodeURIComponent(args[0])}`, { timeout: 15000 });
        if (res.data?.status && res.data.data?.url) {
          videoUrl = res.data.data.url;
          title = res.data.data.title || title;
        }
      } catch (e) {}
    }

    if (!videoUrl) {
      throw new Error('Gagal mengekstrak video dari URL Facebook tersebut.');
    }

    let caption = `⬣───「 *FACEBOOK DOWNLOADER* 」───⬣\n○ Title: ${title}\n○ URL: ${args[0]}`;
    await conn.sendFile(m.chat, videoUrl, 'facebook.mp4', caption, m, null, {
      asDocument: global.db?.data?.users?.[m.sender]?.useDocument || false
    });
  } catch (e) {
    console.error(e);
    throw `*Tidak Dapat Mengambil Informasi Url: ${e.message || e}*`;
  }
};

handler.help = ['facebook <url>', 'fb <url>'];
handler.tags = ['downloader'];
handler.command = /^((facebook|fb)(downloader|downloder|dl)?)$/i;

export default handler;
