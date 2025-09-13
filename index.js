const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const webpush = require("web-push");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // serve frontend site
app.use("/admin", express.static("admin")); // serve admin panel

// VAPID config
const VAPID_PUBLIC_KEY = "BGrZmOBxpg1EO5ViJewtE6sI2SKvjYkca2p8mz0dti00UjPIfO-_6oagD4YLEi37ZG6Y8h05j45PuX9yjYPWXYs";
const VAPID_PRIVATE_KEY = "rNMyM-VK_h3aY0CgMVos0_zq3AcOw81VDJktfl-TneQ";
webpush.setVapidDetails("mailto:you@example.com", VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

// Subscription list
const subscriptions = new Set();

// Public key for frontend
app.get("/vapidPublicKey", (req, res) => {
  res.send({ key: VAPID_PUBLIC_KEY });
});

// Save subscription
app.post("/subscribe", (req, res) => {
  const sub = req.body;
  subscriptions.add(JSON.stringify(sub));
  res.status(201).json({ ok: true });
});

// Admin trigger notification
app.post("/notify", async (req, res) => {
  const { title, body, url } = req.body;
  const payload = JSON.stringify({ title, body, url });
  let success = 0;

  for (const s of Array.from(subscriptions)) {
    try {
      await webpush.sendNotification(JSON.parse(s), payload);
      success++;
    } catch (err) {
      console.error("Push failed:", err);
      subscriptions.delete(s);
    }
  }

  res.json({ sent: success });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
