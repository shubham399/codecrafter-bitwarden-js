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

function handshakeCommand(fileName, peer) {
    const { infoHash } = info(fileName);
    doHandshake(peer, encodeHandshake(infoHash))
        .then((data) => {
            const { peerId } = decoedeHandShake(data);
            console.log(`Peer ID: ${peerId}`);
        });
}



const RESERVED_BYTES = Buffer.alloc(8);
const encodeHandshake = (infoHash) => {
    const peerId = "00112233445566778899";
    const protocolString = "BitTorrent protocol";
    const message = Buffer.concat([
        Buffer.from([protocolString.length]),
        Buffer.from(protocolString),
        RESERVED_BYTES,
        Buffer.from(infoHash, "hex"),
        Buffer.from(peerId),
    ]);
    return message;
};
const decoedeHandShake = (buffer) => {
    let offset = 0;
    const protocolLength = buffer[offset];
    offset += 1;
    const protocol = buffer.slice(offset, offset + protocolLength).toString();
    offset += protocolLength;
    const reserved = buffer.slice(offset, offset + RESERVED_BYTES.length);
    offset += 8;
    const infoHash = buffer.slice(offset, offset + 20).toString("hex");
    offset += 20;
    const peerId = buffer.slice(offset, offset + 20).toString("hex");
    return {
        protocol,
        reserved,
        infoHash,
        peerId,
    };
};


const doHandshake = (peer, handshake) => {
    const net = require("net");
    const { host, port } = peer
    const client = new net.Socket();
    return new Promise((resolve, reject) => {
        client.connect(port, host, () => {
            client.write(handshake);
        });
        client.on("data", (data) => {
            resolve(data);
            client.destroy();
        });
        client.on("error", (err) => {
            reject(err);
        });
    });
};


module.exports = { peers, handshakeCommand };



