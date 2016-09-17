var AWS = require('aws-sdk')
var fs = require('fs')
var zlib = require('zlib')
var path = require('path')

let prodFiles = ['index.html', 'index.js', 'index.js.map']

var s3 = new AWS.S3()

for (let file of prodFiles) {
  var body = fs.readFileSync(path.join('./dist', file))
  var params = {Bucket: 'quiddler.joshuacaron.ca', Key: file, ACL: 'public-read', Body: body, ContentType: 'text/html'}

  s3.upload(params, function(err, data) {
    console.log(err, data)
  })
}
