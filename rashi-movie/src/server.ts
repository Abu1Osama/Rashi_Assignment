import express from "express";
import payload from "payload";
import cors from "cors";

import Media from "./collections/Media";
import Posts from "./collections/Posts";

require("dotenv").config();

const app = express();
app.use(cors());

app.get("/", (_, res) => {
  res.redirect("/admin");
});

const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  app.get("/posts/videos/stream", async (req, res) => {
    try {
      const shortVideos = await payload.find({
        collection: Posts.slug,
        depth: 2,
        where: {
          type: { equals: "short_video" },
        },
      });

      res.json(shortVideos);
    } catch (error) {
      console.error("Error fetching short videos:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.get("/media", async (req, res) => {
    try {
      const allMedia = await payload.find({
        collection: Media.slug,
      });

      res.json(allMedia);
    } catch (error) {
      console.error("Error fetching media items:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.listen(3001, () => {
    console.log("Server is running on port 3001");
  });
};

start();
