const fs = require("fs");

// Method to read data from a JSON file
function readJSONFile(filePath) {
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
}

// Method to write data to a JSON file
function writeJSONFile(filePath, data) {
    const fileData = JSON.stringify(data);
    fs.writeFileSync(filePath, fileData, "utf8");
}

module.exports = {
    readJSONFile,
    writeJSONFile
  };
  