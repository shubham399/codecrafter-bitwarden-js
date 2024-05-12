const decode = require("./decode");
const { info } = require("./torrent");

const binaryUrlEncode = (str) => {
    return str
      .split("")
      .map((char, index) => {
        if (index % 2 === 0) return `%${char}`;
        return char;
      })
      .join("");
  };

async function peers(path) {
    const i = info(path);
    const u = new URL(i.announce);
    u.searchParams.set("peer_id", "00112233445566778899");
    u.searchParams.set("port", "6881");
    u.searchParams.set("uploaded", "0");
    u.searchParams.set("downloaded", "0");
    u.searchParams.set("left", i.info.length);
    u.searchParams.set("compact", "1");
    const hash_q = binaryUrlEncode(i.infoHash);
    const url = u.toString() + `&info_hash=${hash_q}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("network error");
    }
    const a = await response.arrayBuffer();
    const s = Buffer.from(a).toString("binary");
    const body = decode(s)[0]
    const peers = Buffer.from(body.peers, "binary");
    const output = [];
    for (let i = 0; i < peers.length; i += 6) {
        const ip = `${peers[i]}.${peers[i + 1]}.${peers[i + 2]}.${peers[i + 3]
            }`;
        const port = peers[i + 4] * 256 + peers[i + 5];
        output.push(`${ip}:${port}`);
    }
    return output;
}

module.exports = peers;