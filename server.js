require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const generateImageVariations = require("./variation");
const generateImage = require("./prompt");
const { setImages } = require("./ContractInteraction");
const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("common"));

app.get("/", (_, res) => {
  res.status(200).send("server running successfully");
});

app.post("/prompt-to-image", async (req, res) => {
  try {
    const data = req.body;

    res.status(200).send({ success: true });
    const API_KEY = req.headers.authorization.split(" ")[1];
    const response = await generateImage(data.prompt, API_KEY);
    if (response.success) {
      /// call contract
      await setImages(response.data.url, 0);
    } else {
      throw response;
    }
  } catch (error) {
    throw error;
  }
});

app.post("/image-to-image", async (req, res) => {
  try {
    const data = req.body;
    res.status(200).send({ success: true });
    const API_KEY = req.headers.authorization.split(" ")[1];
    const response = await generateImageVariations(data.image, API_KEY);
    if (response.success) {
      await setImages(response.data, 1);
    } else {
      throw response;
    }
  } catch (error) {
    throw error;
  }
});

const server = app;
const PORT = 5000 || process.env.PORT;
server.listen(PORT, async () => {
  console.log("server running on port ", PORT);
});
