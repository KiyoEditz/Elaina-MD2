import https from 'https';

async function remini(buffer, method = 'enhance') {
  return new Promise((resolve, reject) => {
    let Methods = ['enhance', 'recolor', 'dehaze'];
    if (!Methods.includes(method)) method = Methods[0];

    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const host = 'inferenceengine.vyro.ai';
    const path = '/' + method;

    const bodyParts = [
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="model_version"\r\n\r\n1\r\n`),
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="enhance_image_body.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`),
      Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer),
      Buffer.from(`\r\n--${boundary}--\r\n`)
    ];

    const body = Buffer.concat(bodyParts);

    const options = {
      hostname: host,
      path: path,
      method: 'POST',
      rejectUnauthorized: false,
      headers: {
        'User-Agent': 'okhttp/4.9.3',
        'Connection': 'Keep-Alive',
        'Accept-Encoding': 'gzip',
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length
      }
    };

    const req = https.request(options, (res) => {
      let chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
    });

    req.on('error', (e) => reject(e));
    req.write(body);
    req.end();
  });
}

export { remini };
export default { remini };
