import 'babel-polyfill'
import Parse from 'parse'

Parse.initialize("X7EtnKlIJ1bOE5EBELVGUuKg5vC5f5k1xNSyDq66", "G2Z7m0l5tA5FHjbIThzeJW3Kl5N0maUmVR7rAbE6");

var Trainer = Parse.Object.extend("Trainer");

var ash = new Trainer();
var query = new Parse.Query(Trainer);

ash.save({ name: "Ash", pokemon: "Pikachu", cities: ["Biancavilla"] })
.then(
  function(result) {
    ash.set("badges", 3);
    ash.increment("badges", 2);
    ash.add("cities", "Smeraldopoli");
    ash.set("pokemon", "Charizard");
    ash.unset("score");
    return ash.save();
  },
  function(model, error) {
    console.log("instance drama");
  }
)
.then(
  function(result) {
    var query = new Parse.Query(Trainer);
    query.ascending("createdAt");
    return query.find();
  },
  function(model, error) {
    console.log("class drama");
  }
)
.then(
  function(results) {
    if (results.length > 8) {
      var resultsToRemove = results.slice(8);
      for(var i=0; i < resultsToRemove.length; i++) {
        var resultToRemove = resultsToRemove[i];
        resultToRemove.destroy()
        .then(
          function(result) {
          },
          function(model, error) {
            console.log("nooouuohouu");
          }
        );
      }
    }
  },
  function(model, error) {
  }
);

var Pokemon = Parse.Object.extend("pokemons1");
var charizard = new Pokemon();

var pokequery = new Parse.Query(Pokemon);
pokequery.equalTo("name", "Charizard");
pokequery.find()
.then(
  function(result) {
    console.log(result[0].get("image"));
  },
  function(model, error) {
    console.log("pokedrama");
  }
);
