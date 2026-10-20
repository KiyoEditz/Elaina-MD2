import fs from 'fs';
import axios from 'axios';
import * as cheerio from 'cheerio';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';

/**
 * Upload image to Telegra.ph
 * Supported: jpg, jpeg, png, gif, mp4
 * @param {Buffer} buffer
 * @returns {Promise<string>}
 */
async function TelegraPh(buffer) {
  return new Promise(async (resolve, reject) => {
    try {
      const form = new FormData();
      const input = Buffer.from(buffer);
      const type = await fileTypeFromBuffer(input);
      const ext = type?.ext || 'jpg';
      form.append('file', input, { filename: 'data.' + ext });
      const { data } = await axios.post('https://telegra.ph/upload', form, {
        headers: {
          ...form.getHeaders()
        }
      });
      if (data && data[0] && data[0].src) {
        resolve('https://telegra.ph' + data[0].src);
      } else {
        reject(new Error(data?.error || 'Failed to upload to Telegraph'));
      }
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Upload to Uguu.se
 * @param {Buffer} buffer
 * @returns {Promise<object>} { name, url, size, hash }
 */
async function UguuSe(buffer) {
  return new Promise(async (resolve, reject) => {
    try {
      const form = new FormData();
      const input = Buffer.from(buffer);
      const type = await fileTypeFromBuffer(input);
      const ext = type?.ext || 'bin';
      form.append('files[]', input, { filename: 'data.' + ext });
      const { data } = await axios.post('https://uguu.se/upload.php', form, {
        headers: {
          ...form.getHeaders()
        }
      });
      if (data && data.files && data.files[0]) {
        resolve(data.files[0]);
      } else {
        reject(new Error('Failed to upload to Uguu'));
      }
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Convert WebP sticker/image to MP4 via Ezgif
 * @param {string} path File path
 * @returns {Promise<{ status: boolean, message: string, result: string }>}
 */
async function webp2mp4File(path) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append('new-image-url', '');
    form.append('new-image', fs.createReadStream(path));
    axios({
      method: 'post',
      url: 'https://s6.ezgif.com/webp-to-mp4',
      data: form,
      headers: {
        'Content-Type': `multipart/form-data; boundary=${form._boundary}`
      }
    }).then(({ data }) => {
      const FormDataThen = new FormData();
      const $ = cheerio.load(data);
      const file = $('input[name="file"]').attr('value');
      if (!file) return reject(new Error('Failed to convert webp on ezgif step 1'));
      FormDataThen.append('file', file);
      FormDataThen.append('convert', 'Convert WebP to MP4!');
      axios({
        method: 'post',
        url: 'https://ezgif.com/webp-to-mp4/' + file,
        data: FormDataThen,
        headers: {
          'Content-Type': `multipart/form-data; boundary=${FormDataThen._boundary}`
        }
      }).then(({ data }) => {
        const $ = cheerio.load(data);
        const src = $('div#output > p.outfile > video > source').attr('src');
        if (!src) return reject(new Error('Failed to parse mp4 url from ezgif'));
        const result = 'https:' + src;
        resolve({
          status: true,
          message: 'Created By MRHRTZ',
          result: result
        });
      }).catch(reject);
    }).catch(reject);
  });
}

/**
 * Default uploadImage helper function
 * Tries Uguu -> Telegraph and returns the URL string
 * @param {Buffer} buffer
 * @returns {Promise<string>}
 */
async function uploadImage(buffer) {
  try {
    const res = await UguuSe(buffer);
    return res?.url || res;
  } catch (err) {
    return await TelegraPh(buffer);
  }
}

uploadImage.TelegraPh = TelegraPh;
uploadImage.UguuSe = UguuSe;
uploadImage.webp2mp4File = webp2mp4File;

export { TelegraPh, UguuSe, webp2mp4File };
export default uploadImage;
