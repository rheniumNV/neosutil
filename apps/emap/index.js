const json2emap = require("json2emap");

const jsonToEmap = (json) => json2emap(json);

exports.getJsonToEmap = async (req, res) => {
  const json = req.query.json;
  res.send(jsonToEmap(JSON.parse(json)));
};

exports.postJsonToEmap = async (req, res) => {
  res.send(jsonToEmap(req.body));
};
