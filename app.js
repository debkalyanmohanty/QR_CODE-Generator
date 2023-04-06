require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const qr_code = require('qrcode');
const app = express();
const multer = require('multer');
const mongoose = require('mongoose');
const Qr = require('./models/QrCode');

app.set('view engine','ejs');
app.set('views','views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


var count = 0;

app.get('/', (req,res,next)=> {
    res.render('index', {
        QR_code: ''
    })
})
app.post('/', (req,res,next)=> {
    const url = req.body.url;
    if(url){
        qr_code.toDataURL(url, (err,src)=>{
          if(err){
            res.send(err);
          }
          
          var file_path = "images/"+ count +".png";
          count++;
          const qr = new Qr({
            imageUrl: file_path
          })
          qr.save()
          .then(result => {
            const fileStorage = multer.diskStorage({
                destination: (req, file, cb) => {
                  cb(null, 'images');
                },
                filename: (req, file, cb) => {
                  cb(null, Date.now() +".png");
                }
              });
              
              app.use(
                multer({storage: fileStorage }).single('image')
              );
          
              qr_code.toFile(result.imageUrl,url,{
                color:{
                    dark: '#000',
                    light: '#0000'
                }
    
              }) ;
              res.render('index',{QR_code:src,img_src: result.imageUrl})
          });
          
        })

    }
    else{
        console.log("URL Not Set");
    }
})

app.get('/download' , (req,res)=> {
    res.download(req.query.file_path);
})
mongoose
.connect(process.env.MONGODB_URI)
.then(result => {
    app.listen(3000);
})
.catch(err => console.log(err));

module.exports = app;