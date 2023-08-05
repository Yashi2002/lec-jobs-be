const express = require("express");
const fs = require("fs");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { type } =require("os");
const bodyParser = require("body-parser");

app.use(cors()); //middleware
app.use(bodyParser.json());

const PORT = 5000;

//mongodb connection string
const mongoDbURI = "mongodb://127.0.0.1:27017/lec";
mongoose.connect(mongoDbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password : String,
  fullname: String,
  title: String,
  skills: [{ type: String }],
  address: String,
  job_type: String,
  id: Number,
  is_active: Boolean,
  followers: [{ type: String }],
  followings: [{ type: String }],
});

const User = mongoose.model("user", userSchema);

const postsSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  job_type: String,
  pay_rate_per_hr_dollar: Number,
  skills: [{ type: String }],
  liked_by: [{ type: String }],
  viewed_by: [{ type: String }],
  id: Number,
  user_id: Number,
  post_by_username: String,
  post_by_fullname: String,
  post_date: Number,
  comments: [{ type: String }],
});

const Post = mongoose.model("posts", userSchema);

// Post.create({
//   title: "PHP Developer Required",
//   description: "For a client project PHP Developer is required",
//   location: "Kathmandu",
//   job_type: "Full Time",
//   pay_rate_per_hr_dollar: 10.0,
//   skills: ["PHP", "JS", "HTML"],
//   liked_by: ["test111", "test1", "test123"],
//   viewed_by: ["test111", "test1", "test123"],
//   id: 2,
//   user_id: 1,
//   post_by_username: "s1",
//   post_by_fullname: "Test User",
//   post_date: "2023-06-10T09:24:07.659034",
//   comments: [],
// }).then(() => {
//   console.log("Post Created");
// });

app.get("/", (req, res) => {
  res.status(200).send("This is response from BE");
});

app.get("/api/v1/posts", (req, res) => {
  const posts = fs.readFileSync("./data/posts.json", "utf-8").toString();
  res.status(200).send(posts);
});

app.get("/api/v1/user", async (req, res) => {
  const user = await User.find({id : 1});
  // const user = fs.readFileSync("./data/user.json", "utf-8").toString();
  res.status(200).send(user[0]);
});

app.post("/api/v1/user", async (req, res) => {
  const lastUser = await User.findOne({}, null, { sort: { id: -1 } });

  const {username, email, fullname, title, job_type, skills, address, password} = req.body;
  let id = 1;
  if (lastUser) {
    id = lastUser.id + 1;
  }
  const newUser ={
    email,
    username,
    fullname,
    title,
    skills,
    address,
    job_type,
    id,
    password,
    is_active: true,
    followers: [],
    followings: [],
};
  User.create(newUser).then((createdUser) => {
    console.log("User Created");
    res.status(200).send(createdUser);
  });
});

app.listen(PORT, () => {
  console.log("App is running on port" + PORT);
});
