import axios from 'axios';
import { fileTypeFromBuffer } from 'file-type';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`_*Masukkan link Pixiv atau kata kunci pencarian!*_\n\nContoh:\n*${usedPrefix + command}* https://www.pixiv.net/en/artworks/115505080\n*${usedPrefix + command}* blue archive`);

    await conn.sendMessage(m.chat, {
        react: { text: '🕒', key: m.key },
    });

    try {
        let res = await pixivDl(text);
        if (!res || !res.media || !res.media.length) {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return m.reply('Gambar tidak ditemukan!');
        }

        for (let i = 0; i < res.media.length; i++) {
            let caption = i === 0 ? `╭──── 〔 PIXIV 〕 ─⬣\n ⬡ *Title* : ${res.caption}\n ⬡ *Artist* : ${res.artist}\n ⬡ *Tags* : ${res.tags.slice(0, 10).join(', ')}\n╰────────⬣` : '';
            let fileType = await fileTypeFromBuffer(res.media[i]);
            let mime = fileType?.mime || 'image/jpeg';
            let mediaType = mime.split('/')[0];

            if (mediaType === 'image') {
                if (mime === 'image/gif') {
                    await conn.sendMessage(m.chat, { video: res.media[i], caption, mimetype: 'video/mp4', gifPlayback: true }, { quoted: m });
                } else {
                    await conn.sendMessage(m.chat, { image: res.media[i], caption, mimetype: mime }, { quoted: m });
                }
            } else if (mediaType === 'video') {
                await conn.sendMessage(m.chat, { video: res.media[i], caption, mimetype: mime }, { quoted: m });
            }
        }

        await conn.sendMessage(m.chat, {
            react: { text: '✅', key: m.key },
        });
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        m.reply(`Terjadi kesalahan saat mengunduh Pixiv: ${e.message}`);
    }
};

handler.help = ['pixiv *<search/link>*'];
handler.tags = ['downloader', 'img'];
handler.command = /^(pixiv|pixivdl)$/i;
handler.limit = 1;
handler.register = true;

export default handler;

async function pixivDl(query) {
    const matchId = /(?:artworks\/|\b)(\d{6,12})\b/i.exec(query);
    if (matchId) {
        const id = matchId[1];
        // 1. Coba ambil metadata dari Lolicon API berdasarkan PID
        try {
            const res = await axios.get('https://api.lolicon.app/setu/v2?pid=' + id, { timeout: 15000 });
            if (res.data?.data?.length) {
                const item = res.data.data[0];
                const imgRes = await axios.get(item.urls.original, {
                    responseType: 'arraybuffer',
                    timeout: 30000,
                    headers: { 'Referer': 'https://www.pixiv.net/' }
                });
                return {
                    artist: item.author,
                    caption: item.title,
                    tags: item.tags || [],
                    media: [Buffer.from(imgRes.data)]
                };
            }
        } catch (e) {}

        // 2. Fallback unduh via mirror pixiv.re jika tidak ada di database lolicon
        const imgRes = await axios.get(`https://pixiv.re/${id}.jpg`, {
            responseType: 'arraybuffer',
            timeout: 30000,
            headers: { 'Referer': 'https://www.pixiv.net/' }
        });
        return {
            artist: 'Pixiv Artist',
            caption: 'Pixiv Artwork #' + id,
            tags: ['pixiv'],
            media: [Buffer.from(imgRes.data)]
        };
    } else {
        // Pencarian berdasarkan keyword atau tag
        const res = await axios.get('https://api.lolicon.app/setu/v2?keyword=' + encodeURIComponent(query) + '&r18=0&num=1', {
            timeout: 15000
        });
        if (!res.data?.data?.length) {
            throw new Error(`Gambar tidak ditemukan untuk kata kunci "${query}"`);
        }
        const item = res.data.data[0];
        const imgRes = await axios.get(item.urls.original, {
            responseType: 'arraybuffer',
            timeout: 30000,
            headers: { 'Referer': 'https://www.pixiv.net/' }
        });
        return {
            artist: item.author,
            caption: item.title,
            tags: item.tags || [],
            media: [Buffer.from(imgRes.data)]
        };
    }
}