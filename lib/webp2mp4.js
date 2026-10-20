import fetch from 'node-fetch';
import FormData from 'form-data';
import * as cheerio from 'cheerio';
import { toVideo } from './converter.js';

async function webp2mp4(source) {
  try {
    let form = new FormData();
    let isUrl = typeof source === 'string' && /https?:\/\//.test(source);
    form.append('new-image-url', isUrl ? source : '');
    form.append('new-image', isUrl ? '' : source, 'image.webp');
    let res = await fetch('https://s6.ezgif.com/webp-to-mp4', {
      method: 'POST',
      body: form
    });
    let html = await res.text();
    let $ = cheerio.load(html);
    let form2 = new FormData();
    let fileVal = $('input[name="file"]').val();
    if (!fileVal) throw new Error('ezgif token not found');
    form2.append('file', fileVal);
    let res2 = await fetch('https://ezgif.com/webp-to-mp4/' + fileVal, {
      method: 'POST',
      body: form2
    });
    let html2 = await res2.text();
    let $$ = cheerio.load(html2);
    let videoSrc = $$('div#output > p.outfile > video > source').attr('src');
    if (videoSrc) {
      return new URL(videoSrc, res2.url).toString();
    }
    throw new Error('Video source not found in ezgif output');
  } catch (err) {
    // Fallback local ffmpeg jika input berupa buffer
    if (Buffer.isBuffer(source)) {
      const conv = await toVideo(source, 'webp');
      return conv.data;
    }
    throw err;
  }
}

async function webp2png(source) {
  let form = new FormData();
  let isUrl = typeof source === 'string' && /https?:\/\//.test(source);
  form.append('new-image-url', isUrl ? source : '');
  form.append('new-image', isUrl ? '' : source, 'image.webp');
  let res = await fetch('https://s6.ezgif.com/webp-to-png', {
    method: 'POST',
    body: form
  });
  let html = await res.text();
  let $ = cheerio.load(html);
  let fileVal = $('input[name="file"]').val();
  if (!fileVal) throw new Error('ezgif token not found');
  let form2 = new FormData();
  form2.append('file', fileVal);
  let res2 = await fetch('https://ezgif.com/webp-to-png/' + fileVal, {
    method: 'POST',
    body: form2
  });
  let html2 = await res2.text();
  let $$ = cheerio.load(html2);
  let imgSrc = $$('div#output > p.outfile > img').attr('src');
  if (!imgSrc) throw new Error('Image source not found in ezgif output');
  return new URL(imgSrc, res2.url).toString();
}

export { webp2mp4, webp2png };
export default { webp2mp4, webp2png };
