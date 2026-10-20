import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`Format salah!\nGunakan:\n• ${usedPrefix + command} search <query>|<halaman>\n• ${usedPrefix + command} down <url>\n\nContoh:\n• ${usedPrefix + command} search naruto|2\n• ${usedPrefix + command} down https://sfile.mobi/xxxxx`);
  }

  let [mode, ...rest] = text.trim().split(' ');
  let param = rest.join(' ').trim();

  if (mode.toLowerCase() === 'search') {
    try {
      let [query, page] = param.split('|');
      query = query?.trim();
      page = parseInt(page) || 1;

      let res = await fetch(`https://sfile.mobi/search.php?q=${encodeURIComponent(query)}&page=${page}`);
      let $ = cheerio.load(await res.text());

      let result = [];
      $('div.list').each(function () {
        let title = $(this).find('a').text();
        let size = $(this).text().trim().split('(')[1];
        let link = $(this).find('a').attr('href');
        if (link) result.push({ title, size: size?.replace(')', ''), link });
      });

      if (!result.length) return m.reply(`🔍 Tidak ditemukan hasil untuk "${query}"`);

      let caption = result.map((v, i) => {
        return `📌 *Result ${i + 1}*\n🔖 *Title:* ${v.title}\n📦 *Size:* ${v.size}\n🔗 *Link:* ${v.link}`;
      }).join('\n\n━━━━━━━━━━━━━━━\n\n');

      m.reply(`🔎 *Hasil Pencarian untuk "${query}"*\n\n${caption}\n\n📝 Halaman: ${page}`);
    } catch (e) {
      console.error(e);
      m.reply('Terjadi kesalahan saat mencari file.');
    }

  } else if (mode.toLowerCase() === 'down') {
    if (!/^https:\/\/sfile\.mobi\//i.test(param)) return m.reply('Link tidak valid. Harus diawali https://sfile.mobi/');

    try {
      let res = await fetch(param);
      let $ = cheerio.load(await res.text());

      let filename = $('img.intro').attr('alt') || 'download_file';
      let mimetype = $('div.list').text().split(' - ')[1]?.split('\n')[0]?.trim() || 'application/octet-stream';
      let downloadPage = $('#download').attr('href');
      let up_at = $('.list').eq(2).text().split(':')[1]?.trim() || '-';
      let uploader = $('.list').eq(1).find('a').eq(0).text().trim() || '-';
      let total_down = $('.list').eq(3).text().split(':')[1]?.trim() || '-';

      if (!downloadPage) return m.reply('Tautan unduhan tidak ditemukan di halaman ini.');

      let data = await fetch(downloadPage);
      let $$ = cheerio.load(await data.text());
      let scriptText = $$('script').text();
      let downloadUrl = scriptText.split('sf = "')[1]?.split('"')[0]?.replace(/\\/g, '');

      if (!downloadUrl) return m.reply('Gagal mengambil tautan unduhan.');

      const buff = Buffer.from(await (await fetch(downloadUrl)).arrayBuffer());

      await conn.sendMessage(m.chat, {
        document: buff,
        fileName: filename,
        mimetype: mimetype,
        caption: `📁 *File Information*\n\n🔹 *Filename:* ${filename}\n🔹 *Mimetype:* ${mimetype}\n🔹 *Uploader:* ${uploader}\n🔹 *Upload Date:* ${up_at}\n🔹 *Downloads:* ${total_down}`
      }, { quoted: m });
    } catch (e) {
      console.error(e);
      m.reply('Terjadi kesalahan saat mengunduh file.');
    }

  } else {
    m.reply(`Sub-command tidak dikenali.\nGunakan:\n• ${usedPrefix + command} search <query>|<halaman>\n• ${usedPrefix + command} down <url>`);
  }
};

handler.help = ['sfile search <query>|<halaman>', 'sfile down <url>'];
handler.tags = ['downloader'];
handler.command = /^sfile$/i;

export default handler;
