let handler = async (m, { conn }) => {
	let messages = [
		'Itsudemo i love you',
		'Kimi ni take kiss me',
		'Wasurerarenai kara',
		'Boku no daijina memorii',
		'Dorayaki wa',
		'Shushoku ni narenai',
		'Naraba uwagaki shichaeba',
		'Boku no omoidoori',
	];

	let { key } = await conn.sendMessage(m.chat, { text: messages[0] });
	let timeIntervals = [0, 1200, 2100, 3000, 4200, 4800, 5700, 6600];

	for (let i = 1; i < messages.length; i++) {
		await new Promise((resolve) => setTimeout(resolve, timeIntervals[i]));
		await conn.sendMessage(m.chat, { text: messages[i], edit: key });
	}
};

handler.help = ['ochama-kinou'];
handler.tags = ['main'];
handler.command = /^(ochama(-kinou)?)$/i;

export default handler;
