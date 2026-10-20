let handler = (m) => m;

handler.before = function (m) {
	if (!m.sender) return true;
	let senderJid = this.getJid ? this.getJid(m.sender) : m.sender;
	let user = global.db.data?.users?.[senderJid] || global.db.data?.users?.[m.sender];

	if (user && user.afk > -1) {
		let duration = this.msToDate ? this.msToDate(new Date() - user.afk) : formatDuration(new Date() - user.afk);
		m.reply(`Kamu berhenti AFK${user.afkReason ? ' setelah ' + user.afkReason : ''}\nSelama ${duration}`.trim());
		user.afk = -1;
		user.afkReason = '';
	}

	let jids = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])].filter(Boolean);
	for (let jid of jids) {
		let realJid = this.getJid ? this.getJid(jid) : jid;
		let targetUser = global.db.data?.users?.[realJid] || global.db.data?.users?.[jid];
		if (!targetUser) continue;
		let afkTime = targetUser.afk;
		if (!afkTime || afkTime < 0) continue;
		let reason = targetUser.afkReason || 'AFK';
		let duration = this.msToDate ? this.msToDate(new Date() - afkTime) : formatDuration(new Date() - afkTime);
		let targetNumber = realJid.split('@')[0];
		let teks = `_@${targetNumber} sedang OFF/AFK_\n\nAlasan: ${reason}\nSudah OFF selama: ${duration}`.trim();
		this.reply(m.chat, teks, m, { mentions: [realJid, jid] });
	}
	return true;
};

export default handler;

function formatDuration(ms) {
	let h = Math.floor(ms / 3600000);
	let m = Math.floor((ms % 3600000) / 60000);
	let s = Math.floor((ms % 60000) / 1000);
	return `${h ? h + ' jam ' : ''}${m ? m + ' menit ' : ''}${s} detik`;
}
