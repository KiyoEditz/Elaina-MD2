let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`Format salah!\nGunakan: *${usedPrefix + command} toko|id_transaksi|harga_admin|nomor_tujuan|barang1-harga1,barang2-harga2*\n\n*Contoh:*\n*${usedPrefix + command} Alfamart|TRX88291|2500|085874068202|Indomie-3500,Teh Botol-4000,Aqua-3000*`);
    }

    let [toko, idTransaksi, hargaAdmin, nomorTujuan, items] = text.split('|');
    if (!toko || !idTransaksi || !hargaAdmin || !nomorTujuan || !items) {
        return m.reply('*Format tidak lengkap!* Pastikan semua bagian terisi dipisahkan dengan tanda |');
    }

    let daftarBarang = items.split(',').map((item, index) => {
        let [nama, harga] = item.split('-');
        return {
            nomor: index + 1,
            nama: (nama || 'Barang').trim(),
            harga: parseInt(harga) || 0
        };
    });

    let totalHarga = daftarBarang.reduce((sum, item) => sum + item.harga, 0);
    let admin = parseInt(hargaAdmin) || 0;
    let totalKeseluruhan = totalHarga + admin;

    let dateStr = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

    let itemsFormatted = daftarBarang.map(item => {
        let nameStr = item.nama.padEnd(16).slice(0, 16);
        let priceStr = ('Rp' + item.harga.toLocaleString('id-ID')).padStart(12);
        return `${item.nomor}. ${nameStr} ${priceStr}`;
    }).join('\n');

    let receipt = `\`\`\`
================================
         ${toko.toUpperCase().padStart(16 + Math.floor(toko.length / 2))}
      ${dateStr}
--------------------------------
ID Transaksi : ${idTransaksi}
No. Tujuan   : ${nomorTujuan}
--------------------------------
DAFTAR ITEM:
${itemsFormatted}
--------------------------------
Subtotal     : ${('Rp' + totalHarga.toLocaleString('id-ID')).padStart(15)}
Biaya Admin  : ${('Rp' + admin.toLocaleString('id-ID')).padStart(15)}
--------------------------------
TOTAL BAYAR  : ${('Rp' + totalKeseluruhan.toLocaleString('id-ID')).padStart(15)}
================================
   TERIMA KASIH TELAH BERBELANJA
================================
\`\`\``;

    await m.reply(receipt);
};

handler.help = ['receipt', 'struk'];
handler.tags = ['tools'];
handler.command = /^(receipt|struk|struk2)$/i;

export default handler;
