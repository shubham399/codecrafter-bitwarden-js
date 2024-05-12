function decode(s) {
    // Check if the first character is a digit
    if (!isNaN(s[0])) {
        const firstColonIndex = s.indexOf(":");
        const n = parseInt(s.substr(0, firstColonIndex));
        if (firstColonIndex === -1) {
            throw new Error("Invalid encoded value");
        }
        const a = new Uint8Array(Buffer.from(s, "binary"));
        const outS = Buffer.from(
            a.slice(firstColonIndex + 1, firstColonIndex + 1 + n),
        ).toString("binary");
        const restS = Buffer.from(a.slice(firstColonIndex + 1 + n)).toString(
            "binary",
        );
        return [outS, restS];
    } else if (s[0] === "i") {
        let end_i = s.indexOf("e");
        return [parseInt(s.slice(1, end_i)), s.substr(end_i + 1)];
    } else if (s[0] === "l") {
        const out = [];
        let rest = s.slice(1);
        let v;
        while (rest && rest[0] !== "e") {
            [v, rest] = decode(rest);
            out.push(v);
        }
        return [out, rest.substr(1)];
    } else if (s[0] === "d") {
        const out = {};
        let rest = s.slice(1);
        let k, v;
        while (rest && rest[0] !== "e") {
            [k, rest] = decode(rest);
            [v, rest] = decode(rest);
            out[k] = v;
        }
        return [out, rest.substr(1)];
    } else {
        throw new Error("Only strings are supported at the moment");
    }
}
module.exports = decode;