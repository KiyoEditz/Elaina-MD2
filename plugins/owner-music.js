import { prepareWAMessageMedia, generateMessageID } from 'baileys'

let handler = async (m, { text, conn }) => {
  if (!m.quoted) return m.reply('Reply video')
  if (m.quoted.mtype !== 'videoMessage') return m.reply('lu kira itu video?')

  const parts = (text || '').split('|').map(s => s.trim())
  const judul = parts[0] || 'Unknown Title'
  const isExplicit = parts[1]?.toLowerCase() === 'true'

  const q = m.quoted
  const videoBuffer = await q.download()

  const prepared = await prepareWAMessageMedia(
    { video: videoBuffer, mimetype: q.mimetype ?? 'video/mp4' },
    { upload: conn.waUploadToServer }
  )

  const annotations = [
    {
      polygonVertices: [
        { x: 0.17499999701976776, y: 0.3400937616825104 },
        { x: 0.824999988079071,   y: 0.3400937616825104 },
        { x: 0.824999988079071,   y: 0.6598984003067017 },
        { x: 0.17499999701976776, y: 0.6598984003067017 }
      ],
      shouldSkipConfirmation: true,
      embeddedContent: {
        embeddedMusic: {
          musicContentMediaId: '2044582339773171',
          songId: '293258823010044',
          author: 'Hann Universe!!',
          title: judul,
          artworkDirectPath: '/v/t61.89441-24/595504707_1596181121495869_4705842668023729691_n.enc?ccb=11-4&oh=01_Q5Aa3wEWanI7v6nSIl3mx1lTG4M22kMZ9vhZM71fqaP4Qb5frg&oe=69C44624&_nc_sid=5e03e0',
          artworkSha256: Buffer.from([6,159,57,102,2,210,31,48,147,223,215,79,253,140,154,228,189,58,113,114,102,94,63,95,139,64,139,128,45,76,19,141]),
          artworkEncSha256: Buffer.from([6,159,57,102,2,210,31,48,147,223,215,79,253,140,154,228,189,58,113,114,102,94,63,95,139,64,139,128,45,76,19,141]),
          artistAttribution: 'https://universe.my.id/',
          countryBlocklist: Buffer.alloc(0),
          isExplicit: isExplicit,
          artworkMediaKey: Buffer.alloc(0),
          musicSongStartTimeInMs: '27000',
          derivedContentStartTimeInMs: '0',
          overlapDurationInMs: '30000'
        }
      },
      embeddedAction: true
    }
  ]

  const patchedMessage = {
    videoMessage: {
      ...prepared.videoMessage,
      seconds: q.seconds,
      height: q.height,
      width: q.width,
      jpegThumbnail: q.jpegThumbnail ? Buffer.from(q.jpegThumbnail, 'base64') : undefined,
      streamingSidecar: q.streamingSidecar ? Buffer.from(q.streamingSidecar, 'base64') : undefined,
      contextInfo: {
        forwardingScore: 1,
        isForwarded: false,
        pairedMediaType: 'NOT_PAIRED_MEDIA',
        forwardOrigin: 'UNKNOWN'
      },
      annotations
    }
  }

  await conn.relayMessage(m.chat, patchedMessage, {
    messageId: generateMessageID()
  })
}

handler.help = ['musik <judul> | <explicit: true/false>']
handler.tags = ['owner']
handler.command = /^musik$/i
handler.owner = true

export default handler
