const Ajv = require("ajv");
const ajv = new Ajv();
const validateDateTime = require("../../helpers/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

const scheduleDao = require("../../dao/schedule-dao.js");

const schema = {
  type: "object",
  properties: {
    name: { type: "string" }
  },
  required: ["name"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let schedule = req.body;

    // validate input
    const valid = ajv.validate(schema, schedule);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    schedule = scheduleDao.create(schedule);
    res.json(schedule);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;
