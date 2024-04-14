const Ajv = require("ajv");
const ajv = new Ajv();

const scheduleDao = require("../../dao/schedule-dao.js");


const schema = {
  type: "object",
  properties: {
    id: { type: "string" }
  },
  required: ["id"],
  additionalProperties: false,
};

async function deleteEventAbl(req, res) {
  try {
    let event = req.body;
    
    const valid = ajv.validate(schema, event);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }
    const updatedSchedule = scheduleDao.deleteEvent(event.id);

    if (!updatedSchedule) {
      res.status(404).json({
        code: "eventNotFound",
        message: `Event ${event.id} not found`,
      });
      return;
    }

    res.json("Event was succesfully deleted");
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = deleteEventAbl;
