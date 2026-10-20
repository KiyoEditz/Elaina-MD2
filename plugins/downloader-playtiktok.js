import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(`Masukkan query!\nContoh:\n${usedPrefix + command} haikyuu edit`);

    let query = args.join(' ');
    try {
        let res = await fetch(`https://apizell.web.id/download/tiktokplay?q=${encodeURIComponent(query)}`);
        let json = await res.json();

        if (!json.status || !json.data || !json.data.length) return m.reply('Video TikTok tidak ditemukan.');

        let vid = json.data[0];
        let caption = `*Title:* ${vid.title}\n` +
                      `*Author:* ${vid.author}\n` +
                      `*Views:* ${vid.views?.toLocaleString?.() || vid.views}\n` +
                      `*Description:* ${vid.desc || '-'}`;

        await conn.sendMessage(m.chat, {
            video: { url: vid.url },
            caption,
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: true,
                    title: vid.title,
                    body: `By ${vid.author}`,
                    mediaType: 1,
                    thumbnailUrl: vid.thumbnail,
                    mediaUrl: vid.url,
                    sourceUrl: vid.url
                }
            }
        }, { quoted: m });
    } catch (e) {
        console.error(e);
        m.reply('Terjadi kesalahan saat mengambil data TikTok.');
    }
};

handler.help = ['playtiktok <query>'];
handler.tags = ['downloader'];
handler.command = /^playtiktok$/i;

export default handler;
