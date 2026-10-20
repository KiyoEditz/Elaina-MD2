let handler = async (m, { conn }) => {
	try {
		let users = await conn.groupRequestParticipantsList(m.chat);
		if (!users || !users.length) return m.reply('Tidak ada permintaan bergabung ke grup!');

		let approved = 0;
		for (let user of users) {
			let jid = user.jid || user;
			await conn.groupRequestParticipantsUpdate(m.chat, [jid], 'approve').catch(() => {});
			approved++;
		}
		m.reply(`✅ Berhasil menyetujui *${approved}* permintaan bergabung ke grup!`);
	} catch (e) {
		console.error(e);
		m.reply('Gagal mengambil daftar permintaan bergabung grup. Pastikan bot adalah Admin grup.');
	}
};

handler.help = ['accbang'];
handler.tags = ['owner', 'group'];
handler.command = /^(accbang|accsemua)$/i;
handler.owner = true;
handler.botAdmin = true;
handler.group = true;

export default handler;
