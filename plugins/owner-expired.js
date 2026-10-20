let handler = async (m, { conn, args, usedPrefix, command }) => {
	if (!m.isGroup) return global.dfail('group', m, conn);
	if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {};
	let chat = global.db.data.chats[m.chat];

	if (/permanent/i.test(args[0])) {
		chat.permanent = true;
		chat.gcdate = 0;
		return m.reply('✅ Berhasil menetapkan masa aktif grup ini menjadi *Permanent*.');
	}

	let days = parseInt(args[0]);
	if (isNaN(days) || days < 1) {
		return m.reply(`Masukkan jumlah hari atau opsi 'permanent'!\nContoh:\n*${usedPrefix + command} 30*\n*${usedPrefix + command} permanent*`);
	}

	let now = Date.now();
	let current = chat.gcdate && chat.gcdate > now ? chat.gcdate : now;
	chat.gcdate = current + days * 86400000;
	chat.permanent = false;

	let sisa = Math.ceil((chat.gcdate - now) / 86400000);
	m.reply(`✅ Berhasil menambahkan masa aktif sewa grup selama *${days} hari*.\n• Total masa aktif tersisa: *${sisa} hari*`);
};

handler.help = ['expired <hari>', 'ext <hari>'];
handler.tags = ['owner'];
handler.command = /^(expired|ext(end)?|init)$/i;
handler.owner = true;
handler.group = true;

export default handler;
