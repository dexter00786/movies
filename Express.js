const express = require("express"); // import export module
const app = express(); //stores object returned by express function()
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const fsp = require("fs").promises;

app.use(bodyParser.json());
app.use(cors());

// function to update file
const updateFileOne = (array, message, res) => {
  fs.writeFile("movies.json", JSON.stringify(array), (err) => {
    if (err != null) {
      res.send({ message: "there is an error!" });
    }
    res.send({ message: message });
  });
};

const updateFileTwo = async (array) => {
  let flag;
  await fsp
    .writeFile("movies.json", JSON.stringify(array))
    .then(() => {
      flag = true;
    })
    .catch((err) => {
      console.log(err);
      flag = false;
    });
  return flag;
};

//reading files
const moviesJson = fs.readFileSync("movies.json", { encoding: "utf-8" });
let movies = JSON.parse(moviesJson);

//get all movies
app.get("/api/v1/movies", (req, res) => {
  res.send(movies);
});

// get movies by id
app.get("/api/v1/movies/:id", (req, res) => {
  let movie = movies.find((ele) => {
    return ele.id == req.params.id;
  });
  // check for movie
  if (movie == undefined) {
    res.send({ message: "Movie not found" });
  }
  res.send(movie);
});

// post movies (add movie to the list)
app.post("/api/v1/movies", async (req, res) => {
  let movie = req.body;
  movies.push(movie);
  let status = await updateFileTwo(movies);
  if (status) {
    res.send({ message: "Movie has been successfully added!" });
  } else {
    res.send({ error: "There is an error while adding movie!" });
  }
});

// delete a movie by id
app.delete("/api/v1/movies/:id", async (req, res) => {
  let id = req.params.id;
  let movie = movies.forEach((ele, index) => {
    if (ele.id == id) {
      movies.splice(index, 1);
    }
  });
  let status = await updateFileTwo(movies);
  if (status) {
    res.send({ message: "Movie has been successfully deleted!" });
  } else {
    res.send({ error: "There is an error while deleting movie!" });
  }
});

//update an existing movie
app.put("/api/v1/movies/:id", async (req, res) => {
  let id = req.params.id;
  let movie = req.body;
  movies.forEach((ele, index) => {
    if (ele.id == id) {
      ele.name = movie.name;
      ele.revenue = movie.revenue;
    }
  });
  let status = await updateFileTwo(movies);
  if (status) {
    res.send({ message: "Movie has been successfully updated!" });
  } else {
    res.send({ error: "There is an error while updating movie!" });
  }
});

const port = 3000;

app.listen(port, () => {
  console.log("Server is runnning"); //creating a server on port 3000
});
