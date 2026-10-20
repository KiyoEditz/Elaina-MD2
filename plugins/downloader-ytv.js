import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Masukkan URL YouTube!\n\nContoh:\n${usedPrefix + command} https://youtu.be/4rDOsvzTicY`;    
  
    m.reply(global.wait || '_Sedang diproses, mohon tunggu..._');   

    try {
        let videoUrl = null;
        let title = 'YouTube Video';
        let thumb = null;

        // Coba endpoint 1: BetaBotz API
        try {
            const response = await axios.get(`https://api.betabotz.eu.org/api/download/ytmp4?url=${encodeURIComponent(text)}&apikey=Btz-KiyoEditz`, { timeout: 15000 });        
            if (response.data?.result?.mp4) {
                videoUrl = response.data.result.mp4;
                title = response.data.result.title || title;
                thumb = response.data.result.thumb;
            }
        } catch (e) {}

        // Coba endpoint 2: Workers Dev API
        if (!videoUrl) {
            try {
                const response = await axios.get(`https://ab-ytdlv2.abrahamdw882.workers.dev/?url=${encodeURIComponent(text)}&format=720`, { timeout: 15000 });        
                if (response.data?.data?.downloadUrl) {
                    videoUrl = response.data.data.downloadUrl;
                    title = response.data.data.title || title;
                    thumb = response.data.data.image;
                }
            } catch (e) {}
        }

        // Coba endpoint 3: Siputzx API
        if (!videoUrl) {
            try {
                const response = await axios.get(`https://api.siputzx.my.id/api/d/youtube?url=${encodeURIComponent(text)}`, { timeout: 15000 });
                if (response.data?.data?.video || response.data?.data?.dl) {
                    videoUrl = response.data.data.video || response.data.data.dl;
                    title = response.data.data.title || title;
                    thumb = response.data.data.thumbnail;
                }
            } catch (e) {}
        }

        if (!videoUrl) {
            throw new Error('Gagal mendapatkan tautan video dari semua server.');
        }

        let capt = `╭──── 〔 YOUTUBE VIDEO 〕 ─⬣\n` +
                   ` ⬡ *Title* : ${title}\n` +
                   ` ⬡ *Link* : ${text}\n` +
                   `╰────────⬣`;    

        await conn.sendMessage(m.chat, { 
            video: { url: videoUrl }, 
            caption: capt,
            mimetype: 'video/mp4'
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply(`*Error:* ${e.message || e}`);
    }
};

handler.help = ['ytmp4 <url>', 'ytv <url>'];
handler.command = /^y(ou)?t(ube)?(v|mp4)?$/i;
handler.tags = ['downloader'];
handler.limit = true;

export default handler;
