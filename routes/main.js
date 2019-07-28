const route = require("express").Router();
const axios = require("axios");

//to render index.js from views folder
route.get("/", (req, res) => {
  res.render("index");
});

//function to  get github account info in the form of metadata
function parseData(response, user) {
  var checkLang = {};  //language array
  const metadata = response.reduce(
    function(acc, currentItem) {    //total stars on github profile
      acc.stargazers_count += currentItem.stargazers_count;
      if (checkLang[currentItem.language]) {
        checkLang[currentItem.language] = checkLang[currentItem.language] + 1;
      } else {
        checkLang[currentItem.language] = 1;
      }
      return acc;
    },
    { stargazers_count: 0 }
  );

  metadata["languages"] = Object.keys(checkLang).map(item => {
    return {
      value: (checkLang[item] / response.length) * 100,
      title: item
    };
  });

  metadata["mainlanguage"] = Object.keys(checkLang).reduce(function(a, b) {
    return checkLang[a] > checkLang[b] ? a : b;
  });

  if (metadata.stargazers_count > 1000) {
    metadata["artist"] = {
      id: "gaitonde",
      character: "Gaitonde",
      desc: "You are the King! You are respected by everyone, good at what you do. You take up any given job with dedication and are praised for it. King in the north!"
    };
  }
  else if (metadata.stargazers_count > 250 && user.followers > 25) {
    metadata["artist"] = {
      id: "tripathi",  //used img of same id
      character: "Kaleen Bhaiya",
      desc: "People follow you in masses and look up to you as a Icon, You are The Bahubali Kaleen Bhaiya of the tech world. "
    };
  }
   else if (metadata.languages.length > 4) {
    metadata["artist"] = {
      id: "newton",
      character: "Newton",
      desc: "A man who knows multiple languages, you can be a jack of all trades. You are man to watch out for."
    };
  }
  else if (metadata.languages.length <= 3 && metadata.stargazers_count > 50) {
    metadata["artist"] = {
      id: "guddu",
      character: "Guddu Pandit",
      desc: 'You seem to be the master of the domain you like, and would want to pursue it further'
    };
  }
  else {
    metadata["artist"] = {
      id: "bablu",
      character: "Bablu Pandit",
      desc: "'You are a mysterious person. You don\'t like to share much, and are very reserved. Go out and shine!'"
    };
  }
  metadata.avatar = response[0].owner.avatar_url;
  metadata.increment = metadata.stargazers_count / 10 > 0 ? metadata.stargazers_count / 10 : 1;
  metadata.follow = user.followers / 10 > 0 ? user.followers / 10 : 1;
  metadata.repos = user.public_repos / 10 > 0 ? user.public_repos / 10 : 1;
  return metadata;
}

route.get("/:id", function(req, res) {
  axios
    .get("https://api.github.com/users/" + req.params.id)
    .then(user => {
      axios
        .get("https://api.github.com/users/" + req.params.id + "/repos")
        .then(response => {
          var getMetadata = parseData(response.data, user.data);

          res.render("private", {
            response: response.data,
            user: user.data,
            metadata: getMetadata
          });
        })
        .catch(e => {
          console.log(e);
          res.render("404");
        });
    })
    .catch(e => {
      console.log(e);
      res.render("404");
    });
});

exports = module.exports = route;
