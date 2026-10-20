import axios from 'axios';
import uploadImage from '../lib/uploadImage.js';

const clyrBg = {
    api: {
        base: "https://s5ash41h3g.execute-api.ap-south-1.amazonaws.com/default/api/v1/rmbg",
        endpoints: { predict: "/predict" }
    },

    headers: {
        'authority': 's5ash41h3g.execute-api.ap-south-1.amazonaws.com',
        'origin': 'https://clyrbg.com',
        'referer': 'https://clyrbg.com/',
        'user-agent': 'Postify/1.0.0'
    },

    remove: async (buffer, isHD = false) => {
        try {
            const b = Buffer.from(buffer).toString('base64');
            const data = { file_extension: 'jpeg', image_bytes: b, hd: isHD };

            const result = await axios.post(
                `${clyrBg.api.base}${clyrBg.api.endpoints.predict}`,
                data,
                { headers: clyrBg.headers }
            );

            if (result.data?.status && result.data?.result?.image_url) {
                return result.data.result.image_url;
            }
            throw new Error('Gagal mendapatkan URL hasil');
        } catch (e) {
            // Fallback via removebg free api
            let url = await uploadImage(buffer);
            return `https://api.siputzx.my.id/api/iloveimg/removebg?url=${encodeURIComponent(url)}`;
        }
    }
};

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!/image/.test(mime)) {
        return m.reply(`Kirim atau balas foto dengan caption *${usedPrefix + command}*!`);
    }

    await m.reply('Sedang menghapus latar belakang gambar...');
    try {
        let media = await q.download?.();
        if (!media) throw 'Gagal mengunduh gambar!';

        let isHD = command.toLowerCase().includes('hd');
        let resUrl = await clyrBg.remove(media, isHD);

        await conn.sendMessage(m.chat, {
            image: { url: resUrl },
            caption: '✨ *Latar belakang berhasil dihapus!*'
        }, { quoted: m });
    } catch (e) {
        m.reply(`Gagal menghapus latar belakang: ${e.message || e}`);
    }
};

handler.help = ['removebg', 'removebghd'];
handler.tags = ['tools'];
handler.command = /^(removebg|nobg|hapusbg|removebghd)$/i;

export default handler;
