let handler = async (m, { conn, args, usedPrefix, command }) => {
	if (!m.isGroup) return global.dfail('group', m, conn);
	if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {};
	let chat = global.db.data.chats[m.chat];

	if (args[0] === '0' || /^(off|reset|del)$/i.test(args[0])) {
		chat.gcdate = 0;
		chat.init = false;
		chat.permanent = false;
		return m.reply('✅ Berhasil menonaktifkan masa aktif sewa grup ini.');
	}

	if (/permanent/i.test(args[0])) {
		chat.permanent = true;
		chat.init = true;
		chat.gcdate = 0;
		return m.reply('✅ Berhasil menetapkan masa aktif grup ini menjadi *Permanent*.');
	}

	let days = parseInt(args[0]);
	if (isNaN(days) || days < 1) {
		return m.reply(`Masukkan jumlah hari atau opsi 'permanent'!\nContoh:\n*${usedPrefix + command} 30*\n*${usedPrefix + command} permanent*\n*${usedPrefix + command} 0* (untuk menonaktifkan)`);
	}

	let now = Date.now();
	let current = chat.gcdate && chat.gcdate > now ? chat.gcdate : now;
	chat.gcdate = current + days * 86400000;
	chat.init = true;
	chat.permanent = false;

	let sisa = Math.ceil((chat.gcdate - now) / 86400000);
	m.reply(`✅ Berhasil menambahkan masa aktif sewa grup selama *${days} hari*.\n• Total masa aktif tersisa: *${sisa} hari*`);
};

handler.help = ['expired <hari>', 'expired permanent', 'expired 0'];
handler.tags = ['owner'];
handler.command = /^(expired|ext(end)?|init)$/i;
handler.owner = true;
handler.group = true;

export default handler;
