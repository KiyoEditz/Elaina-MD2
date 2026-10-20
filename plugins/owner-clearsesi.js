import { readdirSync, statSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';

let handler = async (m, { conn }) => {
	const sessionDir = './sessions';
	if (!existsSync(sessionDir)) return m.reply('Folder sessions tidak ditemukan.');

	let deletedFiles = [];
	let files = readdirSync(sessionDir);

	for (let file of files) {
		// Proteksi file kredensial penting agar sesi tidak logout!
		if (
			file === 'creds.json' ||
			file.endsWith('.sqlite') ||
			file.endsWith('.sqlite-wal') ||
			file.endsWith('.sqlite-shm') ||
			file.endsWith('.db') ||
			file.startsWith('app-state-sync')
		) {
			continue;
		}

		let filePath = join(sessionDir, file);
		try {
			if (statSync(filePath).isFile()) {
				unlinkSync(filePath);
				deletedFiles.push(file);
			}
		} catch (e) {
			console.error(`Gagal menghapus ${file}:`, e);
		}
	}

	if (deletedFiles.length > 0) {
		m.reply(`✅ *Pembersihan Selesai!*\nBerhasil menghapus *${deletedFiles.length}* file sampah/sampel sementara di folder session.`);
	} else {
		m.reply('✨ Folder session bersih, tidak ada file sampah sementara.');
	}
};

handler.help = ['clearsession'];
handler.tags = ['owner'];
handler.command = /^(clearsession|clearsessions|clearsesi)$/i;
handler.rowner = true;

export default handler;
