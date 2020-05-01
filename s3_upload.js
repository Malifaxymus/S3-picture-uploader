const AWS = require('aws-sdk');
const fs = require('fs');
const https = require('https');
const fetch = require('node-fetch');

AWS.config.update({region: 'FILL_IN'});

s3 = new AWS.S3({apiVersion: '2006-03-01'});

let bucketDir = 'FILL_IN'; //name of your s3 bucket
let totalPics = 0; //number of pictures
let size = 'WIDTH/HEIGHT'; // width/height

let upload = () => {
  for (let i = 0; i < totalPics; i++) {
    console.log(idArr[i], '====>', i)
    https.get('https://i.picsum.photos/id/' + idArr[i] + '/' + size + '.jpg', res => {

      res.pipe(fs.createWriteStream('img.jpg'))
      let img = fs.createReadStream('./img.jpg')

      var uploadParams = {Bucket: bucketDir, Key: (i+1)+'', Body: img};

      s3.upload (uploadParams, function (err, data) {
        if (err) {
          console.log("Error", err);
        } if (data) {
          console.log("Upload Success", data.Location);
        }
      })
    })
  }
}

let idArr = [];

let populate = (page = 1) => {
  fetch('https://picsum.photos/v2/list?page=' + page + '&limit=100', {
    method: 'GET'
  })
    .then(res => res.json())
    .then(res => {
      res.forEach(x => {
        idArr.push(x.id)
      })
      if (idArr.length < totalPics) {
        populate(page + 1)
      } else {
        upload();
      }
    })
    .catch(err => console.error(err))
}
populate()


