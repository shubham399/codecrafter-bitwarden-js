module.exports = decode;

function decode(val) {
    if (isInteger(val)) {
        return decodeInteger(val);
    }
    if (isString(val)) {
        return decodeString(val);
    }
    if (isList(val)) {
        return decodeList(val);
    }
    if (isDictionary(val)) {
        return decodeDict(val);
    }
    throw new Error("Invalid encoded value: " + val);
}

function isInteger(val) {
    return val[0] === "i" && val.at(-1) === "e";
}

function decodeInteger(bencodedValue) {
    const endIndex = bencodedValue.indexOf("e");
    if (endIndex === -1) {
        throw new Error("Invalid encoded value");
    }
    return {
        origin: bencodedValue.substr(0, endIndex + 1),
        value: parseInt(bencodedValue.slice(1, endIndex)),
    };
}
function isString(val) {
    return !isNaN(val[0]);
}
function decodeString(bencodedValue) {
    const firstColonIndex = bencodedValue.indexOf(":");
    const length = parseInt(bencodedValue.slice(0, firstColonIndex));
    return {
        origin: bencodedValue.substr(0, firstColonIndex + 1 + length),
        value: bencodedValue.slice(
            firstColonIndex + 1,
            firstColonIndex + 1 + length
        ),
    };
}

function isList(val) {
    return val[0] === "l" && val.at(-1) === "e";
}

function decodeList(bencodedValue) {
    const result = [];
    let index = 1;
    while (bencodedValue[index] !== "e") {
        const decodeObj = decode(bencodedValue.substr(index));
        if (decodeObj.value) {
            result.push(decodeObj.value);
            index += decodeObj.origin.length;
        }
    }
    return {
        origin: bencodedValue.substr(0, index + 1),
        value: result,
    };
}
function isDictionary(val) {
    return val[0] === "d" && val.at(-1) === "e";
}

function decodeDict(bencodedValue) {
    const result = {};
    let index = 1;
    while (bencodedValue[index] !== "e") {
        const keyObj = decode(bencodedValue.substr(index));
        index += keyObj.origin.length;
        const valueObj = decode(bencodedValue.substr(index));
        index += valueObj.origin.length;
        result[keyObj.value] = valueObj.value;
    }
    return {
        origin: bencodedValue.substr(0, index + 1),
        value: result,
    };
}


