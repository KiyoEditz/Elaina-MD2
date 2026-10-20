let handler = async (m, { text, usedPrefix }) => {
	if (!text) {
		return m.reply(`Masukkan ID playlist Spotify!\nContoh:\n*${usedPrefix}setplaylist 37i9dQZF1DWTwnEm1IYyoj*`);
	}

	let id = text.trim();
	global.playlist = id;

	if (!global.db.data.extra) global.db.data.extra = {};
	global.db.data.extra.playlistId = id;

	m.reply(`✅ Berhasil mengubah playlist Spotify menjadi: *${id}*`);
};

handler.help = ['setplaylist <id>'];
handler.tags = ['owner'];
handler.command = /^setplaylist$/i;
handler.owner = true;

export default handler;
