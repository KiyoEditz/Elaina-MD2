# Elaina-MD2
<p align="center">
    <img src="https://telegra.ph/file/6bcac493fae59b98c7914.png" width="100%" style="margin-left: auto;margin-right: auto;display: block;">
</p>

<!--<a href="https://visitor-badge.glitch.me/badge?page_id=KiyoEditz/Elaina-MD2"><img title="Visitor" src="https://visitor-badge.glitch.me/badge?page_id=KiyoEditz/Elaina-MD2"></a>-->
<a href="https://github.com/KiyoEditz/Elaina-MD2/network/members"><img title="Forks" src="https://img.shields.io/github/forks/KiyoEditz/Elaina-MD2?label=Forks&color=blue&style=flat-square"></a>
<a href="https://github.com/KiyoEditz/Elaina-MD2/watchers"><img title="Watchers" src="https://img.shields.io/github/watchers/KiyoEditz/Elaina-MD2?label=Watchers&color=green&style=flat-square"></a>
<a href="https://github.com/KiyoEditz/Elaina-MD2/stargazers"><img title="Stars" src="https://img.shields.io/github/stars/KiyoEditz/Elaina-MD2?label=Stars&color=yellow&style=flat-square"></a>
<a href="https://github.com/KiyoEditz/Elaina-MD2/graphs/contributors"><img title="Contributors" src="https://img.shields.io/github/contributors/KiyoEditz/Elaina-MD2?label=Contributors&color=blue&style=flat-square"></a>
<a href="https://github.com/KiyoEditz/Elaina-MD2/issues"><img title="Issues" src="https://img.shields.io/github/issues/KiyoEditz/Elaina-MD2?label=Issues&color=success&style=flat-square"></a>
<a href="https://github.com/KiyoEditz/Elaina-MD2/issues?q=is%3Aissue+is%3Aclosed"><img title="Issues" src="https://img.shields.io/github/issues-closed/KiyoEditz/Elaina-MD2?label=Issues&color=red&style=flat-square"></a>
<a href="https://github.com/KiyoEditz/Elaina-MD2/pulls"><img title="Pull Request" src="https://img.shields.io/github/issues-pr/KiyoEditz/Elaina-MD2?label=PullRequest&color=success&style=flat-square"></a>
<a href="https://github.com/KiyoEditz/Elaina-MD2/pulls?q=is%3Apr+is%3Aclosed"><img title="Pull Request" src="https://img.shields.io/github/issues-pr-closed/KiyoEditz/Elaina-MD2?label=PullRequest&color=red&style=flat-square"></a>

## INFORMATION
* A Multi Device based WhatsApp bot with various features.
* Don't sell this source bot. 
* If you are caught selling source bots, you will be dealt with seriously and you will have to make compensation according to the mistake.
* Jika ketahuan menjual source bot maka akan di tindak secara serius dan harus melakukan ganti rugi sesuai dengan dengan kesalahan.
## NOTES
* Progress build code 1%, want to add file 1k 
* 
* 

## DEPLOYMENT

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/KiyoEditz/Elaina-MD2)

## UNTUK PENGGUNA WINDOWS/VPS/RDP

* Unduh & Instal Git [`Klik Disini`](https://git-scm.com/downloads)
* Unduh & Instal NodeJS [`Klik Disini`](https://nodejs.org/en/download)
* Unduh & Instal FFmpeg [`Klik Disini`](https://ffmpeg.org/download.html) (**Jangan Lupa Tambahkan FFmpeg ke variabel lingkungan PATH**)
* Unduh & Instal ImageMagick [`Klik Disini`](https://imagemagick.org/script/download.php)

```bash
git clone https://github.com/KiyoEditz/Elaina-MD2.git
cd Elaina-MD2 
npm install
node .
```

---------

## UNTUK PENGGUNA TERMUX

* Download Termux [`Klik Disini`](https://github.com/termux/termux-app/releases/download/v0.118.0/termux-app_v0.118.0+github-debug_universal.apk)

```
$ pkg update && upgrade -y
$ apt update && upgrade -y
$ pkg install ffmpeg
$ pkg install nodejs-lts
$ pkg install git
$ git clone https://github.com/KiyoEditz/Elaina-MD2.git
$ cd Elaina-MD2
$ npm install
$ node .
```
---------
## UNTUK PENGGUNA HEROKU

### Instal Buildpack
* heroku/nodejs
* https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git
* https://github.com/mcollina/heroku-buildpack-imagemagick.git

---------
## Arguments `node . [--options] [<session name>]` 

### `--session <nama file>`

menggunakan session dari nama file yang berbeda, default `session.data.json`

contoh nama file `Elaina.json` maka penggunaannya `node . --session 'Elaina'`

### `--prefix <prefix>`

* `prefixes` dipisahkan oleh masing-masing karakter
Setel awalan

### `--server`

Digunakan untuk [heroku](https://heroku.com/) atau pindai melalui situs web

### `--db <url mongodb kamu>`

Buka file package.json dan isikan url mongodb kamu di bagian `mongo: --db url mongodb`!

### `--db <json-server-url>`

menggunakan db eksternal alih-alih db lokal, **disarankan** menggunakan mongodb

contoh server dengan mongodb `mongodb+srv://<username>:<password>@name-of-your-db.thhce.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

contoh server dengan repl `https://json-server.nurutomo.repl.co/`

kode: `https://repl.it/@Nurutomo/json-server`

`node . --db 'https://json-server.nurutomo.repl.co/'`

server harus memiliki spesifikasi seperti ini

#### GET

```http
GET /
Accept: application/json
```

#### POST

```http
POST /
Content-Type: application/json

{
 data: {}
}
```

### `--big-qr`

Jika qr unicode kecil tidak mendukung

### `--pairing`

jika ingin menggunakan nomor telepon dan bukan QR

### `--img`

Aktifkan pemeriksa gambar melalui terminal

### `--test`

**Development** Testing Mode

### `--trace`

```js
conn.logger.level = 'trace'
```

### `--debug`

```js
conn.logger.level = 'debug'
```
#### Thanks To 
**Allah SWT**,

**Orang Tua**,

**All Team Bot Discussion**,

**Semua yang selalu mendukung**


##### Special Thanks to
[![Nurutomo](https://github.com/Nurutomo.png?size=100)](https://github.com/Nurutomo)
[![BochilGaming](https://github.com/BochilGaming.png?size=100)](https://github.com/BochilGaming)
[![syahrularranger](https://github.com/syahrularranger.png?size=100)](https://github.com/syahrularranger)

##### Penulis Ulang
[![KiyoEditz](https://github.com/KiyoEditz.png?size=100)](https://github.com/KiyoEditz)

###### Collaborator

[![KiyoEditz](https://github.com/KiyoEditz.png?size=100)](https://github.com/KiyoEditz)
[![syahrularranger](https://github.com/syahrularranger.png?size=100)](https://github.com/syahrularranger)

