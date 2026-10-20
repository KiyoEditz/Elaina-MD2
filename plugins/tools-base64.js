let handler = async (m, { command, text, usedPrefix }) => {
    let txt = text || (m.quoted && m.quoted.text);
    if (!txt) throw `Masukkan teks yang ingin di-encode/decode ke Base64!\n\nContoh:\n*${usedPrefix + command} halo dunia*`;
    
    // Jika input terlihat seperti valid base64, tampilkan encode dan decode
    let encoded = Buffer.from(txt, 'utf-8').toString('base64');
    let decoded = '';
    try {
        let dec = Buffer.from(txt, 'base64').toString('utf-8');
        if (Buffer.from(dec, 'utf-8').toString('base64') === txt.trim()) {
            decoded = dec;
        }
    } catch {}

    let caption = `*Base64 Encode:*\n${encoded}`;
    if (decoded) {
        caption += `\n\n*Base64 Decode:*\n${decoded}`;
    }
    m.reply(caption);
};

handler.help = ['base64 <teks>'];
handler.tags = ['tools'];
handler.command = /^base64$/i;

export default handler;
