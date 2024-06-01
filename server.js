require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const generateImageVariations = require("./variation");
const generateImage = require("./prompt");
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

    const response = await generateImage(data.prompt);
    if (response.success) {
      /// call contract
    } else {
      throw response;
    }
  } catch (error) {
    throw error;
    // const error_data = JSON.parse(error.message);
    // res.status(500).send({ success: false, error: error_data });
  }
});

app.post("/image-to-image", async (req, res) => {
  try {
    const data = req.body;
    res.status(200).send({ success: true });

    const response = await generateImageVariations(data.image);
    if (response.success) {
      /// call contract
    } else {
      throw response;
    }
  } catch (error) {
    throw error;
    // const error_data = JSON.parse(error.message);
    // res.status(500).send({ success: false, error: error_data });
  }
});

// const generateImageFromPrompt = async (prompt) => {
//   try {
//     const apiKey = process.env.API_KEY; // Your API key, securely managed
//     const data = {
//       model: "dall-e-2",
//       prompt,
//       n: 1,
//       size: "1024x1024",
//     };
//     const headers = {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${apiKey}`,
//     };
//     const response = await axios.post(
//       "https://api.openai.com/v1/images/generations",
//       data,
//       {
//         headers,
//       }
//     );

//     return { success: true, message: "Success", data: response.data.data[0] };
//     // res.status(200).send({ data: response.data.data[0] });
//   } catch (error) {
//     throw new Error(
//       JSON.stringify({
//         success: false,
//         message: error.message ?? "Server error",
//         data: {},
//       })
//     );
//     // console.log(apiKeyyy);
//     // console.log(error.message);
//     // res.status(500).send(error);
//   }
// };

const server = app;
const PORT = 5000 || process.env.PORT;
server.listen(PORT, async () => {
  console.log("server running on port ", PORT);
});
