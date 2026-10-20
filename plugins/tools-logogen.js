import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`Masukkan judul, ide, dan slogan logo.\nFormat: *${usedPrefix + command} Judul|Ide|Slogan*\n\n*Contoh:* *${usedPrefix + command} ChiiBot|Kelinci Lucu Modern|Fast & Reliable Bot*`);
    }

    const [title, idea, slogan] = text.split('|');

    if (!title || !idea || !slogan) {
        return m.reply(`Format belum lengkap!\nGunakan: *${usedPrefix + command} Judul|Ide|Slogan*\n\nContoh: *${usedPrefix + command} ChiiBot|Kelinci Lucu Modern|Fast & Reliable Bot*`);
    }

    await m.reply('Sedang membuat logo, mohon tunggu sebentar...');

    try {
        const payload = {
            ai_icon: [333276, 333279],
            height: 300,
            idea: idea.trim(),
            industry_index: 'N',
            industry_index_id: '',
            pagesize: 4,
            session_id: '',
            slogan: slogan.trim(),
            title: title.trim(),
            whiteEdge: 80,
            width: 400
        };

        const { data } = await axios.post('https://www.sologo.ai/v1/api/logo/logo_generate', payload, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (!data?.data?.logoList || data.data.logoList.length === 0) {
            return m.reply('Gagal membuat logo dari server.');
        }

        const logoUrls = data.data.logoList.map(logo => logo.logo_thumb).filter(Boolean);

        for (let i = 0; i < Math.min(logoUrls.length, 3); i++) {
            await conn.sendMessage(m.chat, {
                image: { url: logoUrls[i] },
                caption: `✨ *Logo ${i + 1}* untuk *${title.trim()}*`
            }, { quoted: m });
        }
    } catch (error) {
        console.error('Error generating logo:', error);
        m.reply(`Gagal membuat logo: ${error.message || error}`);
    }
};

handler.help = ['logogen <Judul>|<Ide>|<Slogan>'];
handler.tags = ['tools'];
handler.command = ['logogen'];

export default handler;
