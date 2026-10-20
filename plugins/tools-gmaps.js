import axios from 'axios';
import * as cheerio from 'cheerio';

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0';

async function jarak(dari, ke) {
    let html = (await axios.get(`https://www.google.com/search?q=${encodeURIComponent('jarak ' + dari + ' ke ' + ke)}&hl=id`, {
        headers: {
            'User-Agent': userAgent
        }
    })).data;
    let $ = cheerio.load(html);
    let obj = {};

    let img = html.split("var s='")?.[1]?.split("'")?.[0];
    obj.img = /^data:.*?\/.*?;base64,/i.test(img) ? Buffer.from(img.split(',')[1], 'base64') : null;

    obj.captions = [];
    $('div.BbbuR.uc9Qxb.uE1RRc').each((index, element) => {
        let caption = $(element).text()?.trim();
        if (caption) obj.captions.push(caption);
    });

    return obj;
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
    let [dari, ke] = text.split('|');
    if (!dari || !ke) throw `Contoh Penggunaan:\n*${usedPrefix + command} Jakarta|Bandung*`;

    if (dari.toLowerCase().trim() === ke.toLowerCase().trim()) {
        return conn.reply(m.chat, 'Jarak dari lokasi ke tempat yang sama adalah 0 km!', m);
    }

    conn.reply(m.chat, 'Tunggu sebentar, sedang mencari rute dan jarak...', m);

    try {
        let result = await jarak(dari.trim(), ke.trim());
        let mapUrl = `https://www.google.com/maps/dir/${encodeURIComponent(dari.trim())}/${encodeURIComponent(ke.trim())}/`;
        let captionText = `🗺️ *RUTE & JARAK PERJALANAN*\n\n` +
            `📍 *Dari* : ${dari.trim()}\n` +
            `🎯 *Tujuan* : ${ke.trim()}\n\n` +
            (result.captions.length ? `ℹ️ *Estimasi:* \n${result.captions.join('\n')}\n\n` : '') +
            `🔗 *Buka di Google Maps:*\n${mapUrl}`;

        if (result.img) {
            await conn.sendMessage(m.chat, {
                image: result.img,
                caption: captionText
            }, { quoted: m });
        } else {
            conn.reply(m.chat, captionText, m);
        }
    } catch (e) {
        conn.reply(m.chat, `Gagal mencari rute: ${e.message || e}`, m);
    }
};

handler.help = ['jarak <dari>|<ke>', 'gmaps <dari>|<ke>'];
handler.tags = ['tools'];
handler.command = /^(jarak|gmaps)$/i;

export default handler;
