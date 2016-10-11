// run this in the command line: node download_avatars.js lighthouse-labs laser_shark

var request = require("request");
var fs = require("fs");
require('dotenv').config();

var repoOwner = process.argv[2];
var repoName = process.argv[3];


function getRepoContributors(repoOwner, repoName, cb) {

  var url = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors";

  var info = {
    url: url,
    method: "GET",
    headers: {
      'user-agent': 'request',
      'Authorization': 'token ' + process.env.GITTOKEN // token must be saved in dotenv.
    }
  }

  request(info, cb);
}


function downloadImageByURL(url, filePath) {
    
  request(url).pipe(fs.createWriteStream(filePath));
  console.log("The file was saved!")

}


// CALLBACK FUNCTION
var cb = function(err, response, data) {

  if (err) {
    throw err;
    console.log("Errors: ", err);
  }

  data = JSON.parse(data);

  // GET all avatar_urls - put into an array
  avatarURLs = [];
  data.forEach(function(item){
    avatarURLs.push(item.avatar_url);
  });

  // DOWNLOAD each image, save files in a folder
  i=0;

  avatarURLs.forEach(function(item) {
    downloadImageByURL(item, "avatar-images/image" + i + ".jpeg");
    i++;
  });
}

getRepoContributors(repoOwner, repoName, cb);



