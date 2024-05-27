
const uri =
  "mongodb+srv://turtle910407:apple910407@cluster0.a7gll0c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const { MongoClient, ServerApiVersion } = require("mongodb");
const fs = require('fs');
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// 讀取外部 JSON 文件
const jsonData = fs.readFileSync("recycle_data2.json", "utf8");

// 將 JSON 字符串解析為 JavaScript 對象
const dataArray = JSON.parse(jsonData);
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const result = await client
      .db("recycle")
      .collection("place_detail")
      .insertMany(dataArray);
    console.log(
      `${result.insertedCount} documents inserted with the following ids:`
    );
    // console.log(result.insertedIds);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
