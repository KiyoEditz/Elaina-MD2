export default function (m, conn) {
	try {
		const defaultUser = {
			name: m.name,
			jid: m.sender,
			lid: m.senderLid || '',
			premium: false,
			premiumTime: 0,
			banned: false,
			limit: 20,
			exp: 0,
			level: 0,
			role: 'Beginner',
			skata: 0,
			suit: 0,
			pasangan: '',
			registered: false,
			age: -1,
			regTime: -1,
			unreg: 0,
			lastclaim: 0,
		};

		const defaultChat = {
			isBanned: false,
			antispam: false,
			spamWarnings: {},
			game: true,
		};

		const defaultSettings = {
			public: true,
			autoread: false,
			anticall: false,
			gconly: true,
		};

		// === USER ===
		// Pastikan sender bukan grup (@g.us), broadcast, atau newsletter
		if (m.sender && typeof m.sender === 'string' && !m.sender.endsWith('@g.us') && !m.sender.endsWith('@broadcast') && !m.sender.endsWith('@newsletter')) {
			const realJid = (conn?.getJid ? conn.getJid(m.sender) : m.sender) || m.sender;
			const lid = m.senderLid || (conn?.getLid ? conn.getLid(realJid) : '') || '';

			if (!global.db.data.users[realJid]) {
				global.db.data.users[realJid] = {
					...defaultUser,
					jid: realJid,
					lid: lid,
				};
			} else {
				const existing = global.db.data.users[realJid];
				if (!existing.lid && lid) {
					existing.lid = lid;
				}
				if (!existing.jid) {
					existing.jid = realJid;
				}
				Object.assign(defaultUser, existing);
				global.db.data.users[realJid] = defaultUser;
			}
		}

		// === GROUP ===
		if (m.isGroup) {
			if (!global.db.data.chats[m.chat])
				global.db.data.chats[m.chat] = {
					...defaultChat,
				};
			else (Object.assign(defaultChat, global.db.data.chats[m.chat]), (global.db.data.chats[m.chat] = defaultChat));
		}

		// === SETTINGS ===
		if (!global.db.data.settings[conn.user.jid])
			global.db.data.settings[conn.user.jid] = {
				...defaultSettings,
			};
		else (Object.assign(defaultSettings, global.db.data.settings[conn.user.jid]), (global.db.data.settings[conn.user.jid] = defaultSettings));
	} catch (e) {
		console.error(e);
	}
}