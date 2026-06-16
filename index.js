const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 3000;
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

//middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://simpleBDUser:G1IZ3CaednRqVAwu@cluster0.uhofepr.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userDB = client.db("user");
    const userCollection = userDB.collection("users");

    // get data server
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // get single user data by id
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      console.log("need user with id");
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    // add database related apis here
    app.post("/users", async (req, res) => {
      console.log("hitting the users post api");
      const newUser = req.body;
      console.log("user info", newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    // delete data from the database
    app.delete("/users/:id", async (req, res) => {
      console.log(req.params.id);
      console.log("delete a user form database");
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`simple curd server is running ${port}`);
});
