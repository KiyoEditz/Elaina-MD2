import { promises, existsSync } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';

async function ffmpeg(buffer, args = [], ext = '', ext2 = '') {
	const tmpDir = join(global.__dirname(import.meta.url), '../tmp');
	if (!existsSync(tmpDir)) {
		await promises.mkdir(tmpDir, { recursive: true });
	}

	const tmp = join(tmpDir, Date.now() + '.' + ext);
	const out = tmp + '.' + ext2;

	try {
		await promises.writeFile(tmp, buffer);

		await new Promise((resolve, reject) => {
			spawn('ffmpeg', ['-y', '-i', tmp, ...args, out])
				.on('error', reject)
				.on('close', (code) => {
					if (code !== 0) reject(new Error(`FFmpeg exited with code ${code}`));
					else resolve();
				});
		});

		const data = await promises.readFile(out);

		return {
			data,
			filename: out,
			delete() {
				return promises.unlink(out).catch(() => {});
			},
		};
	} finally {
		try {
			await promises.unlink(tmp);
		} catch {}
	}
}

/**
 * Convert Audio to Playable WhatsApp Audio
 * @param {Buffer} buffer Audio Buffer
 * @param {String} ext File Extension
 * @returns {Promise<{data: Buffer, filename: String, delete: Function}>}
 */
function toPTT(buffer, ext) {
	return ffmpeg(buffer, ['-vn', '-c:a', 'libopus', '-b:a', '128k', '-vbr', 'on'], ext, 'ogg');
}

/**
 * Convert Audio to Playable WhatsApp PTT
 * @param {Buffer} buffer Audio Buffer
 * @param {String} ext File Extension
 * @returns {Promise<{data: Buffer, filename: String, delete: Function}>}
 */
function toAudio(buffer, ext) {
	return ffmpeg(buffer, ['-vn', '-ar', '44100', '-ac', '2', '-b:a', '192k', '-f', 'mp3'], ext, 'opus');
}

/**
 * Convert Video/Animation to Playable WhatsApp MP4 Video
 * @param {Buffer} buffer Video Buffer
 * @param {String} ext File Extension
 * @returns {Promise<{data: Buffer, filename: String, delete: Function}>}
 */
function toVideo(buffer, ext) {
	return ffmpeg(
		buffer,
		[
			'-c:v', 'libx264',
			'-pix_fmt', 'yuv420p',
			'-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
			'-c:a', 'aac',
			'-b:a', '128k',
			'-ar', '44100',
			'-crf', '28',
			'-preset', 'veryfast',
			'-movflags', '+faststart'
		],
		ext,
		'mp4'
	);
}

export { toAudio, toPTT, toVideo, ffmpeg };
