require("dotenv").config();
const Bree = require("bree");

const bree = new Bree({
  jobs: [
    {
      name: "finder",
      timeout: "1 seconds",
      interval: "20 minutes",
    },
  ],
});

(async () => {
  await bree.start();
})();
