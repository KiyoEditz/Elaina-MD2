let handler = async (m) => {
	let rtotalreg = Object.values(global.db.data.users).filter((user) => user.registered == true).length;
	let kon = `乂 *U S E R*
    
*Current Database ${totalreg} User*`;
	await m.reply(kon);
};
handler.help = ['totaluser'];
handler.tags = ['info'];
handler.command = /^(pengguna|(jumlah)?database|totaluser)$/i;

export default handler;
