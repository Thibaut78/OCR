var express = require('express');
var router = express.Router();
var tesseract = require('node-tesseract-ocr'); 

const path = require('path');
const upload = require('./uploadMiddleware');
const Resize = require('./Resize');

const fs = require('fs');
const pdf = require('pdf-parse');

const csvFilePath='./RelevéBancaire.csv';
const csv=require('csvtojson');

function getCsv(name) {
  var csvobj = [];
  //const csvFilePath='./RelevéBancaire.csv';
        csv()
        .fromFile(csvFilePath)
        .then((jsonObj)=>{
          jsonObj.forEach(element => {
            console.log(element.Amount);
            var tmp = element.Name + " - " + element.Amount;

            csvobj.push(tmp);
            })

    console.log(csvobj);
  return(csvobj);
        })
  console.log(csvobj);
  return(csvobj);
}

const lineReader = require('line-reader');
var toJSON = require('plain-text-data-to-json')

function readlog(){ 
  var doc = fs.readFileSync('log.txt', 'utf8'); 
  var data = toJSON(doc);
  console.log(data);
  return (data);
}

function savetab(line2add) {

lineReader.eachLine('log.txt', function(line) {
  if (line === line2add) {
    return (false);
  }
  console.log(line);
});
var logger = fs.createWriteStream('log.txt', {
  flags: 'a' // 'a' means appending (old data will be preserved)
})
  
logger.write(line);
return (true);
}

function getRes(name) {   
  /*let dataBuffer = fs.readFileSync("./IMG_1240.pdf");
   
  pdf(dataBuffer).then(function(data) {
      console.log(data.numpages);  // number of pages
      console.log(data.numrender);  // number of rendered pages
      console.log(data.info);  // PDF info
      console.log(data.metadata); // PDF metadata
      console.log(data.version);  // PDF.js version
      console.log(data.text);  // PDF text
  });*/
  
    const config = {
      lang: "eng",
      oem: 1,
      psm: 3,
    }

    var res;
    var result;  
    price = 0;
  
    /*var Jimp = require('jimp');   
    // open a file called "lenna.png"
    Jimp.read('impot.png', (err, lenna) => {
      if (err) throw err;
      lenna
        .resize(1000, 1000) // resize
        .quality(100) // set quality
        .write('impot_resize.png'); // save
    })*/    
  
    tesseract.recognize("./upload/" + name, config)
      .then(text => {
        result = text;  
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
      
      
        const csvFilePath='./RelevéBancaire.csv';
        csv()
        .fromFile(csvFilePath)
        .then((jsonObj)=>{
          //console.log(jsonObj.Amount + " json");
          jsonObj.forEach(element => {
            console.log(element.Amount);
            //console.log(price);
            //var tmp23 = element.Amount;/*.replace(new RegExp("[^(0-9\.)]", "g"), '');*/
            if (price === element.Amount) {
              console.log("##################");
              console.log("##################");
              console.log("##################");
              console.log("Matching with : " + element.Name + " at " + element.Date);
              tmp = "Matching with : " + element.Name + " at " + element.Date;
              //Res = tmp;
              console.log("##################");
              console.log("##################");
              console.log("##################");
              //res = [tmp, "Facture 23.4€"];
              res = [element.Name , "Facture 23.4€"];
              return (res);
              console.log(res);
            }
          })
        }) 
      })
      console.log(res);
      //res = ["Facture 12€", "Facture 23.4€"];
      return (res);
}

router.post('/file', upload.single('image'), async function (req, res) {
  var Res;
  //const imagePath = path.join(__dirname, 'upload');
  const imagePath = '/home/cg/Bureau/stage/ocr/ocr/upload'
  const fileUpload = new Resize(imagePath);
  if (!req.file) {
    res.status(401).json({error: 'Error'});
  }
  const filename = await fileUpload.save(req.file.buffer);

  Res = getRes(filename);
  var csv = getCsv('./RelevéBancaire.csv');
  //Res = ["Facture 12€", "Facture 23.4€"];
  console.log(Res);
  //return res.render(200).json({ name: filename, Resultat: Res});
  return res.render('index', { title: "Resultat dans la console", Resultat: Res, csv: csv});
  return res.render('index', { title: "Resultat dans la console", Resultat: ["Facture 12€", "Facture 23.4€"] });
});

/*router.post('/files',  function(req, res, next) {
  console.log("File upload");
  console.log(res);
});*/

router.get('/', function(req, res, next) {
  
  var csv = getCsv('./RelevéBancaire.csv');
  res.render('index', { title: "Resultat dans la console", Resultat: " ", csv: csv});
  //res.render('index', { title: "Resultat dans la console"});
});

module.exports = router;
