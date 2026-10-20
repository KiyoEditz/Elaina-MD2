import uploadFile from '../lib/uploadFile.js';
import uploadImage from '../lib/uploadImage.js';

let handler = async (m, { command, usedPrefix }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!mime) throw `_Kirim atau reply media dengan caption *${usedPrefix + command}*_`;

    await m.reply('Sedang mengunggah media...');

    try {
        let media = await q.download?.();
        if (!media) throw 'Gagal mengunduh media!';

        let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);
        let link = await (isTele ? uploadImage : uploadFile)(media);

        let sizeKB = (media.length / 1024).toFixed(2);
        let caption = `╭──── 〔 *UPLOAD URL* 〕 ─⬣
│ 🔗 *URL*      : ${link}
│ 📊 *Ukuran*   : ${sizeKB} KB (${media.length} Bytes)
│ ⏳ *Masa Aktif*: ${isTele ? 'Permanen' : 'Sementara'}
╰────────────────────────⬣`.trim();

        m.reply(caption);
    } catch (e) {
        m.reply(`Gagal mengunggah media: ${e.message || e}`);
    }
};

handler.help = ['upload (reply media)'];
handler.tags = ['tools'];
handler.command = /^upload$/i;

export default handler;
