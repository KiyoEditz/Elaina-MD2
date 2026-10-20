import { steam } from '../lib/steam.js';

let handler = async (m, { conn, command, text, usedPrefix }) => {
    if (!text) {
        throw `Masukkan judul game Steam yang ingin dicari!\n\nContoh:\n*${usedPrefix + command} Dota 2*`;
    }

    await conn.reply(m.chat, '_Sedang mencari game di Steam Store..._', m);

    try {
        const response = await steam(text.trim());
        if (!response) throw 'Game tidak ditemukan di Steam!';

        const { id, name, description, screenshots = [], trailers = [], price, developers, genres, release, url } = response;

        let descClean = description.length > 300 ? description.slice(0, 300) + '...' : description;

        let capt = `╭──── 〔 *STEAM STORE* 〕 ─⬣
│ 🎮 *Judul*       : ${name}
│ 🆔 *App ID*      : ${id}
│ 🏷️ *Genre*       : ${genres.join(', ') || '-'}
│ 💰 *Harga*       : ${price}
│ 📅 *Rilis*       : ${release}
│ 👨‍💻 *Developer*   : ${developers.join(', ') || '-'}
│ 🔗 *Store Link*  : ${url}
╰────────────────────────⬣

📝 *Deskripsi:*
${descClean || '_Tidak ada deskripsi_'}`;

        if (trailers.length > 0) {
            capt += `\n\n🎬 *Trailer*: ${trailers[0].mp4 || trailers[0].webm || '-'}`;
        }

        if (response.image) {
            await conn.sendMessage(m.chat, {
                image: { url: response.image },
                caption: capt
            }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, { text: capt }, { quoted: m });
        }

    } catch (e) {
        m.reply(`Gagal mencari game: ${e.message || e}`);
    }
};

handler.help = ['steam <nama_game>'];
handler.command = /^(steam)$/i;
handler.tags = ['search', 'tools'];
handler.limit = true;

export default handler;
