let handler = async (m, { conn, command, text }) => {
	let type = command.replace(/^set(menu|help|\?)/i, '').toLowerCase();

	if (!conn.menu || typeof conn.menu !== 'object') conn.menu = {};

	if (!type) {
		if (text) {
			conn.menu = text;
			conn.reply(m.chat, '✅ Format menu berhasil diatur.', m);
		} else {
			conn.menu = {};
			conn.reply(m.chat, '🔄 Format menu direset ke bawaan.', m);
		}
	} else {
		if (text) {
			conn.menu[type] = text;
			conn.reply(m.chat, `✅ Bagian menu *${type}* berhasil diatur.`, m);
		} else {
			delete conn.menu[type];
			conn.reply(m.chat, `🔄 Bagian menu *${type}* direset ke bawaan.`, m);
		}
	}
};

handler.help = ['setmenu [before/header/body/footer/after] <teks>'];
handler.tags = ['owner'];
handler.command = /^set(menu|help|\?)(before|header|body|footer|after)?$/i;
handler.owner = true;

export default handler;
