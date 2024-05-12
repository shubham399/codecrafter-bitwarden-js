const fs = require('fs');
const crypto = require("crypto");
const encode = require('./encode');
const decode = require('./decode');


function calculateSHA1(inputString) {
    const sha1Hash = crypto.createHash("sha1");
    sha1Hash.update(inputString);
    return sha1Hash.digest("hex");
}


function printTorrentInfo(torrentFile) {
    const torrentInfo = info(torrentFile);
    const trackerUrl = torrentInfo.announce;
    const fileLength = torrentInfo.info.length;
    console.log(`Tracker URL: ${trackerUrl}`);
    console.log(`Length: ${fileLength}`);
    console.log(`Info Hash: ${torrentInfo.infoHash}`);
    console.log(`Piece Length: ${torrentInfo.info['piece length']}`)
    console.log('Piece Hashes:');
    console.log(torrentInfo.pieceHashes.join('\n'));
}

function info(torrentFile) {
    const bencodedData = fs.readFileSync(torrentFile);
    const data = decode(bencodedData.toString('binary'));
    const torrentInfo = data[0];
    const tmpBuff = Buffer.from(encode(torrentInfo.info), "binary");
    const hash = calculateSHA1(tmpBuff);
    torrentInfo.infoHash= hash;
    const pieceInfo = Buffer.from(torrentInfo.info.pieces, "binary");
    pieceHashes = [];
    for (let i = 0; i < pieceInfo.length; i += 20) {
        pieceHashes.push(pieceInfo.slice(i, i + 20).toString("hex"))
    }
    torrentInfo.pieceHashes = pieceHashes;
    return torrentInfo;
}

module.exports = {
    info: info,
    printTorrentInfo: printTorrentInfo
}