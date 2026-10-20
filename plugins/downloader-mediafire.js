import { fetch } from 'undici';
import { lookup } from 'mime-types';
import * as cheerio from 'cheerio';

let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) return m.reply(`*• Contoh :* ${usedPrefix + command} *[mediafire url]*`);

    const mediafireRegex = /^(https?:\/\/)?(www\.)?mediafire\.com\/.+$/i;
    if (!mediafireRegex.test(text)) {
        return m.reply(`*• Contoh :* ${usedPrefix + command} *[mediafire url]*`);
    }

    m.reply("Downloading...");

    try {
        let result = await mediafire(text);

        let cpt = `*乂 MEDIAFIRE - DOWNLOADER*\n\n   ◦ File Name : ${result.filename}\n   ◦ Type : ${result.type}\n   ◦ Size : ${result.size}`;

        let filename = result.filename;
        let url = result.download;

        await conn.sendFile(m.chat, url, filename, cpt, m, false, {
            mimetype: result.mimetype,
            fileName: filename,
        });
    } catch (e) {
        console.error(e);
        m.reply("Terjadi kesalahan saat mengunduh file Mediafire.");
    }
};

handler.help = ["mediafire", "mf"].map((a) => a + " *[url]*");
handler.tags = ["downloader"];
handler.command = ["mediafire", "mf"];

export default handler;

async function mediafire(url) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(url);
            const html = await response.text();
            const $ = cheerio.load(html);

            const type = $(".dl-btn-cont").find(".icon").attr("class")?.split("archive")?.[1]?.trim() || 'file';
            const filename = $(".dl-btn-label").attr("title") || 'file';
            const sizeMatch = $('.download_link .input').text().trim().match(/\((.*?)\)/);
            const size = sizeMatch ? sizeMatch[1] : 'Unknown';
            const ext = filename.split(".").pop();
            const mimetype = lookup(ext.toLowerCase()) || "application/" + ext.toLowerCase();
            const download = $(".input").attr("href");

            if (!download) {
                return reject(new Error("Gagal mengambil tautan unduhan"));
            }

            resolve({
                filename,
                type,
                size,
                ext,
                mimetype,
                download,
            });
        } catch (e) {
            reject(e);
        }
    });
}
