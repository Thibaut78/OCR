var express = require('express');
var router = express.Router();
var tesseract = require('node-tesseract-ocr');
//const tesseract = require("node-tesseract")
 

/* GET home page. */
router.get('/', function(req, res, next) {
 
  
  const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
  }
  var result;
  tesseract.recognize("image.png", config)
    .then(text => {
      result = text;
      console.log("-------OCR RESULT-------");      
      console.log(text);
      console.log("------------------------");
    })
    .catch(error => {
      console.log(error.message)
    })

  res.render('index', { title: "Resultat dans la console" });
});

module.exports = router;
