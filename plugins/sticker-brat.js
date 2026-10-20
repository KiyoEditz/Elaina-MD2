import axios from 'axios';
import WSF from 'wa-sticker-formatter';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Penggunaan: ${usedPrefix + command} <teks>\n\nContoh: ${usedPrefix + command} kamu nanya`);

    try {
        let bratUrl = `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(text)}`;
        let res;
        try {
            res = await axios.get(bratUrl, { responseType: 'arraybuffer', timeout: 15000 });
        } catch (err) {
            // Fallback alternative endpoint
            bratUrl = `https://brat.caliphdev.com/api/brat?text=${encodeURIComponent(text)}`;
            res = await axios.get(bratUrl, { responseType: 'arraybuffer', timeout: 15000 });
        }

        const wsf = new WSF.Sticker(Buffer.from(res.data), {
            pack: global.packname,
            author: global.author,
            type: 'full',
        });

        await wsf.build();
        const sticBuffer = await wsf.get();

        if (sticBuffer) {
            await conn.sendMessage(m.chat, { sticker: sticBuffer }, {
                quoted: m,
                mimetype: 'image/webp',
                ephemeralExpiration: 86400,
            });
        } else {
            throw new Error('Gagal menghasilkan buffer stiker');
        }
    } catch (e) {
        console.error(e);
        await m.reply(`Terjadi kesalahan saat membuat stiker brat: ${e.message || e}`);
    }
};

handler.help = ['brat <teks>'];
handler.tags = ['fun', 'sticker'];
handler.command = /^brat$/i;
handler.limit = true;

export default handler;
