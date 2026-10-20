import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import fetch from 'node-fetch';
import { ffmpeg } from './converter.js';
import { spawn } from 'child_process';
import uploadFile from './uploadFile.js';
import fluent_ffmpeg from 'fluent-ffmpeg';
import { fileTypeFromBuffer as fromBuffer } from 'file-type';
import uploadImage from './uploadImage.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tmp = path.join(__dirname, '../tmp');

const support = {
  ffmpeg: true,
  ffprobe: true,
  ffmpegWebp: true,
  convert: true,
  magick: false,
  gm: false,
  find: false
};

/**
 * Image to Sticker
 * @param {Buffer} img Image Buffer
 * @param {String} url Image URL
 */
function sticker2(img, url) {
  return new Promise(async (resolve, reject) => {
    try {
      if (url) {
        let res = await fetch(url);
        if (res.status !== 200) throw await res.text();
        img = await res.buffer();
      }
      let inp = path.join(tmp, +new Date + '.jpeg');
      await fs.promises.writeFile(inp, img);
      let ff = spawn('ffmpeg', [
        '-y',
        '-i', inp,
        '-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1',
        '-f', 'png',
        '-'
      ]);
      ff.on('error', reject);
      ff.on('close', async () => {
        await fs.promises.unlink(inp);
      });
      let bufs = [];
      const [_spawnprocess, ..._spawnargs] = [...(support.gm ? ['gm'] : support.magick ? ['magick'] : []), 'convert', 'png:-', 'webp:-'];
      let im = spawn(_spawnprocess, _spawnargs);
      im.on('error', e => console.error(e));
      im.stdout.on('data', chunk => bufs.push(chunk));
      ff.stdout.pipe(im.stdin);
      im.on('exit', () => {
        resolve(Buffer.concat(bufs));
      });
    } catch (e) {
      reject(e);
    }
  });
}

async function canvas(code, type = 'png', quality = 0.92) {
  let res = await fetch('https://nurutomo.herokuapp.com/api/canvas?' + queryURL({
    type,
    quality
  }), {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'Content-Length': code.length
    },
    body: code
  });
  let image = await res.buffer();
  return image;
}

function queryURL(queries) {
  return new URLSearchParams(Object.entries(queries));
}

/**
 * Image to Sticker
 * @param {Buffer} img Image Buffer
 * @param {String} url Image URL
 */
async function sticker1(img, url) {
  url = url ? url : await uploadImage(img);
  let {
    mime
  } = url ? { mime: 'image/jpeg' } : await fromBuffer(img);
  let sc = `let im = await loadImg('data:${mime};base64,'+(await window.loadToDataURI('${url}')))
c.width = c.height = 512
let max = Math.max(im.width, im.height)
let w = 512 * im.width / max
let h = 512 * im.height / max
ctx.drawImage(im, 256 - w / 2, 256 - h / 2, w, h)
`;
  return await canvas(sc, 'webp');
}

/**
 * Image/Video to Sticker
 * @param {Buffer} img Image/Video Buffer
 * @param {String} url Image/Video URL
 * @param {String} packname EXIF Packname
 * @param {String} author EXIF Author
 */
async function sticker3(img, url, packname, author) {
  url = url ? url : await uploadFile(img);
  let res = await fetch('https://api.xteam.xyz/sticker/wm?' + new URLSearchParams(Object.entries({
    url,
    packname,
    author
  })));
  return await res.buffer();
}

/**
 * Image to Sticker
 * @param {Buffer} img Image/Video Buffer
 * @param {String} url Image/Video URL
 */
async function sticker4(img, url) {
  if (url) {
    let res = await fetch(url);
    if (res.status !== 200) throw await res.text();
    img = await res.buffer();
  }
  return await ffmpeg(img, [
    '-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1'
  ], 'jpeg', 'webp');
}

async function sticker5(img, url, packname, author, categories = ['']) {
  let WSF;
  try {
    WSF = (await import('wa-sticker-formatter')).default || await import('wa-sticker-formatter');
  } catch (e) {
    throw new Error('wa-sticker-formatter is not installed');
  }
  const stickerMetadata = {
    type: 'full',
    pack: packname,
    author,
    categories,
  };
  return await new WSF.Sticker(img ? img : url, stickerMetadata).build();
}

/**
 * Convert using fluent-ffmpeg
 * @param {string} img 
 * @param {string} url 
 */
async function sticker6(img, url) {
  return new Promise(async (resolve, reject) => {
    if (url) {
      let res = await fetch(url);
      if (res.status !== 200) throw await res.text();
      img = await res.buffer();
    }
    const type = await fromBuffer(img) || {
      mime: 'application/octet-stream',
      ext: 'bin'
    };
    if (type.ext == 'bin') reject(img);
    const tmpFile = path.join(__dirname, `../tmp/${+ new Date()}.${type.ext}`);
    const out = path.join(tmpFile + '.webp');
    await fs.promises.writeFile(tmpFile, img);
    // https://github.com/MhankBarBar/termux-wabot/blob/main/index.js#L313#L368
    let Fffmpeg = /video/i.test(type.mime) ? fluent_ffmpeg(tmpFile).inputFormat(type.ext) : fluent_ffmpeg(tmpFile).input(tmpFile);
    Fffmpeg
      .on('error', function (err) {
        console.error(err);
        fs.promises.unlink(tmpFile);
        reject(img);
      })
      .on('end', async function () {
        fs.promises.unlink(tmpFile);
        resolve(await fs.promises.readFile(out));
      })
      .addOutputOptions([
        `-vcodec`, `libwebp`, `-vf`,
        `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`
      ])
      .toFormat('webp')
      .save(out);
  });
}

/**
 * Add WhatsApp JSON Exif Metadata
 * Taken from https://github.com/pedroslopez/whatsapp-web.js/pull/527/files
 * @param {Buffer} webpSticker 
 * @param {String} packname 
 * @param {String} author 
 * @param {String} categories 
 * @param {Object} extra 
 * @returns 
 */
async function addExif(webpSticker, packname, author, categories = [''], extra = {}) {
  let webp;
  try {
    webp = (await import('node-webpmux')).default || await import('node-webpmux');
  } catch {
    webp = (await import('./webp.js')).default || await import('./webp.js');
  }
  const img = new webp.Image();
  const stickerPackId = crypto.randomBytes(32).toString('hex');
  const json = { 'sticker-pack-id': stickerPackId, 'sticker-pack-name': packname, 'sticker-pack-publisher': author, 'emojis': categories, ...extra };
  let exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
  let jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
  let exif = Buffer.concat([exifAttr, jsonBuffer]);
  exif.writeUIntLE(jsonBuffer.length, 14, 4);
  await img.load(webpSticker);
  img.exif = exif;
  return await img.save(null);
}

/**
 * Image/Video to Sticker
 * @param {Buffer} img Image/Video Buffer
 * @param {String} url Image/Video URL
 * @param {...String} 
*/
async function sticker(img, url, ...args) {
  let lastError;
  for (let func of [
    sticker6, support.ffmpeg && sticker5, sticker4,
    support.ffmpeg && support.ffmpegWebp && sticker3,
    support.ffmpeg && (support.convert || support.magick || support.gm) && sticker2,
    sticker1
  ].filter(Boolean)) {
    try {
      let stiker = await func(img, url, ...args);
      if (stiker && stiker.includes && stiker.includes('RIFF')) {
        try {
          return await addExif(stiker, ...args);
        } catch (e) {
          return stiker;
        }
      }
      throw stiker ? stiker.toString() : 'Failed to create sticker';
    } catch (err) {
      lastError = err;
    }
  }
  return lastError;
}

export {
  sticker,
  sticker1,
  sticker2,
  sticker3,
  sticker4,
  sticker5,
  sticker6,
  addExif,
  support
};

export default {
  sticker,
  sticker1,
  sticker2,
  sticker3,
  sticker4,
  sticker5,
  sticker6,
  addExif,
  support
};
