let handler = (m) => m;

handler.before = async function (m) {
	if (!m.isGroup) return;
	let chat = global.db.data.chats[m.chat];
	if (!chat) return;

	// 1. Cek apakah masa berlaku grup telah habis
	if (chat.gcdate !== 0 && !chat.permanent) {
		if (chat.gcdate <= Date.now()) {
			chat.gcdate = 0;
			chat.init = false;
			chat.lastUse = Date.now();
			chat.trialnotif = false;
			await this.reply(
				m.chat,
				'Masa aktif bot habis\nBot tidak akan merespon\n\nSilahkan aktivasi lagi setelah 2 hari',
				m
			);
			let ownerNumber = (global.owner && global.owner[0] ? global.owner[0][0] : global.numberowner) || '';
			let ownerName = (global.owner && global.owner[0] ? global.owner[0][1] : global.nameowner) || 'Owner Bot';
			if (ownerNumber) {
				try {
					await this.sendContact(m.chat, [ownerNumber, ownerName], m);
				} catch (e) {
					console.error('[Expired sendContact Error]', e);
				}
			}
		}
	}

	// 2. Cek reset cooldown trial setelah 24 jam (86400000 ms)
	if (chat.lastUse > 0 && Date.now() - chat.lastUse > 86400000) {
		if (!chat.trialnotif) {
			await this.reply(m.chat, 'Bot sudah dapat diaktivasi lagi, silahkan masukkan kode redeem', m);
		}
		chat.trial = 0;
		chat.lastUse = -1;
		chat.trialnotif = true;
	}
};

export default handler;
