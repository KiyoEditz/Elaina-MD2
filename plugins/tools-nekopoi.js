let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    let query = text || args.join(' ');
    if (!query) {
        throw `Masukkan judul yang ingin dicari!\n\nContoh:\n${usedPrefix}${command} blue archive`;
    }

    try {
        conn.reply(m.chat, `_Sedang memproses, harap tunggu..._`, m);

        // Mengambil respons dari scraper
        const { default: NekoPoi } = await import(`../lib/nekopoi.js?v=${Date.now()}`);
        const response = await NekoPoi.search(query.trim());
        if (!response || response.length === 0) {
            throw `Pencarian "${query.trim()}" tidak ditemukan!`;
        }

        const { type, title, desc, images, url } = response[0];

        let capt = `╭──── 〔NEKOPOI〕 ─⬣\n`;
        capt += ` ⬡ *Title* : ${title}\n`;
        capt += ` ⬡  *Type* : ${type}\n`;
        if (desc) capt += ` ⬡  *Desc* : ${desc}\n`;
        capt += `╰────────⬣\n`;
        capt += ` ⬡  *Url* : ${url}\n`;

        if (images) {
            await conn.sendMessage(m.chat, {
                image: { url: images },
                caption: capt
            }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, {
                text: capt
            }, { quoted: m });
        }
    } catch (e) {
        throw `Error: ${e.message || e}`;
    }
};

handler.help = ['nekopoi'];
handler.command = /^(nekopoisearch|nekopoi)$/i;
handler.tags = ['downloader', 'tools'];
handler.premium = true;
handler.nsfw = true;

export default handler;