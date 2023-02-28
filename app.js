const express = require('express');
const bodyParser = require('body-parser');
const qr_code = require('qrcode');
const app = express();

app.set('view engine','ejs');
app.set('views','views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

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
          var file_path = "images/"+ Date.now() +".png";
          qr_code.toFile(file_path,url,{
            color:{
                dark: '#000',
                light: '#0000'
            }

          }) ;
          res.render('index',{QR_code:src,img_src: file_path})
        })

    }
    else{
        console.log("URL Not Set");
    }
})

app.get('/download' , (req,res)=> {
    res.download(req.query.file_path);
})
app.listen(3000, ()=>{
    console.log("Server Live At 3000");
})

module.exports = app;