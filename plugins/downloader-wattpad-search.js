import { searchWattpad } from '../lib/wattpad.js';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    throw `Masukkan judul cerita yang ingin dicari!\n\nContoh:\n${usedPrefix + command} isekai`;
  }

  try {
    conn.reply(m.chat, `_Sedang memproses, harap tunggu..._`, m);

    const response = await searchWattpad(args.join(' '));
    if (!response || response.length === 0) {
      throw 'Cerita tidak ditemukan.';
    }

    var { link, image, title, readCount, voteCount, chapterCount, description } = response[0];
    let capt = `╭──── 〔WATTPAD SEARCH〕 ─⬣\n`;
    capt += ` ⬡ *Title* : ${title}\n`;
    capt += ` ⬡ *View* : ${readCount}\n`;
    capt += ` ⬡ *Vote* : ${voteCount}\n`;
    capt += ` ⬡ *Chapter* : ${chapterCount}\n`;
    capt += ` ⬡ *Url* : ${link}\n`;
    capt += `╰────────⬣\n\n`;  
    capt += `${description}\n`;  

    if (image) {
      await conn.sendMessage(m.chat, { 
        image: { url: image }, 
        caption: capt
      }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, { text: capt }, { quoted: m });
    }
  } catch (e) {
    throw `Error: ${e.message || e}`;
  }
};

handler.help = ['wattpadsearch <query>'];
handler.command = /^(wattpadsearch|wattpads)$/i;
handler.tags = ['downloader'];
handler.premium = false;

export default handler;
