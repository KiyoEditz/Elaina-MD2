import fetch from 'node-fetch';

async function translateText(text, targetLang = 'id') {
    // Coba MyMemory
    try {
        let res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|${targetLang}`);
        let json = await res.json();
        if (json.responseData?.translatedText) {
            return json.responseData.translatedText;
        }
    } catch {}

    // Fallback Google Translate
    try {
        let res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        let json = await res.json();
        if (json[0]) {
            return json[0].map(item => item[0]).join('');
        }
    } catch {}

    throw new Error('Semua server penerjemah sedang sibuk.');
}

let handler = async (m, { args, usedPrefix, command }) => {
    let lang = 'id';
    let text = '';

    if (args[0] && args[0].length === 2 && !args[0].includes('.')) {
        lang = args[0].toLowerCase();
        text = args.slice(1).join(' ');
    } else {
        text = args.join(' ');
    }

    if (!text && m.quoted?.text) {
        text = m.quoted.text;
    }

    if (!text) {
        throw `Contoh Penggunaan:\n*${usedPrefix + command} en Halo apa kabar?*\n*${usedPrefix + command} ja Selamat pagi*\natau reply pesan dengan *${usedPrefix + command} en*`;
    }

    try {
        let result = await translateText(text.trim(), lang);
        m.reply(result);
    } catch (e) {
        m.reply(`Gagal menerjemahkan: ${e.message || e}`);
    }
};

handler.help = ['translate <kode_bahasa> <teks>', 'tr <kode_bahasa> <teks>'];
handler.tags = ['tools'];
handler.command = /^(translate|tl|trid|tr)$/i;

export default handler;
