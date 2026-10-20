let handler = (m) => m;

handler.before = function (m) {
	if (!m.sender) return true;
	let realJid = this.getJid ? this.getJid(m.sender) : m.sender;
	let user = global.db.data?.users?.[realJid] || global.db.data?.users?.[m.sender];

	if (!user || !user.banned) return true;

	if (user.bannedtime && user.bannedtime < Date.now()) {
		user.banned = false;
		delete user.bannedtime;
	}
	return true;
};

export default handler;
