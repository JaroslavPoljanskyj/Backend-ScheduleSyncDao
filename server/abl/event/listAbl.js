const eventDao = require("../../dao/event-dao.js");

async function ListAbl(req, res) {
  try {
    const eventList = eventDao.list();

    res.json(eventList);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListAbl;
