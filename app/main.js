const process = require("process");
const decode = require("./parser");
function main() {
  const command = process.argv[2];
  function printTorrentInfo(torrentInfo) {
    const trackerUrl = torrentInfo.announce;
    const fileLength = torrentInfo.info.length;
    console.log(`Tracker URL: ${trackerUrl}`);
    console.log(`Length: ${fileLength}`);
  }

  // You can use print statements as follows for debugging, they'll be visible when running tests.
  // console.log("Logs from your program will appear here!");

  // Uncomment this block to pass the first stage

  if (command === "decode") {
    const bencodedValue = process.argv[3];
    const result = decode(bencodedValue);
    if (result) {
      console.log(JSON.stringify(result.value));
    }
  }
  else if (command === "info") {
    const torrentFile = process.argv[3];
    const fs = require('fs');
    const bencodedData = fs.readFileSync(torrentFile, { encoding: 'binary' });
    const { value: torrentInfo } = decode(bencodedData, 0);
    printTorrentInfo(torrentInfo);
  }
  else {
    throw new Error(`Unknown command ${command}`);
  }
}

main();