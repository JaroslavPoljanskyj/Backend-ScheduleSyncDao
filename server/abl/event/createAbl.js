const Ajv = require("ajv");
const ajv = new Ajv();

const eventTimePatern = require("../../helpers/validate-date-time.js");
const eventDao = require("../../dao/event-dao.js");

const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    TimeFrom: { type: "string", pattern: eventTimePatern },
    TimeTo: { type: "string", pattern: eventTimePatern }
  },
  additionalProperties: true
};



async function CreateAbl(req, res) {
  try {
    let event = req.body;

    // validate input
    const valid = ajv.validate(schema, event);
    console.log(event);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: 'dtoIn is not valid',
        validationError: ajv.errors,
        eventRequest : event
      });
      return;
    }

    event = eventDao.create(event);
    res.json(event);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;
