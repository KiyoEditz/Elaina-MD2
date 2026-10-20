import { readWattpad } from '../lib/wattpad.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    throw `Masukkan URL chapter yang ingin dibaca beserta halamannya.\n\nContoh:\n${usedPrefix + command} https://www.wattpad.com/791052589-i-am-not-a-lesbian-i-am-not-okay|1`;
  }
  let [url, page] = text.split('|');
  let pageNum = parseInt(page) || 1;
   
  try {
    conn.reply(m.chat, `_Sedang memproses, harap tunggu..._`, m);

    const response = await readWattpad(url.trim(), pageNum);
    let capt = `⬣──── 〔WATTPAD READ〕 ─⬣\n\n${response}\n`;
    await conn.sendMessage(m.chat, { text: capt }, { quoted: m });
  } catch (e) {
    throw `Error: ${e.message || e}`;
  }
};

handler.help = ['wattpadread <url|page>'];
handler.command = /^(wattpadread|wattpadr)$/i;
handler.tags = ['downloader'];
handler.premium = false;

export default handler;
