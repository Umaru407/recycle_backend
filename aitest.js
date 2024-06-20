const { VertexAI } = require("@google-cloud/vertexai");

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({
  project: "recycle-424516",
  location: "us-central1",
});
const model = "gemini-1.5-flash-001";

// Instantiate the models
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generationConfig: {
    maxOutputTokens: 30,
    temperature: 1,
    topP: 0.95,
  },
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
});

async function generateContent(image) {
  const text1 = {
    text: `請問${image}為以下清單哪一類(若有多種可能，請幫我用,分隔（廢玻璃容器,廢紙容器,廢鋁箔包，1~3個分類，不需要解釋或說明，只要解答)
  \"["一次鋰電池","二次鋰電池","其他公告廢容器","其他廢塑膠容器","其他廢紙容器(含免洗餐具)","廢PET容器","廢PE容器","廢PP/PE容器","廢PP容器","廢PVC容器","廢主機","廢乾電池","廢乾電池類","廢冷暖氣機","廢印表機","廢可攜式電腦","廢塑膠容器","廢塑膠容器類","廢未發泡PS容器","廢機動車輛","廢機動車輛類","廢機車","廢氣密或液密包裝紙容器","廢氣密或液密包裝紙容器2015","廢汽車","廢洗衣機","廢照明光源","廢照明光源類","廢玻璃容器","廢發泡PS容器","廢監視器"," 廢筆記型電腦","廢紙容器","廢資訊物品","廢資訊物品類","廢輪胎","廢輪胎類","廢鉛蓄電池","廢鉛蓄電池類","廢鋁容器","廢鋁箔包","廢鋁箔包2015","廢鍵盤","廢鐵容器","廢電冰箱","廢電子電器","廢電子電器類","廢電視機","廢電風扇","廢顯示器","植物纖維免洗餐具","植物纖維容器","植物纖維容器2015","氧化汞電池","氧化銀電池","氫氧電池","生質塑膠廢容器","筒型鋅空氣電池","筒型鹼錳電池","農藥(含環境用藥)廢容器","鈕扣型鋅空氣電池","鈕扣型鋰電池","鈕扣型鹼錳電池","錳鋅電池","鎳氫電池","鎳鎘電池","非塑膠廢容器類","非廢塑膠容器類"]`,
  };
  const image1 = {
    inlineData: {
      mimeType: "image/jpeg",
      data: image,
    },
  };
  const req = {
    contents: [{ role: "user", parts: [text1, image1] }],
  };
  const streamingResp = await generativeModel.generateContentStream(req);

  const ans = await streamingResp.response;
  return ans.candidates[0].content.parts[0].text.replace(/\s/g, '');
}

module.exports = { generateContent };
// const a = generateContent().then((res) => {
//   console.log(res.candidates[0].content.parts[0].text);
// });
