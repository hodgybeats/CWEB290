const express = require('express');
const multer = require('multer');
const exphbs = require('express-handlebars');
const app = express();
const PORT = 5000;

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // folder to save
  },
  filename: function (req, file, cb) {
    // Save file with original name + timestamp to avoid conflicts
    // Human Developer friendly file name with extension
    cb(null, Date.now() + '-' + file.originalname);
  }
});


const upload = multer(
    { 
        storage: storage,
        limits: { fileSize: 1024*1024}, // 1MB file size limit
        fileFilter: function (req, file, callbackFunc) {
            if (file.mimetype.startsWith('image/'))
            {
                // file is valid
                return callbackFunc(null, true)
            } else {
                // file is invalid - callback with error message
                callbackFunc("Error: Images only! (jpeg, jpg, png, gif)")
            }
        }
     });

// Configure HBS template engine
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Route to show form - http://localhost:5000/
app.get('/', (req, res) => {
  res.render('form', {
    title: "File Upload"
  });  // loads form.handlebars
});

// Route to handle upload
app.post('/upload', upload.single('myFile'), (req, res) => {
    // debug send success screen
  res.send(`File uploaded successfully: ${req.file.originalname}`);
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});