const axios = require("axios");
const { error } = require("console");
const fs = require("fs");
const recycle_data = JSON.parse(fs.readFileSync("recycle_data.json", "utf8"));

const YOUR_API_KEY = "AIzaSyAAeR1w2sbaaqFKz5o3kxXpvEOZPQ0cIdw";

const config = {
  headers: {
    // Authorization: `Bearer ${accessToken}`,
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Goog-Api-Key": process.env.YOUR_API_KEY,
    "X-Goog-FieldMask":
      "places.nationalPhoneNumber,places.internationalPhoneNumber,places.formattedAddress,places.location,places.addressComponents,places.regularOpeningHours,places.adrFormatAddress,places.displayName,places.photos",
  },
};
const new_recycle_data_array = [];
// recycle_data.forEach((p, index) => {
//   // console.log(p);
//   if (index < 3) {
//     const { factoryname, itemname } = p;
//     // console.log(factoryname, itemname)
//     const itemArray = itemname.split("、");
//     const new_p = {
//       factoryname: factoryname,
//       category: itemArray,
//     };

//     const google_place_detail = getPlaceDetails(new_p.factoryname);

//     const mergedDATA = { ...new_p, ...google_place_detail };

//     // new_recycle_data_array.push(new_p);

//     // console.log(new_p)

//     // getPlaceDetails(new_p.factoryname);
//   }
// });

// async function processRecycleData(recycle_data) {
//   const new_recycle_data_array = [];

//   recycle_data.forEach(async (p, index) => {
//     if (index < 2) {
//       const { factoryname, itemname } = p;
//       const itemArray = itemname.split("、");
//       const new_p = {
//         factoryname: factoryname,
//         category: itemArray,
//       };

//       // new_recycle_data_array.push(new_p);
//       console.log(new_p.factoryname);
//       const google_place_detail = await getPlaceDetails(new_p.factoryname);
//       // await new Promise((resolve) => setTimeout(resolve, 1000));

//       console.log(google_place_detail);

//       const mergedDATA = { ...new_p, ...google_place_detail };

//       new_recycle_data_array.push(mergedDATA);
//     }
//   });

//   return new_recycle_data_array;
// }

async function processRecycleData(recycle_data) {
  const new_recycle_data_array = [];

  for (let index = 0; index < recycle_data.length; index++) {
    const p = recycle_data[index];
    const { factoryname, itemname } = p;
    const itemArray = itemname.split("、");
    const new_p = {
      factoryname: factoryname,
      category: itemArray,
    };

    // console.log(new_p.factoryname);
    const google_place_detail = await getPlaceDetails(new_p.factoryname);

    console.log(google_place_detail);

    const mergedDATA = { ...new_p, ...google_place_detail };

    new_recycle_data_array.push(mergedDATA);
  }

  // console.log(new_recycle_data_array);

  const jsonContent = JSON.stringify(new_recycle_data_array);

  fs.writeFile("recycle_data2.json", jsonContent, "utf8", (err) => {
    if (err) {
      console.error("寫入檔案時發生錯誤：", err);
      return;
    }
    console.log("JSON 檔案已成功寫入！");
  });
  // return new_recycle_data_array;
}
const new_recycle_data_array2 = processRecycleData(recycle_data);

// 將物件陣列轉換為 JSON 字串
// const jsonContent = JSON.stringify(new_recycle_data_array2);

// fs.writeFile("recycle_data2.json", jsonContent, "utf8", (err) => {
//   if (err) {
//     console.error("寫入檔案時發生錯誤：", err);
//     return;
//   }
//   console.log("JSON 檔案已成功寫入！");
// });

// const newArray = [];

// const apiPromises = recycle_data.map(async (value) => {
//   // 調用 API 函式並等待返回的數據
//   const apiResponse = await callAPI(value);
//   // 如果返回了數據，則將其加入新 array
//   if (apiResponse !== null) {
//     newArray.push(apiResponse);
//   }
// });

// // 使用 Promise.all 等待所有的 API 請求完成
// Promise.all(apiPromises)
//     .then(() => {
//         // 所有的 API 請求都完成後輸出新 array
//         console.log(newArray);
//     })
//     .catch((error) => {
//         console.error('其中一個 API 請求失敗:', error);
//     });

// const a = processRecycleData(recycle_data);
// console.log("@@@", a);

// 將物件陣列轉換為 JSON 字串
// const jsonContent = JSON.stringify(new_recycle_data_array);

// fs.writeFile("recycle_data2.json", jsonContent, "utf8", (err) => {
//   if (err) {
//     console.error("寫入檔案時發生錯誤：", err);
//     return;
//   }
//   console.log("JSON 檔案已成功寫入！");
// });
// 從 json1 中提取需要的字段
// const { factoryname, itemname } = recycle_data;

// // 將 itemname 根據 '、' 符號切割成數組
// const itemArray = itemname.split("、");

// // 創建新的 json1 只保留需要的字段並處理 itemname
// const new_recycle_data = {
//   factoryname: factoryname,
//   category: itemArray,
// };

// console.log(recycle_data);
// 替換為你的 Access Token

// // 回收厂名称数组
// const recyclePlaceNames = [
//   "立昌企業社",
//   "永豐商行",
//   "中華行",
//   // 添加更多的回收厂名称
// ];

// const data = {
//   textQuery: "中華行",
// };

// getPlaceDetails("立昌企業社");

// getPlaceDetails('立昌企業社');

function getPlaceDetails(placeName) {
  return new Promise((resolve, reject) => {
    // 搜索地点
    const data = {
      textQuery: placeName,
      languageCode: "zh-TW",
    };

    axios
      .post(`https://places.googleapis.com/v1/places:searchText`, data, config)
      .then((response) => {
        // 返回第一个地点的详细信息
        // console.log(response.data.places[0].displayName);

        console.log(response.data);

        resolve(response.data.places[0]);
      })
      .catch((error) => {
        // 捕获并输出错误
        console.error("Error:", error);
        reject({ error: "google data error" });
      });
  });
}

// const { MongoClient } = require('mongodb');

// // 配置 Google Places API 密钥
// const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY';

// // 配置 MongoDB 连接字符串
// const MONGO_URI = 'YOUR_MONGODB_CONNECTION_STRING';
// const DATABASE_NAME = 'your_database_name';
// const COLLECTION_NAME = 'your_collection_name';

// // 回收厂名称数组
// const recyclePlantNames = [
//     '立昌企業社',
//     '永豐商行',
//     '中華行',
//     // 添加更多的回收厂名称
// ];

// // 初始化 MongoDB 客户端
// // const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// async function getPlaceDetails(placeName) {
//     try {
//         // 搜索地点
//         let searchResponse = await axios.get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json', {
//             params: {
//                 input: placeName,
//                 inputtype: 'textquery',
//                 fields: 'place_id',
//                 key: GOOGLE_API_KEY,
//             },
//         });

//         if (searchResponse.data.candidates.length === 0) {
//             console.error(`No place found for ${placeName}`);
//             return null;
//         }

//         const placeId = searchResponse.data.candidates[0].place_id;

//         // 获取地点详情
//         let detailsResponse = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
//             params: {
//                 place_id: placeId,
//                 key: GOOGLE_API_KEY,
//             },
//         });

//         return detailsResponse.data.result;
//     } catch (error) {
//         console.error(`Error fetching details for ${placeName}:`, error);
//         return null;
//     }
// }

// async function saveToMongoDB(details) {
//     try {
//         const database = client.db(DATABASE_NAME);
//         const collection = database.collection(COLLECTION_NAME);
//         await collection.insertOne(details);
//         console.log(`Saved details for ${details.name} to MongoDB`);
//     } catch (error) {
//         console.error('Error saving to MongoDB:', error);
//     }
// }

// async function main() {
//     try {
//         await client.connect();
//         console.log('Connected to MongoDB');

//         for (const name of recyclePlantNames) {
//             const details = await getPlaceDetails(name);
//             if (details) {
//                 await saveToMongoDB(details);
//             }
//         }
//     } finally {
//         await client.close();
//         console.log('Disconnected from MongoDB');
//     }
// }

// main().catch(console.error);
