const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let handler = async (m, { conn, args, command }) => {
	if (command.endsWith('all') || command.endsWith('semua')) {
		let groups = Object.keys(conn.chats || {}).filter((id) => id.endsWith('g.us'));
		await m.reply(`⏳ _Sedang keluar dari ${groups.length} grup..._`);

		for (let id of groups) {
			await conn.reply(id, 'Sayonara 👋, Bot pamit keluar dari grup ini.').catch(() => {});
			await conn.groupLeave(id).catch(() => {});
			await delay(2000);
		}
		return m.reply(`✅ Berhasil keluar dari *${groups.length}* grup.`);
	}

	let target = args[0] || m.chat;
	if (!target.endsWith('g.us')) {
		return m.reply('Perintah ini harus dijalankan di dalam grup atau menyertakan JID grup (xxxx@g.us).');
	}

	await conn.reply(target, 'Sayonara 👋, Bot pamit keluar dari grup ini.').catch(() => {});
	await conn.groupLeave(target);
	if (target !== m.chat) m.reply(`✅ Berhasil keluar dari grup: ${target}`);
};

handler.help = ['leavegc', 'leavegcall'];
handler.tags = ['owner'];
handler.command = /^leaveg(c|ro?up)(all|semua)?$/i;
handler.owner = true;

export default handler;
