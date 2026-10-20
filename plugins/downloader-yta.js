import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Masukkan URL YouTube!\n\nContoh:\n${usedPrefix + command} https://youtu.be/4rDOsvzTicY`;

  m.reply(global.wait || '_Sedang diproses, mohon tunggu..._');

  try {
    let mp3Url = null;
    let title = 'YouTube Audio';
    let thumb = null;

    // Coba endpoint 1: BetaBotz API
    try {
      const response = await axios.get(`https://api.betabotz.eu.org/api/download/ytmp3?url=${encodeURIComponent(text)}&apikey=btzElainaMD`, { timeout: 15000 });
      if (response.data?.result?.mp3) {
        mp3Url = response.data.result.mp3;
        title = response.data.result.title || title;
        thumb = response.data.result.thumb;
      }
    } catch (e) {}

    // Coba endpoint 2: Workers Dev API
    if (!mp3Url) {
      try {
        const response = await axios.get(`https://ab-ytdlv2.abrahamdw882.workers.dev/?url=${encodeURIComponent(text)}&format=mp3`, { timeout: 15000 });
        if (response.data?.data?.downloadUrl) {
          mp3Url = response.data.data.downloadUrl;
          title = response.data.data.title || title;
          thumb = response.data.data.image;
        }
      } catch (e) {}
    }

    // Coba endpoint 3: Siputzx API
    if (!mp3Url) {
      try {
        const response = await axios.get(`https://api.siputzx.my.id/api/d/youtube?url=${encodeURIComponent(text)}`, { timeout: 15000 });
        if (response.data?.data?.mp3 || response.data?.data?.dl) {
          mp3Url = response.data.data.mp3 || response.data.data.dl;
          title = response.data.data.title || title;
          thumb = response.data.data.thumbnail;
        }
      } catch (e) {}
    }

    if (!mp3Url) {
      throw new Error('Gagal mendapatkan tautan audio dari semua server.');
    }

    let caption = `╭──── 〔 YOUTUBE AUDIO 〕 ─⬣\n` +
                  ` ⬡ *Title* : ${title}\n` +
                  ` ⬡ *Link* : ${text}\n` +
                  `╰────────⬣`;

    if (thumb) {
      await conn.sendMessage(m.chat, {
        image: { url: thumb },
        caption
      }, { quoted: m });
    }

    await conn.sendMessage(m.chat, {
      audio: { url: mp3Url },
      mimetype: 'audio/mpeg',
      fileName: `${title.replace(/[\\/:*?"<>|]/g, '_')}.mp3`
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply(`*Error:* ${e.message || e}`);
  }
};

handler.help = ['ytmp3 <url>', 'yta <url>'];
handler.command = /^yt(a|mp3)$/i;
handler.tags = ['downloader'];
handler.limit = true;

export default handler;
