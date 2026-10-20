import axios from 'axios';
import * as cheerio from 'cheerio';

let handler = async (m, { conn, text, args, command, usedPrefix }) => {
  if (!text) throw `Mana link TikTok-nya Kak?\nContoh: ${usedPrefix + command} https://vt.tiktok.com/xxxx/`;

  let url = `https://dlpanda.com/id?url=${encodeURIComponent(text)}&token=G7eRpMaa`;

  try {
    m.reply('_Sedang memproses gambar TikTok..._');
    let response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000
    });
    const html = response.data;
    const $ = cheerio.load(html);

    let imgSrc = [];
    $('div.col-md-12 > img').each((index, element) => {
      let src = $(element).attr('src');
      if (src) imgSrc.push(src);
    });

    if (imgSrc.length === 0) {
      throw 'Gambar TikTok tidak ditemukan dari link tersebut.';
    }

    for (let img of imgSrc) {
      await conn.sendFile(m.chat, img, 'tiktok_slide.jpg', '', m);
    }
  } catch (e) {
    console.error(e);
    throw `Error: ${e.message || e}`;
  }
};

handler.help = ['ttimg <url>'];
handler.tags = ['downloader'];
handler.command = /^(ttimg|tiktokimg)$/i;

export default handler;
