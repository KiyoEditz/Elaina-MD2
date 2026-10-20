import axios from 'axios';
import * as cheerio from 'cheerio';

const kusonime = {
    search: async function(query) {
        try {
            const { data } = await axios.get(`https://kusonime.com/?s=${encodeURIComponent(query)}&post_type=post`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });
            const $ = cheerio.load(data);

            const result = $('.kover').map((_, element) => {
                const $element = $(element);
                return {
                    title: $element.find('.episodeye a').text().trim(),
                    link: $element.find('.episodeye a').attr('href'),
                    thumbnail: $element.find('.thumbz img').attr('src'),
                    postedBy: $element.find('.fa-user').parent().text().replace('Posted by', '').trim(),
                    releaseTime: $element.find('.fa-clock-o').parent().text().replace('Released on', '').trim(),
                    genres: $element.find('.fa-tag').parent().find('a').map((_, genre) => $(genre).text().trim()).get()
                };
            }).get();
            return { data: result };
        } catch (error) {
            return { data: [], error: 'Gagal mengambil data pencarian Kusonime.' };
        }
    },

    detail: async function(url) {
        try {
            const { data } = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });
            const $ = cheerio.load(data);
            const info = {};
            $('.info p').each((_, element) => {
                const text = $(element).text().trim();
                if (text.includes(':')) {
                    const [key, value] = text.split(':').map(item => item.trim());
                    info[key] = value;
                }
            });
            const synopsis = $('.lexot p').map((_, element) => {
                const text = $(element).text().trim();
                return (!text.includes('Released on') && !text.includes('Credit') && text.length > 0 && !text.includes(':')) ? text : null;
            }).get().filter(Boolean);
            const dlink = {};
            $('.smokeurlrh').each((_, element) => {
                const $element = $(element);
                const quality = $element.find('strong').text().trim();
                const links = {};
                $element.find('a').each((_, link) => {
                    const $link = $(link);
                    links[$link.text().trim()] = $link.attr('href');
                });
                dlink[quality] = links;
            });
            return {
                data: {
                    title: $('.jdlz').text().trim(),
                    thumbnail: $('.post-thumb img').attr('src'),
                    views: $('.viewoy').text().trim(),
                    info,
                    synopsis: synopsis.join('\n\n'),
                    download: dlink
                }
            };
        } catch (error) {
            return { data: null, error: 'Gagal mengambil detail Kusonime.' };
        }
    }
};

const handler = async (m, { text, usedPrefix, command, conn }) => {
    if (command === 'kusonime-detail' || command === 'kusonimedetail') {
        if (!text) return m.reply(`Masukkan URL Kusonime!\n\nContoh:\n*${usedPrefix + command} https://kusonime.com/naruto-batch/*`);
        const { data, error } = await kusonime.detail(text);
        if (error || !data) return m.reply(error || 'Detail anime tidak ditemukan.');

        let dlText = '';
        for (const [resolusi, links] of Object.entries(data.download)) {
            dlText += `\n*Resolusi ${resolusi}:*\n`;
            for (const [server, link] of Object.entries(links)) {
                dlText += `  • ${server}: ${link}\n`;
            }
        }

        const infoText = Object.entries(data.info).map(([k, v]) => `• *${k}*: ${v}`).join('\n');
        const caption = `🎬 *${data.title}*\n\n${infoText}\n\n📖 *Sinopsis:*\n${data.synopsis || '-'}\n\n📥 *Link Download:*${dlText || '\n- Tidak ditemukan link download'}`;

        if (data.thumbnail) {
            await conn.sendMessage(m.chat, { image: { url: data.thumbnail }, caption }, { quoted: m });
        } else {
            m.reply(caption);
        }
        return;
    }

    if (!text) return m.reply(`Masukkan judul anime yang ingin dicari di Kusonime!\n\nContoh:\n*${usedPrefix + command} naruto*`);
    const { data, error } = await kusonime.search(text);
    if (error || !data || data.length === 0) return m.reply(error || 'Anime tidak ditemukan di Kusonime.');

    let list = data.slice(0, 10).map((item, index) => {
        return `*${index + 1}. ${item.title}*\n` +
            `• Genre: ${item.genres.join(', ') || '-'}\n` +
            `• Rilis: ${item.releaseTime || '-'}\n` +
            `• Link: ${item.link}`;
    }).join('\n\n');

    let caption = `╭──── 〔 *KUSONIME SEARCH* 〕 ─⬣
│ 🔎 *Query*: ${text}
│ 📊 *Hasil*: ${data.length} anime ditemukan
╰────────────────────────⬣\n\n${list}\n\n_Ketik *${usedPrefix}kusonimedetail <url>* untuk melihat link download!_`;

    m.reply(caption);
};

handler.help = ['kusonime <judul>', 'kusonimedetail <url>'];
handler.tags = ['anime', 'tools'];
handler.command = /^(kusonime|kusonime-detail|kusonimedetail)$/i;

export default handler;
