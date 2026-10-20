import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(`Contoh:\n${usedPrefix + command} jakarta hari ini, 2`);

    let [query, jumlah] = args.join(' ').split(',');
    query = query?.trim();
    jumlah = parseInt(jumlah) || 1;

    if (!query) return m.reply(`Kamu belum kasih kata kunci.\nContoh:\n${usedPrefix + command} jakarta hari ini, 2`);

    try {
        let res = await fetch(`https://api.siputzx.my.id/api/s/applemusic?query=${encodeURIComponent(query)}&region=id`);
        let json = await res.json();

        if (!json.status || !json.data?.result?.length) return m.reply('Tidak ditemukan.');

        let result = json.data.result.slice(0, jumlah);

        for (let item of result) {
            let link = item.link;
            if (!link) continue;

            let down = await fetch(`https://www.velyn.biz.id/api/downloader/applemusic?url=${encodeURIComponent(link)}`);
            let downJson = await down.json();

            if (downJson?.status && downJson.data?.download_url) {
                let data = downJson.data;
                let caption = `*Title:* ${data.name}\n` +
                              `*Artist:* ${data.artist}\n` +
                              `*Album:* ${data.albumname}\n` +
                              `*Duration:* ${data.duration}\n` +
                              `*Link:* ${data.url}`;
                await conn.sendMessage(m.chat, {
                    audio: { url: data.download_url },
                    mimetype: 'audio/mp4',
                    fileName: `${data.name}.m4a`,
                    caption: caption,
                    ptt: true,
                    contextInfo: {
                        externalAdReply: {
                            title: data.name,
                            body: data.artist,
                            thumbnailUrl: data.thumb,
                            mediaUrl: data.url,
                            mediaType: 1,
                            showAdAttribution: true,
                            renderLargerThumbnail: true,
                            sourceUrl: data.url
                        }
                    }
                }, { quoted: m });
            } else {
                let teks = `*Title:* ${item.title}\n*Artist:* ${item.artist}\n*Link:* ${item.link}`;
                if (item.image) {
                    await conn.sendMessage(m.chat, {
                        image: { url: item.image },
                        caption: teks
                    }, { quoted: m });
                } else {
                    await m.reply(teks);
                }
            }
        }
    } catch (e) {
        console.error(e);
        m.reply('Terjadi kesalahan saat mengambil data.');
    }
};

handler.help = ['applemusic <query>, <jumlah>'];
handler.tags = ['downloader'];
handler.command = /^applemusic$/i;

export default handler;
