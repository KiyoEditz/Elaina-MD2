import { performance } from 'perf_hooks';
import { exec } from 'child_process';

let handler = async (m, { conn }) => {
	await conn.sendMessage(m.chat, {
		react: {
			text: '🕒',
			key: m.key,
		},
	});

	let timestamp = performance.now();
	exec('neofetch --stdout', (error, stdout) => {
		let latensi = performance.now() - timestamp;
		let child = stdout ? stdout.toString('utf-8') : `OS: Windows / Linux\nUptime: ${Math.floor(process.uptime())}s`;
		let ssd = child.replace(/Memory:/, 'Ram:');
		conn.reply(m.chat, `${ssd}\n_⚡ Kecepatan : ${latensi.toFixed(2)} ms_`, m);
	});
};

handler.help = ['quickping'];
handler.tags = ['info', 'main'];
handler.command = /^(quickping|fastping)$/i;

export default handler;
