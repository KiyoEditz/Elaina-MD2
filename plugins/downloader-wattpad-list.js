import { listRead } from '../lib/wattpad.js';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    throw `Masukkan URL cerita Wattpad yang ingin dilihat chapter-nya!\n\nContoh:\n${usedPrefix + command} https://www.wattpad.com/story/327597340`;
  }

  try {
    conn.reply(m.chat, `_Sedang memproses, harap tunggu..._`, m);

    const response = await listRead(args[0]);
    const { synopsis, chapters } = response;

    let capt = `⬣──── 〔WATTPAD LIST〕 ─⬣\n\n`;
    capt += `⬡ *Sinopsis*: ${synopsis}\n\n`;
    capt += `⬡ *Daftar Chapter:*\n`;
    chapters.slice(0, 50).forEach((chapter, index) => {
      capt += `\n⬡ Chapter ${index + 1}:\n`;
      capt += `  ⬣ *Judul*: ${chapter.title}\n`;
      capt += `  ⬣ *Tanggal*: ${chapter.date}\n`;
      capt += `  ⬣ *Link*: ${chapter.link}\n`;
    });

    await conn.sendMessage(m.chat, { text: capt }, { quoted: m });
  } catch (e) {
    throw `Error: ${e.message || e}`;
  }
};

handler.help = ['wattpadlist <url>'];
handler.command = /^(wattpadlist|wattpadl)$/i;
handler.tags = ['downloader'];
handler.premium = false;

export default handler;
