// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const fs = require("fs");
const dotenv = require('dotenv');
const cors = require('cors');


dotenv.config(); // 放在最上方

const app = express();
const PORT = process.env.PORT || 3000;
const uri =process.env.uri;



const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.use(express.json());
// 使用 cors 中間件
app.use(cors());

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

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
