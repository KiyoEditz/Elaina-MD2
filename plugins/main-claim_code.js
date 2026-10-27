let handler = async (m, { text, usedPrefix }) => {
	if (!/kode/i.test(text)) {
		return m.reply(`Gunakan perintah: *${usedPrefix}claim kode*\nUntuk mengklaim kode aktivasi grup gratis (Trial 3 Hari).`);
	}

	if (m.isGroup) {
		return m.reply('_Hanya bisa klaim kode di chat Pribadi (PM)._');
	}

	let user = global.db.data.users[m.sender];
	if (!user) user = global.db.data.users[m.sender] = {};

	let now = Date.now();
	let cooldown = 86400000 * 2; // Cooldown 2 hari

	if (user.lastclaim_code && (now - user.lastclaim_code < cooldown)) {
		let remaining = (user.lastclaim_code + cooldown) - now;
		let sisaJam = Math.ceil(remaining / 3600000);
		return m.reply(`_Kamu sudah mengklaim kode redeem grup gratis._\nTunggu selama *${sisaJam} jam* lagi.\n\nKamu dapat klaim kode grup gratis 2 hari sekali.`);
	}

	let randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
	let code = `ELN-TRIAL-${randomPart}`;

	if (!global.db.data.extra) global.db.data.extra = {};
	if (!global.db.data.extra.redeemCodes) global.db.data.extra.redeemCodes = {};

	global.db.data.extra.redeemCodes[code] = {
		code,
		type: 'trial',
		days: 3,
		createdAt: now,
		used: false,
		usedBy: '',
	};

	user.lastclaim_code = now;

	let caption = `
*〔 KODE AKTIVASI GRUP TRIAL 〕*

• *Tipe:* TRIAL (3 Hari)
• *Kode Redeem:* \`${code}\`

_Cara Menggunakan:_
1. Pastikan Bot sudah dimasukkan ke dalam grup kamu.
2. Salin perintah di bawah ini dan kirim ke grup:
*${usedPrefix}use ${code}*

_Jika ingin mendapatkan kode dengan masa aktif lebih panjang, silakan ketik *${usedPrefix}sewa* atau hubungi owner._
`.trim();

	await m.reply(caption);
};

handler.help = ['claim kode'];
handler.tags = ['main'];
handler.command = /^claim$/i;
handler.private = true;

export default handler;
