import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

let handler = async (m, { conn, text }) => {
	await m.reply('⏳ _Sedang memeriksa pembaruan dari repository (git pull)..._');

	try {
		let { stdout, stderr } = await execPromise(`git pull ${text || ''}`);
		let output = (stdout || stderr || 'Sudah berada di versi terbaru.').trim();
		m.reply(`*〔 HASIL UPDATE 〕*\n\n\`\`\`${output}\`\`\``);
	} catch (e) {
		console.error(e);
		m.reply(`❌ Gagal melakukan update:\n${e.message}`);
	}
};

handler.help = ['update'];
handler.tags = ['owner'];
handler.command = /^update$/i;
handler.rowner = true;

export default handler;
