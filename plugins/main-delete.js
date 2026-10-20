let handler = async (m, { conn }) => {
	if (!m.quoted) return m.reply('Reply pesan yang ingin dihapus!');
	let { fromMe, id, isBaileys } = m.quoted;

	try {
		if (m.quoted.vM?.key) {
			return await conn.sendMessage(m.chat, { delete: m.quoted.vM.key });
		}

		let participant = m.quoted.sender || m.quoted.participant;
		let key = {
			remoteJid: m.chat,
			fromMe: fromMe || false,
			id: id,
			participant: m.isGroup ? participant : undefined,
		};
		return await conn.sendMessage(m.chat, { delete: key });
	} catch (e) {
		console.error(e);
		return m.reply('Gagal menghapus pesan.');
	}
};

handler.help = ['delete'];
handler.tags = ['main'];
handler.command = /^del(ete)?$/i;

export default handler;
