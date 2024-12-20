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

let puppies = [
  {
      _id: 1,
      img_name: "images/charlotte.jpg",
      name: "Charlotte",
      gender: "Female",
      description: "Gentle and affectionate, Charlotte loves cuddling and being close. She’s calm and easygoing, always happy to be by your side."
  },

  {
    _id: 2,
    img_name: "images/geneva.jpg",
    name: "Geneva",
    gender: "Female",
    description: "Curious and energetic, Geneva loves exploring new places. She’s playful and always up for a fun outing or adventure."
  },

  {
    _id: 3,
    img_name: "images/london.jpg",
    name: "London",
    gender: "Female",
    description: "London is playful and lovable, winning everyone over with her cute antics. She enjoys being the center of attention and showing off her tricks."
  },

  {
    _id: 4,
    img_name: "images/phoenix.jpg",
    name: "Phoenix",
    gender: "Female",
    description: "Phoenix is confident and protective, always keeping an eye on things. She’s a natural leader but also loves some quiet time with her favorite people."
  },

  {
    _id: 5,
    img_name: "images/savannah.jpg",
    name: "Savannah",
    gender: "Female",
    description: "Savannah is relaxed and laid-back, happiest when lounging or napping. She brings a sense of calm and is perfect for a peaceful home."
  },

  {
    _id: 6,
    img_name: "images/sydney.jpg",
    name: "Sydney",
    gender: "Female",
    description: "Sydney is full of energy and always ready for a game. She’s fun-loving and will keep you entertained with her lively personality."
  }
];

app.get("/api/puppies", (req, res) => {
res.send(puppies);
});

app.post("/api/puppies", upload.single("img"), (req, res) => {
const result = validatePuppy(req.body);

if (result.error) {
res.status(400).send(result.error.details[0].message);
return;
}

const puppy = {
_id: puppies.length + 1,
name: req.body.name,
gender: req.body.gender,
description: req.body.description,
img_name: "images/" + req.file.filename,
};

if (req.file) {
puppy.img_name = "images/" + req.file.filename;
}

puppies.push(puppy);
res.status(200).send(puppy);
});

app.put("/api/puppies/:id", upload.single("img"), (req, res) => {
let puppy = puppies.find((p) => p._id === parseInt(req.params.id));

if (!puppy) res.status(400).send("Puppy with given id was not found");

const result = validatePuppy(req.body);

if (result.error) {
res.status(400).send(result.error.details[0].message);
return;
}

puppy.name = req.body.name;
puppy.gender = req.body.gender;
puppy.description = req.body.description;

if (req.file) {
puppy.main_image = "images/" + req.file.filename;
}

res.send(puppy);

});

app.delete("/api/houses/:id", (req, res) => {
const puppy = puppies.find((p) => p._id === parseInt(req.params.id));

if (!puppy) {
res.status(404).send("The puppy with the given id was not found");
}

const index = puppies.indexOf(puppy);
puppies.splice(index, 1);
res.send(puppy);

});

  
// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

// app.get("/api/puppies", async (req, res) => {
//   const puppies = await Puppy.find();
//   res.send(puppies);
// });

// app.get("/api/puppies/:id", async (req, res) => {
//   const puppy = await Puppy.findOne({ _id: id });
//   res.send(puppy);
// });

// app.post("/api/puppies", upload.single("img"), async (req, res) => {
//   const result = validatePuppy(req.body);

//   if (result.error) {
//     res.status(400).send(result.error.details[0].message);
//     return;
//   }

//   const puppy = new Puppy({
//     name: req.body.name,
//     gender: req.body.gender,
//     description: req.body.description,
//   });

//   if (req.file) {
//     puppy.img = "images/" + req.file.filename;
//   }

//   const newPuppy = await puppy.save();
//   res.send(newPuppy);
// });

// app.put("/api/puppies/:id", upload.single("img"), async (req, res) => {
//   const result = validatePuppy(req.body);

//   if (result.error) {
//     res.status(400).send(result.error.details[0].message);
//     return;
//   }

//   let fieldsToUpdate = {
//     name: req.body.name,
//     gender: req.body.gender,
//     description: req.body.description,
  
//   };

//   if (req.file) {
//     fieldsToUpdate.img = "images/" + req.file.filename;
//   }

//   const wentThrough = await Puppy.updateOne(
//     { _id: req.params.id },
//     fieldsToUpdate
//   );

//   const updatedPuppy = await Puppy.findOne({ _id: req.params.id });
//   res.send(updatedPuppy);
// });

// app.delete("/api/puppies/:id", async (req, res) => {
//   const puppy = await Puppy.findByIdAndDelete(req.params.id);
//   res.send(puppy);
// });

  


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