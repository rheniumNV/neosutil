const axios = require("axios");
const json2emap = require("json2emap");
const _ = require("lodash");

exports.getEventCalender1Week = async (req, res) => {
  const { useEmap = true } = req.query;

  const eventData = _.get(await axios("https://neokun.kokoa.dev/"), "data", []);

  res.send(useEmap ? json2emap(eventData) : eventData);
};
