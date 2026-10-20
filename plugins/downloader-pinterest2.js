import axios from 'axios';
import https from 'https';

let handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) return conn.reply(m.chat, `Mau cari gambar apa di Pinterest?\nContoh: ${usedPrefix + command} anime girl`, m);
  await conn.reply(m.chat, 'Bentar ya, sedang dicari...', m);

  try {
    let results = await pinterest(text);
    if (!results || results.length === 0) {
      return m.reply('Gambar tidak ditemukan di Pinterest.');
    }

    let ult = results.slice(0, Math.min(5, results.length));
    for (let item of ult) {
      await conn.sendFile(m.chat, item.image, 'pinterest.jpg', `*P I N T E R E S T*\n\n◦ *Upload by:* ${item.upload_by}\n◦ *Caption:* ${item.caption || '-'}\n◦ *Link:* ${item.source}`, m);
    }
  } catch (e) {
    console.error(e);
    m.reply('Terjadi kesalahan saat mencari gambar Pinterest.');
  }
};

handler.help = ['pinterest2 <query>', 'pin2 <query>'];
handler.tags = ['downloader'];
handler.command = /^(pinterest2|pin2)$/i;
handler.limit = true;

export default handler;

const agent = new https.Agent({
  rejectUnauthorized: true,
  maxVersion: 'TLSv1.3',
  minVersion: 'TLSv1.2'
});

async function getCookies() {
  try {
    const response = await axios.get('https://www.pinterest.com/csrf_error/', { httpsAgent: agent, timeout: 10000 });
    const setCookieHeaders = response.headers['set-cookie'];
    if (setCookieHeaders) {
      const cookies = setCookieHeaders.map(cookieString => {
        const cookieParts = cookieString.split(';');
        return cookieParts[0].trim();
      });
      return cookies.join('; ');
    }
    return null;
  } catch {
    return null;
  }
}

async function pinterest(query) {
  try {
    const cookies = await getCookies();
    const url = 'https://www.pinterest.com/resource/BaseSearchResource/get/';
    const params = {
      source_url: `/search/pins/?q=${encodeURIComponent(query)}`,
      data: JSON.stringify({
        options: {
          isPrefetch: false,
          query: query,
          scope: "pins",
          no_fetch_context_on_resource: false
        },
        context: {}
      }),
      _: Date.now()
    };

    const headers = {
      'accept': 'application/json, text/javascript, */*, q=0.01',
      'accept-language': 'en-US,en;q=0.9',
      'cookie': cookies || '',
      'referer': 'https://www.pinterest.com/',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'x-requested-with': 'XMLHttpRequest'
    };

    const { data } = await axios.get(url, { httpsAgent: agent, headers, params, timeout: 15000 });
    return data.resource_response.data.results
      .filter(v => v.images?.orig)
      .map(result => ({
        upload_by: result.pinner?.username || 'Unknown',
        fullname: result.pinner?.full_name || '',
        followers: result.pinner?.follower_count || 0,
        caption: result.grid_title || '',
        image: result.images.orig.url,
        source: "https://id.pinterest.com/pin/" + result.id,
      }));
  } catch (err) {
    return [];
  }
}
