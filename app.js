const express = require('express');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
dotenv.config();
const { MongoClient } = require('mongodb');


const client = new MongoClient(process.env.DBURI);


// (async () => await client.connect())();


const app = express();

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.set('views', path.join(__dirname,"views"));
app.set('view engine', 'ejs');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
  
        // Uploads is the Upload_folder_name
        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now()+".jpg")
    }
  })
       
// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional
const maxSize = 1 * 1000 * 1000;
    
var upload = multer({ 
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb){
    
        // Set the filetypes, it is optional
        var filetypes = /jpeg|jpg|png/;
        var mimetype = filetypes.test(file.mimetype);
  
        var extname = filetypes.test(path.extname(
                    file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
      
        cb("Error: File upload only supports the "
                + "following filetypes - " + filetypes);
      } 
  
// mypic is the name of file attribute
}).single("mypic");       

app.post("/uploadProfilePicture",function (req, res, next) {
        
    // Error MiddleWare for multer file upload, so if any
    // error occurs, the image would not be uploaded!
    upload(req,res,function(err) {
  
        if(err) {
  
            // ERROR occured (here it can be occured due
            // to uploading image of size greater than
            // 1MB or uploading different file type)
            res.send(err)
        }
        else {
  
            // SUCCESS, image successfully uploaded
            res.send("Success, Image uploaded!")
        }
    })
})

app.get("/",function(req,res){
    res.render("index");
});



app.get('/users', getUsers = async (req, res) => {
    await client.connect();
    const db = client.db(process.env.DB);
    const collection = db.collection('users');

    const result = await collection.find({}).toArray();

    res.json(result);

    client.close();

});

app.post('/users', createUser = async (req, res) => {

    await client.connect();
    const db = client.db(process.env.DB);
    const collection = db.collection('users');

    const doc = req.body;

    const result = await collection.insertOne(doc);

    console.log(`A document was inserted with _id ${result.insertedId}`);

    res.status(200).location(`/users/${result.insertedId}`);

    res.json({status: 'Success'})

    client.close();

});

app.put('/users/:id', updateUser = async (req, res) => {

    await client.connect();
    const db = client.db(process.env.DB);
    const collection = db.collection('users');

        const { name } = req.body;
        const { id } = req.params;

        const doc = {
            $set: {
                'name': name,
            },
        };

    const result = await collection.updateOne({'id': Number(id)}, doc);

        res.json({status: "Success"});

});

app.delete('/users/:id', deleteUser = async (req, res) => {
    await client.connect();
    const db = client.db(process.env.DB);
    const collection = db.collection('users');

    const {id} = req.params;
// console.log({"id": Number(id)});
    await collection.deleteOne({'id': Number(id)});
    res.json({status: "Success"});
});


module.exports = app;

