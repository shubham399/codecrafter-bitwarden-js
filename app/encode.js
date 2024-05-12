function encode(input) {
    if (Number.isFinite(input)) {
        return `i${input}e`;
    } else if (typeof input === "string") {
        const s = Buffer.from(input, "binary");
        return `${s.length}:` + s.toString("binary");
    } else if (Array.isArray(input)) {
        return `l${input.map((i) => encode(i)).join("")}e`;
    } else {
        const d = Object.entries(input)
            .sort(([k1], [k2]) => k1.localeCompare(k2))
            .map(([k, v]) => `${encode(k)}${encode(v)}`);
        return `d${d.join("")}e`;
    }
}

module.exports = encode;