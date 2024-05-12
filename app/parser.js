module.exports = function decode(val) {
    if (isInteger(val)) {
        return decodeInteger(val);
    }
    if (isString(val)) {
        return decodeString(val);
    }
    if (isList(val)) {
        return decodeList(val)[0];
    }
    throw new Error("Invalid encoded value: " + val);
}

function isInteger(val) {
    return val[0] === "i" && val.at(-1) === "e";
}

function decodeInteger(val) {
    return parseInt(val.slice(1, val.length - 1));
}
function isString(val) {
    return !isNaN(val[0]);
}
function decodeString(val) {
    const colonIdx = val.indexOf(":");
    if (colonIdx === -1) {
        throw new Error("Invalid encoded value: string");
    }
    const strLength = Number(val.slice(0, colonIdx));
    return val.slice(colonIdx + 1, strLength + colonIdx + 1);
}

function isList(val) {
    return val[0] === "l" && val.at(-1) === "e";
}

function decodeList(val) {
    const result = [];
    let window = val.substr(1);

    while (window.length > 0 && window[0] !== "e") {
        if (isInteger(window)) {
            const integer = decodeInteger(window);
            result.push(integer);
            window = window.slice(String(integer).length + 2);
        } else if (isString(window)) {
            const string = decodeString(window);
            result.push(string);
            window = window.slice(String(string.length).length + 1 + string.length);
        } else if (isList(window)) {
            const [list, remaining] = decodeList(window);
            result.push(list);
            window = remaining;
        }
    }
    while (window[0] === "e" && window.length > 0) {
        window = window.substr(1);
    }
    return [result, window];
}

