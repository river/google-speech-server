var http = require('http');
var fs = require('fs');
var request = require('request');
var multer = require('multer');
var express = require('express');

var app = express();
var done = false;

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// app.get('/', function(request, response) {
//   response.send('Hello World!');
// });
//

app.use(multer({
  dest: './uploads/',
  // rename: function (fieldname, filename) {
  //   return filename+Date.now();
  // },
  onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...')
  },
  onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path)
    done=true;
  }
}));

app.post('/', function (req, res) {
  if (done == true) {
    var uploadFilePath = req.files.upload.path;

    var options = {
      url: 'https://www.google.com/speech-api/v2/recognize?output=json&lang=en-us&key=AIzaSyBNVzWlZz4ASZjwFIUyKnfYCIpD1zuAuUM',
      headers: {
        'Content-Type': 'audio/l16; rate=16000'
      }
    }

    fs.createReadStream(uploadFilePath).pipe(request.post(options, function (err, httpRes, body) {
      if (err) {
        return console.error('upload failed: ', err);
      }

      body = body.replace('{"result":[]}\n','');
      console.log('response: ' + body);
      res.end(body);
    }));

  }
});

app.get('/', function (req, res) {
  res.end("hello world");
});

/*Run the server.*/
// app.listen(80,function(){
//   console.log("Working on port 8080");
// });

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
