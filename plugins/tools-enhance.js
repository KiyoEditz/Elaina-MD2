import { remini } from '../lib/hdvid.js';

let handler = async (m, { conn, usedPrefix, command }) => {
    conn.enhancer = conn.enhancer || {};
    if (m.sender in conn.enhancer) {
        throw 'Masih ada proses penjernihan yang belum selesai, silakan tunggu sebentar...';
    }

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';

    if (!mime) {
        throw `Kirim atau reply foto dengan caption *${usedPrefix + command}*`;
    }
    if (!/image\/(jpe?g|png)/.test(mime)) {
        throw `Format ${mime} tidak didukung! Harap kirim file gambar (JPG/PNG).`;
    }

    conn.enhancer[m.sender] = true;
    await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

    try {
        let img = await q.download?.();
        if (!img) throw 'Gagal mengunduh gambar!';

        let method = 'enhance';
        if (/colorize|recolor/i.test(command)) method = 'recolor';
        else if (/dehaze|hdr/i.test(command)) method = 'dehaze';

        let result = await remini(img, method);
        await conn.sendMessage(m.chat, {
            image: result,
            caption: `✨ Berhasil diproses dengan mode *${method}*!`
        }, { quoted: m });
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        m.reply(`Gagal memproses gambar: ${e.message || e}`);
    } finally {
        delete conn.enhancer[m.sender];
    }
};

handler.help = ['hd', 'enhance', 'unblur', 'hdr', 'colorize'];
handler.tags = ['tools', 'ai'];
handler.limit = true;
handler.command = /^(hd|enhance|enhancer|unblur|hdr|colorize)$/i;

export default handler;
