const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.post("/tow-calc", (req, res) => {
  const {
    gvwr,
    gcwr,
    maxTrailer,
    maxTongue,
    curbWeight,
    passengers,
    cargo,
    trailerLoaded,
    tonguePercent
  } = req.body;

  const GVWR = Number(gvwr);
  const GCWR = Number(gcwr);
  const MAX_TRAILER = Number(maxTrailer);
  const MAX_TONGUE = Number(maxTongue);
  const CURB = Number(curbWeight);
  const PASS = Number(passengers);
  const CARGO = Number(cargo);
  const TRAILER = Number(trailerLoaded);
  const TONGUE_PERCENT = Number(tonguePercent);

  const payload = PASS + CARGO;
  const tongueWeight = TRAILER * (TONGUE_PERCENT / 100);
  const vehicleLoaded = CURB + payload + tongueWeight;
  const combinedWeight = vehicleLoaded + TRAILER;

  const gvwrExceeded = vehicleLoaded > GVWR;
  const gcwrExceeded = combinedWeight > GCWR;
  const trailerExceeded = TRAILER > MAX_TRAILER;
  const tongueExceeded = tongueWeight > MAX_TONGUE;

  const safeToTow =
    !gvwrExceeded &&
    !gcwrExceeded &&
    !trailerExceeded &&
    !tongueExceeded;

  res.json({
    calculations: {
  payloadUsed: payload,
  tongueWeight,
  vehicleLoaded,
  combinedWeight
  },
  limits: {         
  gvwrExceeded: Boolean(gvwrExceeded),
  gcwrExceeded: Boolean(gcwrExceeded),
  trailerExceeded: Boolean(trailerExceeded),
  tongueExceeded: Boolean(tongueExceeded),
  safeToTow: Boolean(safeToTow)
});
  
});
app.get("/", (req, res) => {
  res.send("Tow calculator API is running.");
});

const PORT = process.env.PORT || 3000;
app.get("/test", (req, res) => {
  res.json({ message: "API is live" });
});
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
