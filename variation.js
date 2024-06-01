// Load dotenv package
const dotenv = require('dotenv');
dotenv.config();
// Dynamic import of node-fetch and form-data
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function downloadImage(imageUrl) {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Failed to download image');
    return response.buffer();
}

async function generateImageVariations(imageUrl) {
    const FormData = (await import('form-data')).default;
    const formData = new FormData();
    const apiKey = process.env.apikey; // Replace YOUR_API_KEY with your actual OpenAI API key.
    const url = "https://api.openai.com/v1/images/variations";

    try {
        const imageBuffer = await downloadImage(imageUrl);
        formData.append('image', imageBuffer, {
            filename: 'image.jpg', // OpenAI API needs a filename for the image
            contentType: 'image/jpeg', // Ensure this matches the image content type
        });
        formData.append('n', 3); // Generate 3 variations

        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                // 'Content-Type': 'multipart/form-data' is set automatically by form-data
            },
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            return data.data.map(item => item.url); // Returns an array of URLs for the image variations
        } else {
            const errorData = await response.json();
            throw new Error(`Failed to generate image variations: ${errorData.error.message}`);
        }
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}

// Usage example: Replace 'IMAGE_URL' with the actual image URL
generateImageVariations('https://i.ibb.co/phmWXH6/4.png')
    .then(urls => {
        console.log("Generated Image Variation URLs:", urls);
    })
    .catch(error => {
        console.error(error);
    });
