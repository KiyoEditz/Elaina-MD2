const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let handler = async (m, { conn, command, args }) => {
	let chats = [];
	let allChats = Object.keys(conn.chats || {});

	if (/group|gc/i.test(args[0])) {
		chats = allChats.filter((id) => id.endsWith('g.us'));
	} else if (/chat|private/i.test(args[0])) {
		chats = allChats.filter((id) => id.endsWith('.net'));
	} else if (/all/i.test(args[0])) {
		chats = allChats;
	} else {
		chats = [m.chat];
	}

	let isDelete = /^delete/i.test(command);
	let isClear = /^clear/i.test(command);
	let isMute = /^mute/i.test(command);
	let isUnmute = /^unmute/i.test(command);

	await m.reply(`⏳ _Memproses ${chats.length} chat..._`);

	for (let id of chats) {
		try {
			if (isDelete || isClear) {
				await conn.chatModify({ clear: true }, id).catch(() => {});
			} else if (isUnmute) {
				await conn.chatModify({ mute: null }, id).catch(() => {});
			} else if (isMute) {
				await conn.chatModify({ mute: 8 * 60 * 60 * 1000 }, id).catch(() => {});
			}
			await delay(1000);
		} catch (error) {
			console.error(`Gagal memodifikasi chat ${id}:`, error);
		}
	}

	let action = isDelete ? 'dihapus' : isClear ? 'dibersihkan' : isMute ? 'dimute' : isUnmute ? 'dibuka mute' : 'diproses';
	m.reply(`✅ *${chats.length}* chat ${args[0] || ''} berhasil ${action}.`);
};

handler.help = ['clearchat [all/group/private]', 'deletechat', 'mutechat', 'unmutechat'];
handler.tags = ['owner'];
handler.command = /^(clear|delete|(un)?mute)chat$/i;
handler.owner = true;

export default handler;
