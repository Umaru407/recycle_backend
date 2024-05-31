// const {VertexAI} = require('@google-cloud/vertexai');

// // Initialize Vertex with your Cloud project and location
// const vertex_ai = new VertexAI({project: 'recycle-424516', location: 'us-central1'});
// const model = 'gemini-1.5-flash-001';

// // Instantiate the models
// const generativeModel = vertex_ai.preview.getGenerativeModel({
//   model: model,
//   generationConfig: {
//     'maxOutputTokens': 8192,
//     'temperature': 1,
//     'topP': 0.95,
//   },
//   safetySettings: [
//     {
//         'category': 'HARM_CATEGORY_HATE_SPEECH',
//         'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
//     },
//     {
//         'category': 'HARM_CATEGORY_DANGEROUS_CONTENT',
//         'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
//     },
//     {
//         'category': 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
//         'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
//     },
//     {
//         'category': 'HARM_CATEGORY_HARASSMENT',
//         'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
//     }
//   ],
// });

// const image1 = {
//   inlineData: {
//     mimeType: 'image/jpeg',
//     data:
//   }
// };
const text1 = {text: `\"非廢塑膠容器類\",
            \"廢鐵容器\",
            \"廢鋁容器\",
            \"廢玻璃容器\",
            \"廢紙容器\",
            \"廢鋁箔包\",
            \"其他廢紙容器(含免洗餐具)\",
            \"植物纖維容器\",
            \"廢塑膠容器\",
            \"廢PET容器\",
            \"廢PVC容器\",
            \"廢PP容器\",
            \"廢PE容器\",
            \"廢未發泡PS容器\",
            \"廢發泡PS容器\",
            \"廢PP/PE容器\",
            \"廢乾電池類\",
            \"廢鉛蓄電池類\",
            \"廢電子電器類\",
            \"廢電視機\",
            \"廢電冰箱\",
            \"廢洗衣機\",
            \"廢冷暖氣機\",
            \"廢電風扇\",
            \"廢資訊物品類\",
            \"廢主機\",
            \"廢顯示器\",
            \"廢可攜式電腦\",
            \"廢印表機\",
            \"廢鍵盤\",
            \"廢照明光源類\"`};

// async function generateContent() {
//   const req = {
//     contents: [
//       {role: 'user', parts: [{text: `請幫我將這張圖片做回收分類 類別為`}, image1, text1]}
//     ],
//   };

//   const streamingResp = await generativeModel.generateContentStream(req);

//   for await (const item of streamingResp.stream) {
//     process.stdout.write('stream chunk: ' + JSON.stringify(item) + '\n');
//   }

//   process.stdout.write('aggregated response: ' + JSON.stringify(await streamingResp.response));
// }

// generateContent();

const axios = require("axios");
var fs = require("fs");
const sharp = require("sharp");
const apiKey = "AIzaSyAAeR1w2sbaaqFKz5o3kxXpvEOZPQ0cIdw";
const model = "gemini-1.5-flash-001";
const endpoint = `https://us-central1-aiplatform.googleapis.com/v1/projects/recycle-424516/locations/us-central1/models/${model}:predict`;

async function resizeImage(imagePath) {
//   const imageBuffer = await fs.readFile(imagePath);
  const resizedImageBuffer = await sharp(imagePath)
    .resize(800) // 設定縮小圖片的寬度，保持縱橫比
    .toBuffer();
    // console.log(resizedImageBuffer.toString("base64"))
  return resizedImageBuffer.toString("base64");
}

// resizeImage("test.jpeg")



async function generateContent() {
  try {
    const base64Image = await resizeImage("test.jpeg"); // 替換成實際的圖片路徑

    const req = {
      instances: [
        {
          input: {
            text: `請幫我將這張圖片做回收分類 類別為`,
            image: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
            additionalText: text1,
          },
        },
      ],
      parameters: {
        maxOutputTokens: 8192,
        temperature: 1,
        topP: 0.95,
        safetySettings: [
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      },
    };

    const response = await axios.post(endpoint, req, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });
    console.log("Response:", response.data);
  } catch (error) {
    console.error(
      "Error:",
      error
    );
  }
}

generateContent();
