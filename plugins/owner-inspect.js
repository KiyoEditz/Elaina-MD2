import { proto } from 'baileys'
import { writeFileSync, readFileSync, mkdirSync } from 'fs'

const handler = async (m, { conn }) => {
  const quoted = m.quoted || m
  const msg = quoted.fakeObj ?? quoted

  const storeMsg = conn.store?.messages?.[msg.chat]?.get(msg.id)
  const merged = { ...msg, ...storeMsg }
  const rawMsg = proto.WebMessageInfo.toObject(
    proto.WebMessageInfo.fromObject(merged),
    { defaults: false, enums: String, longs: String }
  )

  const msgType = Object.keys(rawMsg?.message || {})[0] || 'unknown'

  const mediaTypes = ['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage', 'stickerMessage']

  const fileContent = `const { downloadMediaMessage } = require("baileys")

const raw = ${JSON.stringify(rawMsg, null, 2)}

const type = Object.keys(raw.message)[0]
const mediaTypes = ['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage', 'stickerMessage']

if (type === 'conversation' || type === 'extendedTextMessage') {
  await conn.relayMessage(m.chat, raw.message, {
    messageId: raw.key.id
  })
} else if (mediaTypes.includes(type)) {
  const media = raw.message[type]
  const buffer = await downloadMediaMessage(
    { key: raw.key, message: raw.message },
    'buffer',
    {},
    { logger: console, reuploadRequest: conn.updateMediaMessage }
  )
  const sendType = {
    imageMessage: 'image',
    videoMessage: 'video',
    audioMessage: 'audio',
    documentMessage: 'document',
    stickerMessage: 'sticker'
  }[type]
  await conn.sendMessage(m.chat, {
    [sendType]: buffer,
    mimetype: media.mimetype,
    fileName: media.fileName,
    caption: media.caption
  }, { quoted: m })
} else {
  console.log('[inspect] fallback relayMessage, type:', type)
  console.log('[inspect] message:', JSON.stringify(raw.message, null, 2))
  const result = await conn.relayMessage(m.chat, raw.message, {
    messageId: raw.key.id,
    participant: raw.participant
  })
  console.log('[inspect] relayMessage result:', result)
}
`

  mkdirSync('./tmp', { recursive: true })

  const fileName = `${msgType}-${Math.random().toString(36).slice(2, 10)}.js`
  const filePath = `./tmp/${fileName}`

  writeFileSync(filePath, fileContent, 'utf-8')

  await conn.sendMessage(m.chat, {
    document: readFileSync(filePath),
    mimetype: 'application/javascript',
    fileName
  }, { quoted: m })
}

handler.help = ['inspect']
handler.tags = ['owner']
handler.command = ['inspect']

export default handler