import fetch from 'node-fetch';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';

/**
 * Upload ephemeral file to file.io
 * Expired in 1 day, 100MB Max Filesize
 * @param {Buffer} buffer File Buffer
 * @returns {Promise<string>}
 */
const fileIO = async buffer => {
  const type = await fileTypeFromBuffer(buffer);
  const ext = type ? type.ext : 'bin';
  const form = new FormData();
  form.append('file', buffer, 'tmp.' + ext);
  const res = await fetch('https://file.io/?expires=1d', {
    method: 'POST',
    body: form,
    headers: {
      ...form.getHeaders()
    }
  });
  const json = await res.json();
  if (!json.success) throw json;
  return json.link;
};

/**
 * Upload file to storage.restfulapi.my.id
 * @param {Buffer|ReadableStream|(Buffer|ReadableStream)[]} inp File Buffer/Stream or Array of them
 * @returns {Promise<string|null|(string|null)[]>}
 */
const RESTfulAPI = async inp => {
  const form = new FormData();
  let buffers = inp;
  if (!Array.isArray(inp)) buffers = [inp];
  for (let buffer of buffers) {
    form.append('file', buffer);
  }
  const res = await fetch('https://storage.restfulapi.my.id/upload', {
    method: 'POST',
    body: form,
    headers: {
      ...form.getHeaders()
    }
  });
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    if (!Array.isArray(inp)) return json.files[0].url;
    return json.files.map(res => res.url);
  } catch (e) {
    throw text;
  }
};

/**
 * Upload file to Uguu.se as fallback
 * @param {Buffer} buffer
 * @returns {Promise<string>}
 */
const Uguu = async buffer => {
  const type = await fileTypeFromBuffer(buffer);
  const ext = type ? type.ext : 'bin';
  const form = new FormData();
  form.append('files[]', Buffer.from(buffer), { filename: 'file.' + ext });
  const res = await fetch('https://uguu.se/upload.php', {
    method: 'POST',
    body: form,
    headers: {
      ...form.getHeaders()
    }
  });
  const json = await res.json();
  if (json?.files?.[0]?.url) return json.files[0].url;
  throw new Error('Upload to Uguu failed');
};

/**
 * Upload file with fallbacks
 * @param {Buffer|ReadableStream|(Buffer|ReadableStream)[]} inp
 * @returns {Promise<string|null|(string|null)[]>}
 */
async function uploadFile(inp) {
  let err = false;
  for (let upload of [Uguu, RESTfulAPI, fileIO]) {
    try {
      return await upload(inp);
    } catch (e) {
      err = e;
    }
  }
  if (err) throw err;
}

uploadFile.fileIO = fileIO;
uploadFile.RESTfulAPI = RESTfulAPI;
uploadFile.Uguu = Uguu;

export { fileIO, RESTfulAPI, Uguu };
export default uploadFile;
