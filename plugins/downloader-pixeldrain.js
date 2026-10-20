import { pixeldrain } from '../lib/pixeldrain.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*🚨 Contoh:* ${usedPrefix + command} https://pixeldrain.com/u/Un6ru7VS`;

    try {
        const fileId = pixeldrain.extractLink(text);
        if (!fileId) throw `*🚨 Format link tidak valid!*\nGunakan link seperti: https://pixeldrain.com/u/Un6ru7VS`;

        const res = await pixeldrain.dl(fileId);
        if (!res || !res.success) throw `*🚨 Gagal mengambil informasi file!*`;

        if (!res.can_download) throw `*🚨 File ini tidak tersedia untuk diunduh!*`;

        let msg = `📥 *P I X E L D R A I N  D O W N L O A D E R*\n\n`;
        msg += `📌 *Nama:* ${res.name}\n`;
        msg += `📌 *Ukuran:* ${(res.size / (1024 * 1024)).toFixed(2)} MB\n`;
        msg += `📌 *Tipe:* ${res.mime_type}\n`;
        msg += `📌 *Upload:* ${res.date_upload}\n`;
        msg += `📌 *Link:* ${text}\n`;

        if (res.thumbnail_href) {
            await conn.sendFile(m.chat, `https://pixeldrain.com/api${res.thumbnail_href}`, 'thumb.png', msg, m);
        } else {
            await conn.reply(m.chat, msg, m);
        }

        await conn.sendMessage(m.chat, { 
            document: { url: res.file }, 
            fileName: res.name, 
            mimetype: res.mime_type || 'application/octet-stream'
        }, { quoted: m });

    } catch (e) { 
        throw `🚨 *Error:* ${e.message || e}`;
    }
};

handler.help = ['pixeldrain <url>'];
handler.tags = ['downloader'];
handler.command = /^(pixeldrain|pd)$/i;
handler.limit = true;

export default handler;
