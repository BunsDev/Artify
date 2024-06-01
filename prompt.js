// Load dotenv package
const dotenv = require('dotenv');
dotenv.config();

// Dynamic import of node-fetch
const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function generateImage(prompt) {
  const apiKey = process.env.apiKey;
  const url = "https://api.openai.com/v1/images/generations";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    }),
  });

  if (response.ok) {
    const data = await response.json();

    // Generate a unique filename using a timestamp
    const filename = `output_${new Date().getTime()}.json`;

    // Correct way to use fs with ESM
    const fs = await import('fs/promises');
    await fs.writeFile(filename, JSON.stringify(data.data[0], null, 2), 'utf-8');

    console.log(`Image data has been written to ${filename}`);
    return data.data[0];
  } else {
    throw new Error(`Failed to generate image: ${response.statusText}`);
  }
}

// Usage example
generateImage("A boy with a cat")
    .then((data) => console.log("Generated Image Data Saved:", data))
    .catch((error) => console.error(error));