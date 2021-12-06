let http = require("http");
let https = require("https");
let fs = require("fs");
let unzipper = require("unzipper");
let querystring = require("querystring");

//auth route accept code, code+secret get token
function auth(req, res) {
  let query = querystring.parse(req.url.match(/^\/auth\?([\s\S]+)$/)[1]);
  //console.log("query=", query);
  getToken(query.code, function(info) {
    console.log(JSON.stringify(info));
    res.write(
      `<a href='http://localhost:8083/?token=${info.access_token}' >publish</a>`
    );
    res.end();
  });
}

function getToken(code, callback) {
  let request = https.request(
    {
      hostname: "github.com",
      path: `/login/oauth/access_token?code=${code}&client_id=${client_id}&client_secret=${secret}`,
      port: 443,
      method: "POST"
    },
    function(res) {
      console.log("res.statusCode=", res.statusCode);
      let body = "";
      res.on("data", chunk => {
        body += chunk.toString();
      });

      res.on("end", chunk => {
        callback(querystring.parse(body));
      });
    }
  );

  request.end();
}

function publish(req, res) {
  let query = querystring.parse(req.url.match(/^\/publish\?([\s\S]+)$/)[1]);
  if (query.token) {
    getUser(query.token, function(info) {
      if (info.login === "hheatgithub") {
        req.pipe(unzipper.Extract({ path: "../server/public" }));
        req.on("end", () => {
          res.end("succes");
        });
      }
    });
  }
}
// use toke get user info

function getUser(token, callback) {
  console.log("from getUser token=", token);
  let request = https.request(
    {
      hostname: "api.github.com",
      path: "/user",
      port: 443,
      method: "GET",
      headers: {
        Authorization: `token ${token}`,
        "User-Agent": "toy-publish-my"
      }
    },
    function(res) {
      console.log("res.statusCode=", res.statusCode);
      let body = "";
      res.on("data", chunk => {
        body += chunk.toString();
      });

      res.on("end", chunk => {
        callback(JSON.parse(body));
      });
    }
  );

  request.end();
}

http
  .createServer(function(req, res) {
    console.log("req=", req.url);
    if (req.url.match(/^\/auth\?/)) return auth(req, res);
    if (req.url.match(/^\/publish\?/)) return publish(req, res);
  })
  .listen(8082);
