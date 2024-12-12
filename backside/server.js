const express = require("express");
const cors = require("cors");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use("/images", express.static("public/images"));
app.use(express.json());
app.use(cors());
const mongoose = require("mongoose");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

mongoose
  .connect(
    "mongodb+srv://Courtney-H:g1KJpdlYINPWYtyc@sfbd.pc575.mongodb.net/?retryWrites=true&w=majority&appName=SFBD"
  )
  .then(() =>{
    console.log("Connect to mongodb")
  })
  .catch((error) => {
    console.log("Couldn't connect to mongodb", error)
  });

app.get('/', (req, res)=> {
    res.sendFile(__dirname + "/index.html");
});

const puppySchema = new mongoose.Schema({
  name: String,
  gender: String,
  description: String,
  img: String,
});

const Puppy = mongoose.model("Puppy", puppySchema);


  
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/api/puppies", async (req, res) => {
  const puppies = await Puppy.find();
  res.send(puppies);
});

app.get("/api/puppies/:id", async (req, res) => {
  const puppy = await Puppy.findOne({ _id: id });
  res.send(puppy);
});

app.post("/api/puppies", upload.single("img"), async (req, res) => {
  const result = validatePuppy(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const puppy = new Puppy({
    name: req.body.name,
    gender: req.body.gender,
    description: req.body.description,
  });

  if (req.file) {
    puppy.img = "images/" + req.file.filename;
  }

  const newPuppy = await puppy.save();
  res.send(newPuppy);
});

app.put("/api/puppies/:id", upload.single("img"), async (req, res) => {
  const result = validatePuppy(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  let fieldsToUpdate = {
    name: req.body.name,
    gender: req.body.gender,
    description: req.body.description,
  
  };

  if (req.file) {
    fieldsToUpdate.img = "images/" + req.file.filename;
  }

  const wentThrough = await Puppy.updateOne(
    { _id: req.params.id },
    fieldsToUpdate
  );

  const updatedPuppy = await Puppy.findOne({ _id: req.params.id });
  res.send(updatedPuppy);
});

app.delete("/api/puppies/:id", async (req, res) => {
  const puppy = await Puppy.findByIdAndDelete(req.params.id);
  res.send(puppy);
});

  


const validatePuppy = (puppy) => {
  const schema = Joi.object({
    _id: Joi.allow(""),
    name: Joi.string().min(2).required(),
    gender: Joi.string().min(2).required(),
    description: Joi.string().min(2).required(),
  });

  return schema.validate(puppy);
};


app.listen(3001, () => {
    console.log("im listening");
});