import dotenv from "dotenv";
import createApp from "./subserver/subserver";
import sequelize from "../dbconfig/dbconfig";
import syncdatabase from "../middleware/Syncdatabase";
var cron = require("node-cron");
import sendExitInterviewMessage from "../Integration/WhatsApp/index"; // Correct the path as needed
dotenv.config();
const port = process.env.PORT || 4000;
const app = createApp();

sequelize
  .sync()
  .then(() => {
    console.log("connection established");
  })
  .catch((error: any) => {
    console.error(error.message);
  });
const db = async () => {
  try {
    syncdatabase();
    console.log("connection established");
  } catch (error: any) {
    console.error(error.message);
  }
};
db();

// Schedule the job to run every day at 13:35 (1:35 PM)
cron.schedule("05 16 * * *", async () => {
  console.log("Running scheduled reminder job...");

  try {
    sendExitInterviewMessage();
  } catch (error) {
    console.error("Error during reminder job execution:", error);
  }
});

// cron.schedule("* * * * *", () => {
//   console.log("running a task every minute");
//   sendExitInterviewMessage();
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
