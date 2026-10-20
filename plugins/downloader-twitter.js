import axios from 'axios';
import * as cheerio from 'cheerio';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        return m.reply(`Masukkan URL X (Twitter)\n\n*Contoh:* ${usedPrefix + command} https://x.com/user/status/123456789`);
    }

    const regex = /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/status\/\d+/;
    if (!regex.test(args[0])) {
        return m.reply('Berikan URL dari X (Twitter) yang valid.');
    }

    m.reply('*Tunggu sebentar, sedang memproses...*');

    try {
        const res = await axios.post('https://twmate.com/', new URLSearchParams({
            page: args[0],
            ftype: 'all',
            ajax: '1'
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
                'Referer': 'https://twmate.com/',
            },
            timeout: 15000
        });

        const $ = cheerio.load(res.data);
        const videoLinks = [];
        $('.btn-dl').each((index, element) => {
            const quality = $(element).parent().prev().text().trim();
            const downloadUrl = $(element).attr('href');
            if (downloadUrl && downloadUrl.includes('.mp4')) {
                videoLinks.push({ quality, downloadUrl });
            }
        });

        if (videoLinks.length === 0) {
            return m.reply('Gagal mengambil video. Pastikan URL benar dan video bersifat publik.');
        }

        const best = videoLinks[0];
        let caption = `*Download Twitter/X*\n\n` +
                      `*Quality:* ${best.quality}\n` +
                      `*Source:* ${args[0]}`;

        await conn.sendMessage(m.chat, {
            video: { url: best.downloadUrl },
            caption: caption.trim()
        }, { quoted: m });

    } catch (error) {
        console.error(error);
        m.reply('Terjadi kesalahan saat memproses video Twitter.');
    }
};

handler.help = ['twitter <url>', 'x <url>'];
handler.tags = ['downloader'];
handler.command = /^(x|twitter|twdown)$/i;

export default handler;
