import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const kbbi = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/kbbi.json'), 'utf8'));

export function kata() {
	return new Promise((resolve) => {
		function random(list) {
			return list[Math.floor(Math.random() * list.length)];
		}
		let huruf = random(['a', 'b', 'c', 'd', 'e', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'u', 'w']);
		let res = kbbi.filter((v) => v.startsWith(huruf));
		resolve({ status: true, kata: random(res) });
	});
}

export function cKata(input) {
	return new Promise((resolve) => {
		if (!kbbi.find((v) => v === input.toLowerCase())) return resolve({ creator: '@neoxrs – Wildan Izzudin', status: false });
		resolve({ creator: '@neoxrs – Wildan Izzudin', status: true });
	});
}

export default {
	kata,
	cKata,
};
