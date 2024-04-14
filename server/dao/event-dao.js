const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { readJSONFile, writeJSONFile } = require("./base-dao");

const eventFolderPath = path.join(__dirname, "storage", "eventList");

// Method to read an event from a file
function get(eventId) {
  try {
    const filePath = path.join(eventFolderPath, `${eventId}.json`);
    return readJSONFile(filePath);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadEvent", message: error.message };
  }
}

// Method to write an event to a file
function create(event) {
  try {
    event.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(eventFolderPath, `${event.id}.json`);
    writeJSONFile(filePath, event);
    return event;
  } catch (error) {
    throw { code: "failedToCreateEvent", message: error.message };
  }
}

// Method to update event in a file
function update(event) {
  try {
    const currentEvent = get(event.id);
    if (!currentEvent) return null;
    const newEvent = { ...currentEvent, ...event };
    const filePath = path.join(eventFolderPath, `${event.id}.json`);
    writeJSONFile(filePath, newEvent);
    return newEvent;
  } catch (error) {
    throw { code: "failedToUpdateEvent", message: error.message };
  }
}

// Method to remove an event from a file
function remove(eventId) {
  try {
    const filePath = path.join(eventFolderPath, `${eventId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw { code: "failedToRemoveEvent", message: error.message };
  }
}

// Method to list events in a folder
function list() {
  try {
    const files = fs.readdirSync(eventFolderPath);
    const eventList = files.map((file) => {
      const filePath = path.join(eventFolderPath, file);
      return readJSONFile(filePath);
    });
    eventList.sort((a, b) => new Date(a.date) - new Date(b.date));
    return eventList;
  } catch (error) {
    throw { code: "failedToListEvents", message: error.message };
  }
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
};
