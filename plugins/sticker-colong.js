import { sticker } from '../lib/sticker.js';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let stiker = false;
    try {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        if (/image|video/.test(mime)) {
            let img = await q.download();
            if (!img) throw 'Reply stikernya!';
            let senderName = m.sender ? conn.getName(m.sender) : 'User';
            stiker = await sticker(img, false, senderName + ' ✅', 'ChiiMD Sticker');
        } else if (args[0]) {
            let senderName = m.sender ? conn.getName(m.sender) : 'User';
            let url = args[0];
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            stiker = await sticker(false, url, senderName + ' ✅', 'ChiiMD Sticker');
        } else {
            throw `Reply stiker / gambar atau ketik URL!\n\nContoh:\n${usedPrefix + command} <Reply gambar/stiker>`;
        }
    } finally {
        if (stiker) conn.sendFile(m.chat, stiker, 'sticker.webp', '', m);
    }
};

handler.help = ['colong <reply sticker/gambar/url>'];
handler.tags = ['sticker'];
handler.command = /^(colong)$/i;

export default handler;
