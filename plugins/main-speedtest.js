import cp from 'child_process';
import { promisify } from 'util';

const exec = promisify(cp.exec).bind(cp);

let handler = async (m, { conn }) => {
	await conn.reply(m.chat, '⏳ _Sedang menjalankan pengujian kecepatan (Speedtest), mohon tunggu..._', m);
	let result = null;

	for (const cmd of ['speedtest-cli --simple', 'python speed.py --simple', 'python3 speed.py --simple', 'speedtest --simple']) {
		try {
			let res = await exec(cmd, { timeout: 45000 });
			if (res.stdout?.trim()) {
				result = res.stdout.trim();
				break;
			}
		} catch {}
	}

	if (result) {
		await conn.reply(m.chat, `*〔 SPEEDTEST HASIL 〕*\n\n${result}`, m);
	} else {
		await m.reply('❌ Gagal menjalankan speedtest atau modul speedtest belum terpasang di sistem.');
	}
};

handler.help = ['speedtest'];
handler.tags = ['info', 'main'];
handler.command = /^(speedtest|ookla)$/i;

export default handler;
