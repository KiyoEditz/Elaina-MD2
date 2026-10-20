import { remini } from '../lib/hdvid.js';

let handler = async (m, { conn, usedPrefix, command }) => {
    conn.hdr = conn.hdr || {};
    if (m.sender in conn.hdr) {
        throw 'Masih ada proses penjernihan yang berjalan, silakan tunggu sampai selesai...';
    }

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';

    if (!mime) {
        throw `Kirim atau balas foto dengan perintah *${usedPrefix + command}*`;
    }
    if (!/image\/(jpe?g|png)/.test(mime)) {
        throw `Format ${mime} tidak didukung! Harap kirim file gambar (JPG/PNG).`;
    }

    conn.hdr[m.sender] = true;
    await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

    try {
        let img = await q.download?.();
        if (!img) throw 'Gagal mengunduh gambar!';

        const enhanced = await remini(img, 'enhance');

        await conn.sendMessage(m.chat, {
            image: enhanced,
            caption: '✨ *Foto Berhasil Dijernihkan (HD)!*'
        }, { quoted: m });

        await conn.sendMessage(m.chat, {
            document: enhanced,
            mimetype: 'image/jpeg',
            fileName: 'remini_hd.jpg',
            caption: '📁 *Versi Dokumen (Kualitas Penuh Tanpa Kompresi)*'
        }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        m.reply(`Gagal menjernihkan foto: ${e.message || e}`);
    } finally {
        delete conn.hdr[m.sender];
    }
};

handler.help = ['remini'];
handler.tags = ['tools'];
handler.command = /^(remini)$/i;
handler.limit = true;

export default handler;
