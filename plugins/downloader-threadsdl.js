import threadster from '../lib/threads.js';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    throw `Masukkan URL!\n\nContoh:\n${usedPrefix + command} https://www.threads.net/@user/post/DBM2ZfDhNt1`;
  }

  try {
    let urlMatch = args[0].match(/\/post\/([A-Za-z0-9-_?=]+)$/i);
    if (!urlMatch) throw `URL Threads tidak valid!`;
    let id = urlMatch[0];

    conn.reply(m.chat, `_Sedang memproses, harap tunggu..._`, m);

    const response = await threadster(id);
    if (!response || !response.content?.download?.link) {
      throw 'Gagal mengambil video/foto Threads.';
    }

    let vid = response.content.download.link;
    let fileType = vid.endsWith('.jpg') || vid.endsWith('.jpeg') ? 'image' : 'video';

    await conn.sendFile(
      m.chat,
      vid,
      `threads.${fileType === 'image' ? 'jpg' : 'mp4'}`,
      response.content.caption || '',
      m,
      null,
      { asDocument: global.db?.data?.users?.[m.sender]?.useDocument || false }
    );
  } catch (e) {
    throw `Error: ${e.message || e}`;
  }
};

handler.help = ['threads <url>'];
handler.command = /^(threads|threadsdl)$/i;
handler.tags = ['downloader'];
handler.limit = true;

export default handler;
