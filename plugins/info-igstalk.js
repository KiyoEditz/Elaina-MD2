import * as cheerio from 'cheerio';
import axios from 'axios';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(`Masukkan nama pengguna Instagram yang valid!\nContoh: ${usedPrefix + command} jokowi`);
    try {
        const data = await stalkige(args[0]);
        const caption = `╭──── 〔 IG STALK 〕 ─⬣\n` +
            ` ⬡ *Username* : ${data.namalu}\n` +
            ` ⬡ *Bio* : ${data.bio}\n` +
            ` ⬡ *Postingan* : ${data.totalpost}\n` +
            ` ⬡ *Pengikut* : ${data.totalpengikut}\n` +
            `╰────────⬣`;
        await conn.sendFile(m.chat, data.linkpp, 'profile.jpg', caption, m);
    } catch (e) {
        m.reply(e.message || "Terjadi kesalahan saat mencari profil.");
    }
};

handler.help = ['igstalk <username>'];
handler.command = /^(igstalk)$/i;
handler.tags = ['info'];

export default handler;

async function stalkige(namalu) {
    const url = `https://greatfon.io/v/${encodeURIComponent(namalu)}`;
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://greatfon.io',
            },
            timeout: 15000
        });

        const $ = cheerio.load(data);

        const username = $('h1.text-4xl').text().trim() || namalu;
        const bio = $('.items-top .text-sm').text().trim() || 'Tidak ada bio';
        const totalpost = $('.stat-title:contains("Posts")').siblings('.stat-value').text().trim() || '0';
        const totalpengikut = $('.stat-title:contains("Followers")').siblings('.stat-value').text().trim() || '0';
        const linkpp = $('figure img').attr('src') || 'https://i.ibb.co/2kR4p86/avatar.png';

        return {
            namalu: username,
            bio,
            totalpost,
            totalpengikut,
            linkpp,
        };
    } catch (error) {
        throw new Error("Terjadi kesalahan saat mengambil data. Pastikan nama pengguna benar.");
    }
}
