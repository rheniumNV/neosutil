const axios = require("axios");
const json2emap = require("json2emap");

exports.getEventCalender1Week = async (req, res) => {
  const { useEmap = true } = req.query;

  const eventData = await axios("https://neokun.kokoa.dev/");

  res.send(useEmap ? json2emap(eventData) : eventData);
};
