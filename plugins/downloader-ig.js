import axios from 'axios';
import * as cheerio from 'cheerio';

const handler = async (m, { conn, text, usedPrefix, command }) => {
   if (!text) return m.reply(`Masukkan URL Instagram!\nContoh: ${usedPrefix + command} https://www.instagram.com/p/xxx`);

   try {
      const igdl = async (url) => {
         let { data } = await axios.get(`https://snapdownloader.com/tools/instagram-downloader/download?url=${encodeURIComponent(url)}`, {
            headers: {
               'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 15000
         });
         let $ = cheerio.load(data);
         const result = [];

         $(".download-item").each((i, el) => {
            const type = $(el).find(".type").text().trim().toLowerCase();
            const url = $(el).find(".btn-download").attr("href");
            if (url) result.push({ type, url });
         });

         return result;
      };

      await conn.sendMessage(m.chat, {
         react: {
            text: "⏳",
            key: m.key
         }
      });

      const res = await igdl(text);
      if (!res.length) return m.reply("Gagal mengambil media. Pastikan akun tidak diprivat dan URL valid.");

      let linkList = res.map((v, i) => `${i + 1}. [${v.type}] ${v.url}`).join('\n');
      let caption = `Berikut media yang berhasil diunduh:\n\n${linkList}`;

      for (let i = 0; i < res.length; i++) {
         let media = res[i];
         if (media.type === "video") {
            await conn.sendMessage(m.chat, {
               video: { url: media.url },
               caption
            }, { quoted: m });
         } else if (media.type === "photo" || media.type === "image") {
            await conn.sendMessage(m.chat, {
               image: { url: media.url },
               caption
            }, { quoted: m });
         }
      }

      await conn.sendMessage(m.chat, {
         react: {
            text: "✔️",
            key: m.key
         }
      });

   } catch (e) {
      console.error(e);
      m.reply("Gagal mengunduh media Instagram!\n\n" + (e.message || e));
   }
};

handler.command = ['igdl', 'ig', 'instagram'];
handler.tags = ['downloader'];
handler.help = ['ig <url>'];
handler.premium = false;
handler.limit = false;

export default handler;
