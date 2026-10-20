import webp from 'node-webpmux';
import util from 'util';

let handler = async (m) => {
    if (!m.quoted) return m.reply('Tag stikernya!');
    if (/sticker/.test(m.quoted.mtype)) {
        let img = new webp.Image();
        await img.load(await m.quoted.download());
        if (img.exif) {
            try {
                m.reply(util.format(JSON.parse(img.exif.slice(22).toString())));
            } catch (err) {
                m.reply(img.exif.toString());
            }
        } else {
            m.reply('Stiker ini tidak memiliki metadata EXIF.');
        }
    } else {
        m.reply('Pesan yang dibalas bukan stiker!');
    }
};

handler.help = ['getexif'];
handler.tags = ['stickerother'];
handler.command = ['getexif'];

export default handler;
