const process = require("process");
const crypto = require("crypto");
const decode = require("./decode");
const encode = require("./encode");
function main() {
  const command = process.argv[2];
  function printTorrentInfo(torrentInfo) {
    const trackerUrl = torrentInfo.announce;
    const fileLength = torrentInfo.info.length;
    const infoEncoded = encode(torrentInfo.info).toString('utf-8');
    // console.log(torrentInfo.info);
    // console.log(infoEncoded);

    const infoHash = crypto.createHash('sha1').update(infoEncoded).digest('hex');;
    console.log(`Tracker URL: ${trackerUrl}`);
    console.log(`Length: ${fileLength}`);
    console.log(`Info encoded: ${infoHash}`);
  }

  // You can use print statements as follows for debugging, they'll be visible when running tests.
  // console.log("Logs from your program will appear here!");

  // Uncomment this block to pass the first stage

  if (command === "decode") {
    const bencodedValue = process.argv[3];
    const result = decode(bencodedValue);
    if (result) {
      console.log(JSON.stringify(result[0]));
    }
  }
  else if (command === "info") {
    const torrentFile = process.argv[3];
    const fs = require('fs');
    const bencodedData = fs.readFileSync(torrentFile);
    const data = decode(bencodedData.toString('binary'));
    printTorrentInfo(data[0]);
  }
  else {
    throw new Error(`Unknown command ${command}`);
  }
}

main();