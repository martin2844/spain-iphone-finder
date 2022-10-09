const { parentPort } = require("worker_threads");
const axios = require("axios");
const dayjs = require("dayjs");
const iphoneModels = require("../data/iphones");
const locations = require("../data/locations");

const mailer = require("../mailer/mailer");

const iphoneBuilder = (iphoneModel, location) => {
  return {
    url: `https://www.apple.com/es/shop/fulfillment-messages?pl=true&mts.0=regular&parts.0=${iphoneModel.model}&location=${location}`,
    ...iphoneModel,
  };
};

const iphones = [];

locations.forEach((l) => {
  iphoneModels.forEach((m) => {
    iphones.push(iphoneBuilder(m, l));
  });
});

(async () => {
  // wait for a promise to finish
  console.log("Job Run");
  const available = [];
  const day = dayjs(Date.now()).format("DD/MM/YYYY HH:mm:ss");
  console.log(`----------------- Resultados para el ${day} -----------------`);
  for await (const iphone of iphones) {
    await sleep(4000);
    const response = await axios.get(iphone.url);
    const { stores } = response.data.body.content.pickupMessage;
    stores.forEach((s) => {
      if (s.partsAvailability[iphone.model].pickupDisplay === "available") {
        console.log(
          `\x1b[43m\x1b[34m[${dayjs(Date.now()).format(
            "HH:mm:ss"
          )}]\x1b[0m Hay Stock del \x1b[32m Iphone \x1b[32m\x1b[36m ${
            iphone.description
          } \x1b[0m en \x1b[33m ${s.storeName} \x1b[0m`
        );
        available.push(
          `Hay Stock del Iphone ${iphone.description} en ${s.storeName}, Codigo postal: ${s.address.postalCode}, ciudad: ${s.city}`
        );
      } else {
        console.log(
          `\x1b[43m\x1b[34m[${dayjs(Date.now()).format(
            "HH:mm:ss"
          )}]\x1b[0m No hay Stock del \x1b[31m Iphone \x1b[31m\x1b[36m ${
            iphone.description
          } \x1b[0m en \x1b[33m ${s.storeName} \x1b[0m`
        );
      }
    });
  }

  if (available.length > 0) {
    await mailer(available);
  }

  // signal to parent that the job is done
  if (parentPort) parentPort.postMessage("done");
  else process.exit(0);
})();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
