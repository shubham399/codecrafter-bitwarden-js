const decode = require("./decode");
const { info } = require("./torrent");
function range(n) {
    return [...new Array(n).keys()];
}

const UNRESERVED = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "-",
    "_",
    ".",
    "~",
].reduce((accl, s) => ({ ...accl, [s.codePointAt(0)]: s }));
async function peers(path) {
    const i = info(path);
    const u = new URL(i.announce);
    u.searchParams.set("peer_id", "00112233445566778899");
    u.searchParams.set("port", "6881");
    u.searchParams.set("uploaded", "0");
    u.searchParams.set("downloaded", "0");
    u.searchParams.set("left", i.info.length);
    u.searchParams.set("compact", "1");
    const hash_q = Array.from(Buffer.from(i.infoHash, "hex"))
        .map((d) => UNRESERVED[d] || "%" + (d <= 0xf ? "0" : "") + d.toString(16))
        .join("");
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