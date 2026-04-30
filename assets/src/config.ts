const isLocal = window.location.hostname === "localhost";

export default {
  apiGateway: {
    REGION: "us-east-1",
    API_URL: isLocal
      ? "http://localhost:4000"
      : "https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod",
  }
};
