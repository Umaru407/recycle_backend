// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const fs = require("fs");
const dotenv = require("dotenv");
const cors = require("cors");
const { generateContent } = require("./aitest");
const multer = require('multer');
const sharp = require("sharp");
dotenv.config(); // 放在最上方

const app = express();
const PORT = process.env.PORT || 3000;
const uri = process.env.uri;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.use(express.json());
// 使用 cors 中間件，並設置 Access-Control-Allow-Origin 為通配符 (*)
app.use(
  cors({
    origin: "*",
  })
);

const upload = multer({ storage: multer.memoryStorage() });

app.get("/api/name/:name", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("recycle");
    const collection = database.collection("place_detail");

    const { name } = req.params;
    const result = await collection.findOne({ factoryname: name });

    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: "Name not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await client.close();
  }
});

app.get("/api/address/:location", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("recycle");
    const collection = database.collection("place_detail");

    const { location } = req.params;
    const result = await collection
      .find({
        $or: [
          { "addressComponents.longText": location },
          { "addressComponents.longText": { $regex: `${location}\\(` } },
        ],
      })
      .toArray();

    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).json({ message: "Location not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await client.close();
  }
});


app.get("/api/opening-weekday", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("recycle");
    const collection = database.collection("place_detail");

    const { days } = req.query;

    if (!days) {
      return res.status(400).json({ message: "Days parameter is required" });
    }

    const dayNumbers = days.split(',').map(day => parseInt(day)).filter(day => !isNaN(day) && day >= 0 && day <= 6);


    console.log(dayNumbers);
    if (dayNumbers.length === 0) {
      return res.status(400).json({ message: "Invalid days parameter" });
    }

    const query = {
      'regularOpeningHours.periods': {
        $elemMatch: {
          'open.day': { $in: dayNumbers },
          'close.day': { $in: dayNumbers }
        }
      }
    };

    const result = await collection.find(query).toArray();

    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).json({ message: "No opening hours found for the given days" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await client.close();
  }
});


// app.get("/api/opening-weekday/:day", async (req, res) => {
//   const client = new MongoClient(uri);

//   try {
//     await client.connect();
//     const database = client.db("recycle");
//     const collection = database.collection("place_detail");

//     const { day } = req.params;
//     const dayNumber = parseInt(day);

//     if (isNaN(dayNumber) || dayNumber < 0 || dayNumber > 6) {
//       return res.status(400).json({ message: "Invalid day parameter" });
//     }

//     const query = {
//       'regularOpeningHours.periods': {
//         $elemMatch: {
//           'open.day': dayNumber,
//           'close.day': dayNumber
//         }
//       }
//     };

//     const result = await collection.find(query).toArray();

//     if (result.length > 0) {
//       res.json(result);
//     } else {
//       res.status(404).json({ message: "No opening hours found for the given day" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   } finally {
//     await client.close();
//   }
// });

app.get("/api/search", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("recycle");
    const collection = database.collection("place_detail");

    const { location, weekdays ,categories } = req.query;

    const query = {};

    if (location) {
      query.$or = [
        { "addressComponents.longText": location },
        { "addressComponents.longText": { $regex: `${location}\\(` } }
      ];
    }

    if (weekdays) {
      const dayNumbers = weekdays.split(',').map(day => parseInt(day)).filter(day => !isNaN(day) && day >= 0 && day <= 6);

      if (dayNumbers.length === 0) {
        return res.status(400).json({ message: "Invalid days parameter" });
      }

      query['regularOpeningHours.periods'] = {
        $elemMatch: {
          'open.day': { $in: dayNumbers },
          'close.day': { $in: dayNumbers }
        }
      };
    }

    if (categories) {
      const categoriesArray = categories.split(',');
      query.category = { $in: categoriesArray };
    }


    const result = await collection.find(query).toArray();

    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).json({ message: "No matching data found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await client.close();
  }
});

// app.get("/api/search", async (req, res) => {
//   const client = new MongoClient(uri);

//   try {
//     await client.connect();
//     const database = client.db("recycle");
//     const collection = database.collection("place_detail");

//     const { location, weekday } = req.query;

//     const query = {};

//     if (location) {
//       query.$or = [
//         { "addressComponents.longText": location },
//         { "addressComponents.longText": { $regex: `${location}\\(` } }
//       ];
//     }

//     if (weekday) {
//       const dayNumber = parseInt(weekday);
//       if (isNaN(dayNumber) || dayNumber < 0 || dayNumber > 6) {
//         return res.status(400).json({ message: "Invalid weekday parameter" });
//       }
//       query['regularOpeningHours.periods'] = {
//         $elemMatch: {
//           'open.day': dayNumber,
//           'close.day': dayNumber
//         }
//       };
//     }

//     const result = await collection.find(query).toArray();

//     if (result.length > 0) {
//       res.json(result);
//     } else {
//       res.status(404).json({ message: "No matching data found" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   } finally {
//     await client.close();
//   }
// });







app.get("/api/categories/:categories", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("recycle");
    const collection = database.collection("place_detail");

    const { categories } = req.params;
    const categoriesArray = categories.split(",");

    const result = await collection
      .find({
        category: { $in: categoriesArray },
      })
      .toArray();

    if (result.length > 0) {
      res.json(result);
    } else {
      res
        .status(404)
        .json({ message: "Addresses not found for the given categories" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await client.close();
  }
});



app.post("/getClassify", upload.single("image"), async (req, res) => {
  try {
    const imageBuffer = req.file.buffer;
    const image = await resizeImage(imageBuffer);
    const answer = await generateContent(image);
    res.json({ result: answer });
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

async function resizeImage(imageBuffer) {
  //   const imageBuffer = await fs.readFile(imagePath);
  const resizedImageBuffer = await sharp(imageBuffer)
    .resize(400) // 設定縮小圖片的寬度，保持縱橫比
    .toBuffer();
  return resizedImageBuffer.toString("base64");
}

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );

//     // console.log(result.insertedIds);
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
