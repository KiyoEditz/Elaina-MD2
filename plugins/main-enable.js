let handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
	let isEnable = /true|enable|(turn)?on|1/i.test(command);
	if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {};
	let chat = global.db.data.chats[m.chat];

	let userJid = conn.getJid ? conn.getJid(m.sender) : m.sender;
	if (!global.db.data.users[userJid]) global.db.data.users[userJid] = {};
	let user = global.db.data.users[userJid];

	if (!global.db.data.settings[conn.user.jid]) global.db.data.settings[conn.user.jid] = {};
	let setting = global.db.data.settings[conn.user.jid];

	let type = (args[0] || '').toLowerCase();
	let isAll = false;
	let isUser = false;

	switch (type) {
		case 'welcome':
			if (!m.isGroup) {
				if (!isOwner) return global.dfail('group', m, conn);
			} else if (!(isAdmin || isOwner)) {
				return global.dfail('admin', m, conn);
			}
			chat.welcome = isEnable;
			break;
		case 'detect':
			if (!m.isGroup) {
				if (!isOwner) return global.dfail('group', m, conn);
			} else if (!(isAdmin || isOwner)) {
				return global.dfail('admin', m, conn);
			}
			chat.detect = isEnable;
			break;
		case 'delete':
			if (m.isGroup) {
				if (!(isAdmin || isOwner)) return global.dfail('admin', m, conn);
			}
			chat.delete = isEnable;
			break;
		case 'antidelete':
			if (m.isGroup) {
				if (!(isAdmin || isOwner)) return global.dfail('admin', m, conn);
			}
			chat.delete = !isEnable;
			break;
		case 'autodelvn':
			if (m.isGroup) {
				if (!(isAdmin || isOwner)) return global.dfail('admin', m, conn);
			}
			chat.autodelvn = isEnable;
			break;
		case 'document':
			isUser = true;
			user.useDocument = isEnable;
			break;
		case 'stiker':
		case 'autostiker':
			if (m.isGroup) {
				if (!(isAdmin || isOwner)) return global.dfail('admin', m, conn);
			}
			chat.stiker = isEnable;
			break;
		case 'game':
			if (m.isGroup) {
				if (!(isAdmin || isOwner)) return global.dfail('admin', m, conn);
			}
			chat.game = isEnable;
			break;
		case 'public':
			isAll = true;
			if (!isROwner) return global.dfail('rowner', m, conn);
			setting.public = isEnable;
			break;
		case 'restrict':
			isAll = true;
			if (!isOwner) return global.dfail('owner', m, conn);
			setting.restrict = isEnable;
			break;
		case 'antilink':
			if (m.isGroup) {
				if (!(isAdmin || isOwner)) return global.dfail('admin', m, conn);
			}
			chat.antiLink = isEnable;
			break;
		case 'viewonce':
		case 'autoviewonce':
			if (m.isGroup) {
				if (!(isAdmin || isOwner)) return global.dfail('admin', m, conn);
			}
			chat.viewonce = isEnable;
			break;
		case 'autolevelup':
		case 'levelup':
			isUser = true;
			user.autolevelup = isEnable;
			break;
		case 'grouponly':
		case 'gconly':
			isAll = true;
			if (!isOwner) return global.dfail('owner', m, conn);
			setting.gconly = isEnable;
			break;
		case 'anticall':
			isAll = true;
			if (!isOwner) return global.dfail('owner', m, conn);
			setting.anticall = isEnable;
			break;
		case 'antitag':
			isAll = true;
			if (!isOwner) return global.dfail('owner', m, conn);
			setting.antitag = isEnable;
			break;
		case 'autoread':
		case 'read':
			isAll = true;
			if (!isOwner) return global.dfail('owner', m, conn);
			setting.autoread = isEnable;
			break;
		case 'autoreact':
		case 'react':
			isAll = true;
			if (!isOwner) return global.dfail('owner', m, conn);
			setting.autoreact = isEnable;
			break;
		default:
			if (!/[01]/.test(command)) {
				let teks = `
╔═〘 Daftar Opsi 〙
║ ${m.isGroup && isAdmin ? `
║ *Opsi Admin Group*
╟ welcome
╟ delete
╟ antidelete
╟ antilink
╟ detect
╟ viewonce
╟ autodelvn
╟ game
╟ stiker
║` : ''}
║ *Opsi User*
╟ autolevelup (otomatis levelup)
╟ document (dokumen unduhan)
║ ${isOwner ? `
║ *Opsi Owner*
╟ public
╟ restrict
╟ anticall
╟ antitag
╟ grouponly
╟ autoread
╟ autoreact` : ''}
╚════════════════
Contoh:
${usedPrefix}on welcome
${usedPrefix}off welcome
`.trim();
				return m.reply(teks);
			}
			return;
	}

	m.reply(
		`*${type}* berhasil di *${isEnable ? 'aktif' : 'nonaktif'}kan* ${
			isAll ? 'untuk bot ini' : isUser ? 'untuk akun kamu' : 'untuk chat ini'
		}.`.trim()
	);
};

handler.help = ['on', 'off', 'enable', 'disable', '1', '0'].map((v) => v + ' <opsi>');
handler.tags = ['main'];
handler.command = /^((en|dis)able|(tru|fals)e|(turn)?o(n|ff)|[01])$/i;

export default handler;
