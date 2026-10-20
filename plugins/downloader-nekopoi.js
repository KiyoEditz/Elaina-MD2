import NekoPoi from '../lib/nekopoi.js';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    throw `Masukkan judul yang ingin dicari!\n\nContoh:\n${usedPrefix + command} blue archive`;
  }

  try {
    conn.reply(m.chat, `_Sedang memproses, harap tunggu..._`, m);

    const response = await NekoPoi.search(args.join(' '));
    if (!response || !response.length) {
      throw 'Tidak ditemukan hasil pencarian.';
    }

    var { type, title, images, url, desc } = response[0];
    let capt = `╭──── 〔NEKOPOI〕 ─⬣\n`;
    capt += ` ⬡ *Title* : ${title}\n`;
    capt += ` ⬡ *Type* : ${type}\n`;
    if (desc) capt += ` ⬡ *Desc* : ${desc}\n`;
    capt += `╰────────⬣\n`;
    capt += ` ⬡ *Url* : ${url}\n`;

    if (images) {
      await conn.sendMessage(m.chat, {
        image: { url: images },
        caption: capt
      }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, {
        text: capt
      }, { quoted: m });
    }
  } catch (e) {
    throw `Error: ${e.message || e}`;
  }
};

handler.help = ['nekopoisearch <judul>', 'nekopoi <judul>'];
handler.command = /^(nekopoisearch|nekopois|nekopoi)$/i;
handler.tags = ['downloader'];
handler.premium = true;
handler.nsfw = true;

export default handler;
