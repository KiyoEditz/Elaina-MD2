import moment from 'moment-timezone'
import fs from 'fs'
export async function all(m) {
    let setting = global.db.data.settings[this.user.jid]
    if (setting.backup) {
        if (new Date() * 1 - setting.backupDB > 7200000) {
            let d = new Date
            let date = d.toLocaleDateString('id', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
            let fdoc = {key: {remoteJid: 'status@broadcast',participant: '0@s.whatsapp.net'},message: {documentMessage: {title: '𝙳 𝙰 𝚃 𝙰 𝙱 𝙰 𝚂 𝙴'}}}
            let data = fs.readFileSync('./database.json')
            this.reply(info.nomorown + '@s.whatsapp.net', `*🗓️ Database:* ${date}`, null)
            this.sendMessage(info.nomorown + '@s.whatsapp.net', {document: data, mimetype: 'application/json', fileName: 'database.json'}, {quoted: fdoc})
            setting.backupDB = new Date() * 1
        }
    }
    return !0
}