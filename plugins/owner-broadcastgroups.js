let handler = async (m, { conn, text }) => {
	let pesan = m.quoted?.text || text;
	if (!pesan) return m.reply('Masukkan teks atau reply pesan yang ingin dibroadcast ke grup!');

	let getGroups = await conn.groupFetchAllParticipating().catch(() => ({}));
	let groups = Object.values(getGroups);
	let groupIds = groups.map((v) => v.id);

	if (!groupIds.length) return m.reply('Bot belum bergabung ke grup manapun.');

	await m.reply(`⏳ _Mengirim broadcast ke ${groupIds.length} grup..._`);

	let success = 0;
	for (let id of groupIds) {
		await sleep(1000);
		await conn
			.reply(id, `*〔 BROADCAST GRUP 〕*\n\n${pesan}`.trim(), null)
			.then(() => success++)
			.catch(() => {});
	}

	m.reply(`✅ Sukses mengirim broadcast ke *${success}* grup.`);
};

handler.help = ['bcgcbot <teks>'];
handler.tags = ['owner'];
handler.command = /^((broadcastgc|bcgc)(bot)?)$/i;
handler.owner = true;

export default handler;

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
