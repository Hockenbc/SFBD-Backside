const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.static("public"));
app.use(cors());

app.get('/', (req, res)=> {
    res.sendFile(__dirname + "/index.html");
});

app.get("/api/puppies", (req, res) => {
    const puppies = [
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
    res.send(puppies);
});

app.listen(3001, () => {
    console.log("im listening");
});