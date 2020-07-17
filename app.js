const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
var fs=require('fs');
var spawn = require("child_process").spawn;

filepath=path.join(__dirname, './output/sample.txt');


// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('Image');


// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

// Init app
const app = express();

// EJS
app.set('view engine', 'ejs');

// Public Folder
app.use(express.static('./public'));

app.get('/', (req, res) => res.render('welcome'));
app.post('/', (req, res) => {
  res.render('welcome')
});

app.post('/uploadImage', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.render('welcome', {
        msg: err
      });
    } else {
      if(req.file == undefined){
        res.render('welcome', {
          msg: 'Error: No File Selected!'
        });
      } else {
        res.render('submit', {
          msg: 'File Uploaded!',
          file: `uploads/${req.file.filename}`

        });
      }
    }
  });
});

app.post('/uploadanother', (req, res) => {
  res.render('welcome')
});


app.post('/upload/process', (req, res) => {
  var process = spawn('python',["./hello.py",]); 
  process.stdout.on('data', function(data) {
    
      
      res.render('output',{
        
        msg: data,
        
      }  
      );
  })
 
})

     
     
const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));