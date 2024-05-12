const process = require("process");
const decode = require("./decode");
const { printTorrentInfo } = require("./torrent");
const {handshakeCommand,peers} = require("./peer");



async function main() {
  const command = process.argv[2];


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
    printTorrentInfo(torrentFile);

  }
  else if (command === "peers") {
    const torrentFile = process.argv[3];
    const torrentPeers = await peers(torrentFile);
    console.log(torrentPeers.join("\n"));
  }
  else if (command === "handshake") {
    const fileName = process.argv[3];
    const peer = {
      host: process.argv[4].split(":")[0],
      port: parseInt(process.argv[4].split(":")[1])
    };
    handshakeCommand(fileName, peer);
  }
  else {
    throw new Error(`Unknown command ${command}`);
  }
}

main();