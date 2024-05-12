const process = require("process");
const decode = require("./parser");
function main() {
  const command = process.argv[2];

  // You can use print statements as follows for debugging, they'll be visible when running tests.
  // console.log("Logs from your program will appear here!");

  // Uncomment this block to pass the first stage
  if (command === "decode") {
    const bencodedValue = process.argv[3];
    const result =  decode(bencodedValue);
    if(result){
      return result.value;
    }
  } else {
    throw new Error(`Unknown command ${command}`);
  }
}

console.log(JSON.stringify(main()));