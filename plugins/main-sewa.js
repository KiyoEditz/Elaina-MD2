let handler = async (m, { conn, usedPrefix }) => {
	let botNum = (conn.user?.jid || global.conn?.user?.jid || '').split('@')[0];
	let capt = `
╔══════════════════════
║ 🏷️ *SEWA BOT GROUP*
╠══════════════════════
║ 1. *Silver [Trial]*
║ • Durasi: 3 Hari
║ • https://wa.me/${botNum}?text=.claim+kode
║
║ 2. *Gold*
║ • Pengguna Baru: Rp. 8.000
║ • Perpanjang: Rp. 6.000
║ • Durasi: 30 Hari
║
║ 3. *Diamond*
║ • Pengguna Baru: Rp. 11.000
║ • Perpanjang: Rp. 8.000
║ • Durasi: 60 Hari
╠══════════════════════
║ 🌟 *Fitur Grup:*
║ • Hidetag & Mention All Member
║ • Welcome & Bye Pesan
║ • Anti Delete, Anti Link, ViewOnce
║ • Game Interaktif
╚══════════════════════

╔══════════════════════
║ 💎 *MEMBER PREMIUM*
╠══════════════════════
║ [30 Hari]
║ • Baru: Rp. 15.000
║ • Perpanjang: Rp. 8.000
║
║ *Keuntungan Premium:*
║ • Limit tanpa batas (Unlimited)
║ • Bonus XP lebih besar
║ • Akses fitur eksklusif
╚══════════════════════
Hubungi owner untuk pemesanan: *${usedPrefix}owner*
`.trim();

	await conn.reply(m.chat, capt, m);
};

handler.help = ['sewabot', 'premium'];
handler.tags = ['main', 'group'];
handler.command = /^(sewa(bot)?|premium)$/i;

export default handler;
