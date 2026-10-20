let handler = async (m, { text, usedPrefix, command }) => {
    let name = text || (m.quoted && m.quoted.name) || (m.pushName) || 'Anonim';
    name = name.charAt(0).toUpperCase() + name.slice(1);

    // Seeded random based on name for consistent results per day, or random
    let level = Math.floor(Math.random() * 101);

    const descriptions = [
        { max: 20, title: 'Otak Kentang 🥔', desc: 'Sering lupa naruh kacamata padahal lagi dipake. Butuh upgrade RAM!' },
        { max: 40, title: 'Rata-Rata Agak Miring 🤪', desc: 'Pintar kalau kepepet, sisanya mikirin menu makan siang.' },
        { max: 60, title: 'Warga Normal Standar Pabrik 📱', desc: 'Bisa mikir logis, tapi males ribet. IQ cukup buat bertahan hidup.' },
        { max: 80, title: 'Cerdas & Gesit 💡', desc: 'Punya daya analisa tajam, cepat tanggap, dan problem solver handal.' },
        { max: 95, title: 'Otak Einstein Mini ⚡', desc: 'Sangat jenius, pola pikir strategis, selalu punya 5 langkah ke depan!' },
        { max: 100, title: 'Jenius Tingkat Dewa 🌌', desc: 'Kecerdasan kosmik tak tertandingi! Sang arsitek peradaban masa depan!' }
    ];

    let rank = descriptions.find(d => level <= d.max) || descriptions[descriptions.length - 1];

    let filledBlocks = Math.round((level / 100) * 10);
    let emptyBlocks = 10 - filledBlocks;
    let progressBar = '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);

    let caption = `╭──── 〔 *HASIL CEK GENIUS* 〕 ─⬣
│ 👤 *Nama*  : ${name}
│ 📊 *Level* : ${level}%
│ 📈 *Status*: [${progressBar}]
│ 🏆 *Gelar* : *${rank.title}*
╰────────────────────────⬣

📝 *Analisa*:
"${rank.desc}"`;

    m.reply(caption);
};

handler.help = ['cekgenius <nama>'];
handler.tags = ['tools', 'fun'];
handler.command = ['cekgenius'];

export default handler;
