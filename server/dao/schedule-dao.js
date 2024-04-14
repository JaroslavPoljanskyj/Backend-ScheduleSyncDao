const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { readJSONFile, writeJSONFile } = require("./base-dao");



const scheduleFolderPath = path.join(__dirname, "storage", "scheduleList");



// Method to create a new schedule
function create(schedule) {
    try {
        // Generate a unique ID for the new schedule
        const id = crypto.randomBytes(16).toString("hex");
        schedule.id = id;
        schedule.isActive = true;

        // Set isActive property to false for all other schedules
        list().forEach(existingSchedule => {
            existingSchedule.isActive = false;
            writeJSONFile(path.join(scheduleFolderPath, `${existingSchedule.id}.json`), existingSchedule);
        });

        // Write the new schedule to a JSON file
        writeJSONFile(path.join(scheduleFolderPath, `${id}.json`), schedule);

        return schedule;
    } catch (error) {
        throw { code: "failedToCreateSchedule", message: error.message };
    }
}


// Method to remove an schedule from a file
function remove(shceduleId) {
  try {
    const filePath = path.join(scheduleFolderPath, `${shceduleId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw { code: "failedToDeleteSchedule", message: error.message };
  }
}

// Method to list all schedules
function list() {
    try {
        const files = fs.readdirSync(scheduleFolderPath);
        const scheduleList = files.map(file => readJSONFile(path.join(scheduleFolderPath, file)));
        return scheduleList.sort((a, b) => new Date(a.date) - new Date(b.date));
    } catch (error) {
        throw { code: "failedToListSchedules", message: error.message };
    }
}

// Method to add an event to the active schedule
function addEvent(eventId) {
    try {
        const activeSchedule = list().find(schedule => schedule.isActive === true);
        if (!activeSchedule) throw { code: "noActiveSchedule", message: "No active schedule found" };

        if (!activeSchedule.events) {
            activeSchedule.events = [];
        }

        const eventExists = activeSchedule.events.find(event => event.id === eventId);

        if (!eventExists) {
            // If the event with the same ID doesn't exist, push it to the events array
            activeSchedule.events.push({ id: eventId });
            writeJSONFile(path.join(scheduleFolderPath, `${activeSchedule.id}.json`), activeSchedule);
        } else {
            console.log("Event already exists with ID:", eventId);
        }

        return activeSchedule;
    } catch (error) {
        throw { code: "failedToAddEvent", message: error.message };
    }
}

// Method to delete an event from the active schedule
function deleteEvent(eventId) {
    try {
        const activeSchedule = list().find(schedule => schedule.isActive === true);
        if (!activeSchedule) throw { code: "noActiveSchedule", message: "No active schedule found" };

        const eventIndex = activeSchedule.events.findIndex(event => event.id === eventId);
        if (eventIndex !== -1) {
            // If the event exists, remove it from the events array
            activeSchedule.events.splice(eventIndex, 1);
            writeJSONFile(path.join(scheduleFolderPath, `${activeSchedule.id}.json`), activeSchedule);
            console.log("Event with ID", eventId, "deleted from the schedule.");
            return activeSchedule;
        } else {
            console.log("Event with ID", eventId, "does not exist in the schedule.");
            return activeSchedule;
        }
    } catch (error) {
        throw { code: "failedToDeleteEvent", message: error.message };
    }
}

module.exports = {
  create,
  list,
  addEvent,
  deleteEvent,
  remove
};
