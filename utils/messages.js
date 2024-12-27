const moment = require("moment");

const formatMsgs = (userName, text) => {
  return {
    userName,
    text,
    time: moment().format("h:mm a"),
  };
};

module.exports = formatMsgs;
