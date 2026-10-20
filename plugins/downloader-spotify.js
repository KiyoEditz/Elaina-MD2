import { getInfo, spotifydl } from '../lib/spotify.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Masukkan Link Spotify ‼️, *Contoh:* ${usedPrefix + command} https://open.spotify.com/track/xxxxxxxx`;
    
    conn.sendMessage(m.chat, {
        react: {
            text: '🕒',
            key: m.key,
        }
    });

    try {
        let music = await spotifydl(text);
        const info = await getInfo(text);

        let captionvid = `∘ Title: ${info.data?.title || 'Unknown'}\n∘ Artist: ${info.data?.artist?.name || info.data?.artist || 'Unknown'}\n\n*ChiiMD Spotify Downloader*`;
        
        let p = info.data?.thumbnail;
        try {
            const { default: canvafy } = await import('canvafy');
            p = await new canvafy.Spotify()
                .setTitle(info.data.title)
                .setAuthor("Spotify Downloader")
                .setTimestamp(40, 100)
                .setOverlayOpacity(0.8)
                .setBorder("#fff", 0.8)
                .setImage(info.data.thumbnail)
                .setBlur(3)
                .build();
        } catch (canvafyErr) {
            // Canvafy tidak terpasang, gunakan gambar thumbnail langsung
            p = info.data?.thumbnail;
        }

        if (p) {
            await conn.sendFile(m.chat, p, 'spotify.jpg', captionvid, m);
        }

        if (music.download) {
            await conn.sendFile(m.chat, music.download, (info.data?.title || 'music') + '.mp3', '', m, null, {
                asDocument: global.db?.data?.users?.[m.sender]?.useDocument || false
            });
        }
    } catch (e) {
        console.error(e);
        throw `Terjadi Kesalahan!\n${e.message || e}`;
    }
};

handler.help = ['spotify', 'spotifydl'];
handler.tags = ['downloader'];
handler.command = /^(spotify|spotifydl)$/i;

export default handler;
