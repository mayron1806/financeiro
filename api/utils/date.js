const moment = require("moment");
const getDateFromString = (date) => {
  const moment_date = moment(date, "YYYY-MM-DD").toDate();
  const string_date = new Date(moment_date).toISOString().slice(0, 10);
  return new Date(string_date);
}
module.exports = {getDateFromString};
