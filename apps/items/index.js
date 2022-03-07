const axios = require("axios");
const _ = require("lodash");
const json2emap = require("json2emap");

function getOwnerType(ownerId) {
  const ownerType = _.startsWith(ownerId, "U-")
    ? "users"
    : _.startsWith(ownerId, "G-")
    ? "groups"
    : undefined;
  if (!ownerType) {
    throw new Error(`Invalid ownerId. ownerId=${ownerId}`);
  }
  return ownerType;
}

function splitRecordLink(recordLink) {
  const recordList = _.split(recordLink, "/");
  if (_.size(recordList) != 5) {
    throw new Error(`Invalid recordLink.recordLink=${recordLink}`);
  }
  const recordId = _.get(recordList, 4);
  const ownerId = _.get(recordList, 3);
  const ownerType = getOwnerType(ownerId);
  return { recordId, ownerId, ownerType };
}

async function getInfoFromRecordLink(recordLink) {
  const { ownerType, ownerId, recordId } = splitRecordLink(recordLink);

  const {
    data: { path, name, recordType },
  } = await axios(
    `https://api.neos.com/api/${ownerType}/${ownerId}/records/${recordId}`
  );

  return { path, name, recordType, ownerType, ownerId };
}

async function getItems(ownerId, path) {
  const ownerType = getOwnerType(ownerId);
  const { data: items } = await axios(
    `https://api.neos.com/api/${ownerType}/${ownerId}/records?path=${path}`
  );
  return items;
}

// /api/v1/items/newest?record_link=neosrec:///U-rhenium/R-32338edd-bd95-4e38-a1ea-a0f24e4ecda6
exports.getLatestItem = async (req, res, _next) => {
  const { useEmap = true, record_link, owner_id, path } = req.query;

  let items = [];

  if (typeof owner_id == "string" && typeof path == "string") {
    items = await getItems(owner_id, path);
  } else if (typeof record_link == "string") {
    const {
      ownerId: directoryOwnerId,
      path: directoryPath,
      name: directoryName,
      recordType,
    } = await getInfoFromRecordLink(record_link);

    if (recordType != "directory") {
      res
        .status(400)
        .send(`type of record_link is not directory.recordType=${recordType}`);
      throw new Error(
        `type of record_link is not directory.recordType=${recordType}`
      );
    }

    const directoryFullPath = _.replace(
      `${directoryPath}/${directoryName}`,
      /\//g,
      "\\"
    );

    items = await getItems(directoryOwnerId, directoryFullPath);
  } else {
    const errorMap = {
      ...(typeof owner_id != "string"
        ? { ownerId: `owner_id is not string.owner_id=${owner_id}` }
        : {}),
      ...(typeof path != "string"
        ? { path: `path is not string.path=${path}` }
        : {}),
      ...(typeof record_link != "string"
        ? { recordLink: `record_link is not string.record_link=${record_link}` }
        : {}),
    };
    const errorMessage = _(errorMap)
      .map((v) => v)
      .join("\n");
    if (_.size(errorMap) > 0) {
      res.status(400).send(errorMessage);
      throw new Error(errorMessage);
    }
  }

  if (_.size(items) == 0) {
    res.status(404).send("item not found");
    throw new Error("item not found.");
  }

  const { id, assetUri, name, ownerName, thumbnailUri, creationTime } = _(items)
    .sortBy(({ creationTime }) => creationTime)
    .last();

  const latestItem = {
    id,
    assetUri,
    name,
    ownerName,
    thumbnailUri,
    creationTime,
  };

  res.send(useEmap ? json2emap(latestItem) : latestItem);
};
