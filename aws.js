var AWS = require('aws-sdk')
var fs = require('fs')
var zlib = require('zlib')
var path = require('path')

let prodFiles = [
  {
    file: 'index.html',
    mime: 'text/html',
  },
  {
    file: 'index.js',
    mime: 'application/javascript',
  },
  {
    file: 'index.js.map',
    mime: 'application/json',
  },
  {
    file: 'favicon.png',
    mime: 'image/png',
  },
]

var s3 = new AWS.S3()

for (let file of prodFiles) {
  var body = fs.readFileSync(path.join('./dist', file.file))
  var params = {Bucket: 'quiddler.joshuacaron.ca', Key: file.file, ACL: 'public-read', Body: body, ContentType: file.mime}

  s3.upload(params, function(err, data) {
    console.log(err, data)
  })
}
