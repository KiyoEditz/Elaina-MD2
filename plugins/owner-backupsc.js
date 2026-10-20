import fs from 'fs';
import cp from 'child_process';
import { promisify } from 'util';

const exec = promisify(cp.exec).bind(cp);

let handler = async (m, { conn }) => {
	let zipFileName = `BackupScript_${Date.now()}.zip`;
	await m.reply('⏳ _Sedang membuat arsip backup script (tanpa node_modules)..._');

	try {
		// Gunakan tar bawaan Windows 10/11 atau zip di Linux
		let cmd = process.platform === 'win32'
			? `tar -a -c -f "${zipFileName}" --exclude="node_modules" --exclude=".git" *`
			: `zip -r "${zipFileName}" * -x "node_modules/*" ".git/*"`;

		await exec(cmd);

		if (!fs.existsSync(zipFileName)) {
			throw new Error('File backup gagal dibuat.');
		}

		let file = fs.readFileSync(zipFileName);
		await conn.sendMessage(
			m.chat,
			{
				document: file,
				mimetype: 'application/zip',
				fileName: 'BackupScript.zip',
				caption: '✅ *Backup selesai!* Silakan unduh file backup script Anda.',
			},
			{ quoted: m }
		);

		fs.unlinkSync(zipFileName);
	} catch (error) {
		console.error(error);
		m.reply(`❌ Terjadi kesalahan saat melakukan backup:\n${error.message}`);
		if (fs.existsSync(zipFileName)) fs.unlinkSync(zipFileName);
	}
};

handler.help = ['backupsc'];
handler.tags = ['owner'];
handler.command = ['backupsc'];
handler.owner = true;

export default handler;
