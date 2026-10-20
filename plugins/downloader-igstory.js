import axios from 'axios';
import * as cheerio from 'cheerio';

let handler = async (m, { conn, args, usedPrefix, command, isPrems }) => {
  if (!args[0] || !(/^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/i.test(args[0]))) {
    throw `Masukkan username Instagram tanpa @\nContoh: ${usedPrefix + command} natgeo`;
  }

  m.reply('_Sedang proses mengambil story..._');

  try {
    let res = await igstory(args[0]);
    if (!res || res.length === 0) throw 'Tidak ada story yang ditemukan atau akun diprivat.';

    for (let i of res) {
      if (!i.downloadUrl) continue;
      let type = i.downloadUrl.includes('.jpg') || i.downloadUrl.includes('.jpeg') ? '.jpg' : '.mp4';
      await conn.sendFile(m.chat, i.downloadUrl, `igstory_${Date.now()}${type}`, `@${args[0]}`, m);
    }
    if (!isPrems) m.limit = res.length;
  } catch (e) {
    console.error(e);
    throw `Error: ${e.message || e}`;
  }
};

handler.help = ['igstory <username>'];
handler.tags = ['downloader'];
handler.command = /^(igstory)$/i;

export default handler;

async function igstory(username) {
  try {
    const pageRes = await axios.get('https://www.instagramsave.com/instagram-story-downloader.php', {
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      timeout: 15000
    });

    const $ = cheerio.load(pageRes.data);
    const token = $('#token').attr('value');
    if (!token) return [];

    const params = new URLSearchParams({
      'url': 'https://www.instagram.com/' + username,
      'action': 'story',
      'token': token
    });

    const postRes = await axios.post('https://www.instagramsave.com/system/action.php', params.toString(), {
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        'X-Requested-With': 'XMLHttpRequest'
      },
      timeout: 15000
    });

    return postRes.data?.medias || [];
  } catch (err) {
    return [];
  }
}
