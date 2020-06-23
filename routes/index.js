var express = require('express');
var router = express.Router();
var tesseract = require('node-tesseract-ocr');
//const tesseract = require("node-tesseract")
 

router.post('/file',  function(req, res, next) {
  console.log("File upload");
  console.log(res);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  const fs = require('fs');
const pdf = require('pdf-parse');
 
let dataBuffer = fs.readFileSync("./IMG_1240.pdf");
 
pdf(dataBuffer).then(function(data) {
 
    // number of pages
    console.log(data.numpages);
    // number of rendered pages
    console.log(data.numrender);
    // PDF info
    console.log(data.info);
    // PDF metadata
    console.log(data.metadata); 
    // PDF.js version
    // check https://mozilla.github.io/pdf.js/getting_started/
    console.log(data.version);
    // PDF text
    console.log(data.text); 
        
});

  const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
  }
  var result;  
  price = 0;

  var Jimp = require('jimp');
 
  // open a file called "lenna.png"
  Jimp.read('impot.png', (err, lenna) => {
    if (err) throw err;
    lenna
      .resize(1000, 1000) // resize
      .quality(100) // set JPEG quality
      //.greyscale() // set greyscale
      .write('impot3.png'); // save
  });

  const imagemagick = require('imagemagick');  

  /*imagemagick.resize({
    srcData: fs.readFileSync('./image4.jpg', 'binary'),
    width:   256
  }, function(err, stdout, stderr){
    //if (err) throw err
    fs.writeFileSync('kittens-resized.jpg', stdout, 'binary');
    console.log('resized kittens.jpg to fit within 256x256px');
  });  */

/* 'image4.jpg',  '-density','300', '-resize', 
            '500%', 'texte-big.png']*/

  tesseract.recognize("image4.jpg", config)
    .then(text => {
      result = text;

      //console.log(text);

      const words = text.split(' ');
      last = 'start';
      value = 0;
      words.forEach(element => {
        if (last == 'PAYER')
          value = element.replace(new RegExp("[^(0-9\.)]", "g"), '');
        last = element;
        //console.log(element + " " + last);
      });

      price = value; 
      console.log(" ");
      console.log("-------OCR RESULT-------");      
      console.log("Prix indiquer sur le ticket de caisse: "+ value);
      console.log("------------------------");


      fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: {
                name: "John",
                email: "john@example.com"
            }
        })
    })

      //console.log(error.message)
    })  
    
    
    const csvFilePath='./RelevéBancaire.csv';
    const csv=require('csvtojson');
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
      console.log(jsonObj.Amount);
      jsonObj.forEach(element => {
        console.log(element);
        var tmp23 = element.Amount;/*.replace(new RegExp("[^(0-9\.)]", "g"), '');*/
        if (price === element.Amount) {
          console.log("##################");
          console.log("##################");
          console.log("##################");
          console.log("Matching with : " + element.Name + " at " + element.Date);
          console.log("##################");
          console.log("##################");
          console.log("##################");
        }
      })
    })

  res.render('index', { title: "Resultat dans la console" });
});

module.exports = router;
