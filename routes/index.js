var express = require('express');
var router = express.Router();
var tesseract = require('node-tesseract-ocr');
//const tesseract = require("node-tesseract")
 







/* GET home page. */
router.get('/', function(req, res, next) {
 

  const csvFilePath='./RelevéBancaire.csv'
  const csv=require('csvtojson')
  csv()
  .fromFile(csvFilePath)
  .then((jsonObj)=>{
    console.log(jsonObj);
  })
 
  // Async / await usage
  const jsonArray= csv().fromFile(csvFilePath);
  
  const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
  }
  var result;
  tesseract.recognize("image1.png", config)
    .then(text => {
      result = text;

      //console.log(text);

      const words = text.split(' ');
      last = 'start';
      value = 0;
      words.forEach(element => {
        if (last == 'Facture')
          value = element.replace(new RegExp("[^(0-9\.)]", "g"), '');
        last = element;
        //console.log(element + " " + last);
      });
      /*
      console.log(" ");
      console.log("-------OCR RESULT-------");      
      console.log("Prix indiquer sur le ticket de caisse: "+ value);
      console.log("------------------------");

        */
      //console.log(error.message)
    })


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

      console.log(" ");
      console.log("-------OCR RESULT-------");      
      console.log("Prix indiquer sur le ticket de caisse: "+ value);
      console.log("------------------------");


      //console.log(error.message)
    })
    
    tesseract.recognize("impot2.png", config)
    .then(text => {
      result = text;

      console.log(text);

      const words = text.split(' ');
      last = 'start';
      value = 0;
      words.forEach(element => {
        if (last == '12')
          value = element.replace(new RegExp("[^(0-9\.)]", "g"), '');
        last = element;
        //console.log(element + " " + last);
      });

      console.log(" ");
      console.log("-------OCR RESULT-------");      
      console.log("Prix indiquer sur le ticket de caisse: "+ value);
      console.log("------------------------");


      //console.log(error.message)
    })


  res.render('index', { title: "Resultat dans la console" });
});

module.exports = router;
