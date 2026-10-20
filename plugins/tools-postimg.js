import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

async function postimg(buffer) {
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const bodyParts = [
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="optsize"\r\n\r\n0\r\n`),
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="expire"\r\n\r\n0\r\n`),
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="numfiles"\r\n\r\n1\r\n`),
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="upload_session"\r\n\r\n${Math.random()}\r\n`),
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${Date.now()}.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`),
        Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer),
        Buffer.from(`\r\n--${boundary}--\r\n`)
    ];

    const body = Buffer.concat(bodyParts);

    const res = await fetch('https://postimages.org/json/rr', {
        method: 'POST',
        headers: {
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        body
    });

    const json = await res.json();
    if (!json.url) throw new Error('Gagal mengupload gambar ke PostImages');

    const htmlRes = await fetch(json.url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });
    const html = await htmlRes.text();
    const $ = cheerio.load(html);

    let link = $('#code_html').attr('value') || json.url;
    let image = $('#code_direct').attr('value') || json.url;
    let delimg = $('#code_remove').attr('value') || '-';

    return { link, image, delimg };
}

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!/image/.test(mime)) {
        return m.reply(`Kirim gambar dengan caption *${usedPrefix + command}* atau reply gambar!`);
    }

    await m.reply('Sedang mengunggah gambar...');

    try {
        let media = await q.download?.();
        if (!media) throw 'Gagal mengunduh gambar!';

        let result = await postimg(media);

        let caption = `╭──── 〔 *POSTIMAGES UPLOAD* 〕 ─⬣
│ 🔗 *Direct Link* : ${result.image}
│ 🌐 *HTML Code*   : ${result.link}
│ 🗑️ *Delete Link* : ${result.delimg}
╰────────────────────────⬣`;

        await conn.sendMessage(m.chat, {
            image: { url: result.image },
            caption
        }, { quoted: m });
    } catch (e) {
        m.reply(`Gagal mengunggah gambar: ${e.message || e}`);
    }
};

handler.help = ['postimg'];
handler.tags = ['tools'];
handler.command = /^postimg$/i;

export default handler;
