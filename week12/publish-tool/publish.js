let http = require("http");
let querystring = require("querystring");
let fs = require("fs");
let archiver = require("archiver");
let child_process = require("child_process");

http
  .createServer(function(req, res) {
    let query = querystring.parse(req.url.match(/^\/\?([\s\S]+)$/)[1]);
    // console.log("query=", query);
    publish(query.token);
  })
  .listen(8083);

function publish(token) {
  console.log("from publish=", token);
  let request = http.request(
    {
      hostname: "127.0.0.1",
      // port: 8882,
      port: 8082,
      path: "/publish?token=" + token,
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream"
        //   "Content-Length": stats.size
      }
    },
    response => {
      console.log("reponse from publish", response.statusCode);
    }
  );

  const archive = archiver("zip", {
    zlib: { level: 9 }
  });

  archive.directory("./sample", false);
  archive.finalize();
  archive.pipe(request);
}
