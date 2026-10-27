let handler = async (m, { conn, args, usedPrefix, groupMetadata }) => {
	let chat = global.db.data.chats[m.chat];
	if (!chat) {
		chat = global.db.data.chats[m.chat] = {};
	}

	if (chat.init && chat.gcdate > Date.now()) {
		return m.reply('Bot di Group ini sudah status *Aktif*');
	}

	if (!args[0]) return m.reply(`Masukkan kode redeem!\nContoh: *${usedPrefix}use ELN-TRIAL-XXXXXX*`);

	let code = args[0].trim().toUpperCase();
	if (!global.db.data.extra) global.db.data.extra = {};
	if (!global.db.data.extra.redeemCodes) global.db.data.extra.redeemCodes = {};

	let codes = global.db.data.extra.redeemCodes;
	let codeData = codes[code];

	if (!codeData) return m.reply('❌ Kode redeem tidak valid atau tidak ditemukan.');
	if (codeData.used) return m.reply('❌ Kode redeem sudah pernah digunakan.');

	// Cek proteksi trial jika grup sudah pernah pakai trial
	if (codeData.type === 'trial' && chat.trial) {
		let remaining = (chat.lastUse + 86400000) - Date.now();
		let sisaWaktu = remaining > 0 ? Math.ceil(remaining / 3600000) + ' Jam' : 'sebentar';
		return m.reply(`_Group ini sudah pernah trial/aktivasi gratis._\nGunakan lagi setelah ${sisaWaktu}\n\nAtau bisa juga aktivasi dengan kode premium via *${usedPrefix}sewa* / hubungi Owner.`);
	}

	let days = codeData.days || 3;
	if (codeData.type === 'trial') {
		chat.trial = 1;
	}

	let now = Date.now();
	let baseTime = chat.gcdate && chat.gcdate > now ? chat.gcdate : now;
	chat.gcdate = baseTime + days * 86400000;
	chat.init = true;

	// Tandai kode telah terpakai
	codeData.used = true;
	codeData.usedBy = m.chat;
	codeData.usedAt = now;

	let groupName = groupMetadata?.subject || (conn.getName ? await conn.getName(m.chat) : 'Grup ini');
	await m.reply(`✅ *Berhasil Aktivasi!*\nBot akan aktif di *${groupName}* selama *${days} Hari*.`);
};

handler.help = ['use <kode>'];
handler.tags = ['group'];
handler.command = /^use$/i;
handler.group = true;

export default handler;
