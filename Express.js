const express = require("express"); // import export module
const app = express(); //stores object returned by express function()
const bodyParser = require("body-parser");
const fs = require("fs");

app.use(bodyParser.json());

// function to update file
const updateFile = (array, message, res) => {
  fs.writeFile("movies.json", JSON.stringify(array), (err) => {
    if (err != null) {
      res.send({ message: "there is an error!" });
    }
    res.send({ message: message });
  });
};

//reading files
const moviesJson = fs.readFileSync("movies.json", { encoding: "utf-8" });
let movies = JSON.parse(moviesJson);

//get all movies
app.get("/movies", (req, res) => {
  res.send(movies);
});

// get movies by id
app.get("/movies/:id", (req, res) => {
  let movie = movies.find((ele) => {
    return ele.id == req.params.id;
  });
  // check for movie
  if (!movie) {
    res.send({ message: "Movie not found" });
  }
  res.send(movie);
});

// post movies (add movie to the list)
app.post("/movies", (req, res) => {
  let movie = req.body;
  movies.push(movie);
  updateFile(movies, "Movie has been successfully added!", res);
});

// delete a movie by id
app.delete("/movies/:id", (req, res) => {
  let id = req.params.id;
  movies.forEach((ele, index) => {
    if (ele.id == id) {
      movies.splice(index, 1);
    }
  });
  updateFile(movies, "Movie has been successfully deleted", res);
});

const port = 3000;

app.listen(port, () => {
  console.log("Server is runnning"); //creating a server on port 3000
});
