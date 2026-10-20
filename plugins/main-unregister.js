let handler = async function (m, { conn, usedPrefix, command }) {
	let user = global.db.data.users[m.sender];
	let time = (user.unreg || 0) + 86400000;
	if (new Date() - (user.unreg || 0) < 86400000) {
		let clock = conn.clockString ? conn.clockString(time - new Date()) : `${Math.floor((time - new Date()) / 3600000)} jam`;
		throw `Kamu sudah daftar ulang hari ini\nHitung mundur: ${clock} lagi`;
	}
	user.registered = false;
	user.unreg = +new Date();
	m.reply(`${command} berhasil! silahkan Ketik *${usedPrefix}daftar*`);
};

handler.help = ['unregister', 'daftarulang'];
handler.tags = ['main'];
handler.command = /^(daftarulang|unreg(ister)?)$/i;
handler.register = true;

export default handler;
