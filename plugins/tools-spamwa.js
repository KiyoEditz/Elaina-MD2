let handler = async (m, { conn, text, usedPrefix, command }) => {
    let [nomor, pesan, jumlah] = text.split('|');
    if (!nomor || !pesan) {
        throw `Format:\n*${usedPrefix + command} nomor|pesan|jumlah*\n\nContoh:\n*${usedPrefix + command} 6285874068202|Halo bro!|10*`;
    }

    let fixedCount = Math.min(Math.max(parseInt(jumlah) || 5, 1), 50);
    let cleanNum = nomor.replace(/[^0-9]/g, '');
    if (cleanNum.startsWith('0')) cleanNum = '62' + cleanNum.slice(1);
    let targetJid = cleanNum + '@s.whatsapp.net';

    await m.reply(`*Memulai pengiriman spam...*\nTarget: +${cleanNum}\nJumlah: ${fixedCount} pesan`);

    for (let i = 0; i < fixedCount; i++) {
        let teks = `${pesan.trim()}\n\n_[${i + 1}/${fixedCount}]_`;
        await conn.sendMessage(targetJid, { text: teks });
        if (i < fixedCount - 1) await new Promise(r => setTimeout(r, 800));
    }

    await m.reply(`*Selesai mengirim ${fixedCount} pesan spam ke +${cleanNum}!*`);
};

handler.help = ['spamwa <nomor>|<pesan>|<jumlah>'];
handler.tags = ['tools', 'premium'];
handler.command = /^spam(wa)?$/i;
handler.premium = true;

export default handler;
