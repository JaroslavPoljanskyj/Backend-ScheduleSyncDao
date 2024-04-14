const scheduleDao = require("../../dao/schedule-dao.js");

async function ListAbl(req, res) {
  try {
    const scheduleList = scheduleDao.list();

    res.json(scheduleList);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListAbl;
