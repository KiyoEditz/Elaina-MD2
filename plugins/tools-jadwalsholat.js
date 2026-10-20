import axios from 'axios';
import * as cheerio from 'cheerio';

const handler = async (m, { conn, usedPrefix, command, args }) => {
    const kota = (args[0]?.toLowerCase() || 'jakarta');
    try {
        const { data } = await axios.get(`https://jadwal-sholat.tirto.id/kota-${kota}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);

        const jadwal = $('tr.currDate td').map((i, el) => $(el).text().trim()).get();

        if (jadwal.length === 7) {
            const [tanggal, subuh, duha, dzuhur, ashar, maghrib, isya] = jadwal;

            const caption = `╭──── 〔 *JADWAL SHOLAT* 〕 ─⬣
│ 🕌 *Kota*    : ${kota.charAt(0).toUpperCase() + kota.slice(1)}
│ 📅 *Tanggal* : ${tanggal}
│
│ 🌌 *Subuh*   : ${subuh}
│ 🌅 *Duha*    : ${duha}
│ ☀️ *Dzuhur*  : ${dzuhur}
│ ⛅ *Ashar*   : ${ashar}
│ 🌇 *Maghrib* : ${maghrib}
│ 🌃 *Isya*    : ${isya}
╰────────────────────────⬣`;

            await conn.reply(m.chat, caption, m);
        } else {
            await conn.reply(m.chat, `Jadwal sholat untuk kota *"${kota}"* tidak ditemukan. Pastikan nama kota sesuai (contoh: jakarta, surabaya, bandung, semarang).`, m);
        }
    } catch (error) {
        await conn.reply(m.chat, `Gagal memuat jadwal sholat: ${error.message || error}`, m);
    }
};

handler.help = ['jadwalsholat <kota>'];
handler.tags = ['tools'];
handler.command = /^((jadwal)?sh?[oa]lat)$/i;

export default handler;
