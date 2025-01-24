const axios = require("axios");

// API URL and Key
const API_URL = "https://backend.api-wa.co/campaign/botsense/api/v2";
const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NzUyZDgwOTRjZDU5MGI3YzMxODRiMSIsIm5hbWUiOiJJR05JVElWRSBTT0ZUV0FSRSBMQUJTIFBSSVZBVEUgTElNSVRFRCIsImFwcE5hbWUiOiJBaVNlbnN5IiwiY2xpZW50SWQiOiI2Njc1MmQ3Zjk0Y2Q1OTBiN2MzMTg0OTkiLCJhY3RpdmVQbGFuIjoiQkFTSUNfTU9OVEhMWSIsImlhdCI6MTczMzMwMTgxM30.ZrHDFFZwmNmPCZVT0Kvhp4pVDbs3C_Nos_7AA0RTvxE";

// Function to send a message
const sendMessage = async (user: any) => {
  try {
    const payload = {
      apiKey: API_KEY,
      campaignName: "CM_management",
      destination: user.phone,
      userName: "IGNITIVE SOFTWARE LABS PRIVATE LIMITED",
      templateParams: [user.name, user.url],
      source: "new-landing-page form",
      media: {},
      paramsFallbackValue: {
        FirstName: user.url || "User",
      },
    };

    const response = await axios.post(API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(`Message sent to ${user.name} (${user.phone}):`, response.data);
  } catch (error: any) {
    console.error(
      `Error sending message to ${user.name} (${user.phone}):`,
      error.response?.data || error.message
    );
  }
};
//export default sendMessage;

export default sendMessage;
