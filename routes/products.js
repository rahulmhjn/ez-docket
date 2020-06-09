var express = require('express');
var router = express.Router();
var Product = require('../models/product');
bodyParser = require('body-parser');
router.use(bodyParser.json());

     router.use(bodyParser.urlencoded({ extended: true }));

const multer  = require('multer');
const gridFsStorage = require('multer-gridfs-storage');
const grid = require("gridfs-stream");
const mongoose = require('mongoose');


const mongoURI = "mongodb+srv://qwerty:rahul6912@cluster0-aisct.mongodb.net/ez?retryWrites=true&w=majority";
//Mongo connection
const conn = mongoose.createConnection(mongoURI,{ 
    useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true 
 });
//Initialize gfs
let gfs;

conn.once("open", () => {
    //init stream
    gfs = grid(conn.db, mongoose.mongo);
    gfs.collection("pimg");
});
//Create Storage Engine
const storage = new gridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = file.originalname;
            const fileInfo = {
                filename: filename,
                bucketName: "pimg"
            }
            resolve(fileInfo);
        });

    }
});

const upload = multer({ storage: storage });


router.get('/',(req,res) => {
    var noMatch = null;
    // eval(require('locus'));
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Product.find({$or: [{name: regex,}, {technologies: regex}, {"author.username":regex}]}, function(err,prod){
            if(err){
                console.log(err);
            }
            else{
               
                if(prod.length < 1){
                    noMatch="Product is unavailable";
                }
                res.render("products",{products:prod, noMatch: noMatch});
            }
        })
        .populate('author')
        .populate('author.username');
    
    }else{
    Product.find({}, function(err,prod){
        if(err){
            console.log(err);
        }
        else{
            res.render("products",{products:prod,noMatch: noMatch})
        }
    })
    .populate('author')
}
});

router.get('file/:filename',(req,res)=> {
    gfs.files.findOne({filename: req.params.filename},(err,file) => {
        if(!file || file.length === 0){
            return res.status(404).json({
                err: 'No file exists'
            })
        }
        return res.json(file);
    })
})

router.get('/image/:filename',(req,res)=> {
    gfs.files.findOne({filename: req.params.filename},(err,file) => {
        if(!file || file.length === 0){
            return res.status(404).json({
                err: 'No file exists'
            })
        }
        if(file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            //Read op to browser
            var readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        } else {
            res.status(404).json({
                err: 'Not an image'
            })
        }
    })
})


router.get('/add',(req,res) => {
    let errors=[];
    let name = technologies = price = '';
    res.render('add',{
        errors,
        name,
        technologies,
        price
    });
});

router.post('/add',upload.single('file'),(req,res) => {
    // let { name,technologies,price } = req.body;
    req.body.author=req.user._id;
    // req.body.pimg.fileId = req.file._id;
    // req.body.pimg.fileName = req.file.filename;
    req.body.pimg={
        fileId:req.file.id,
        fileName:req.file.filename
    }
    let errors=[];
    //validation checks
    if(!req.body.name){
        errors.push({ text: "Please add a name" });
    }
    if(!req.body.technologies){
        errors.push({ text: "Please add some technologies" });
    }
    if(!req.body.price){
        errors.push({ text: "Please add a price" });
    }

    let name = req.body.name;
    let price = req.body.price;
    let technologies = req.body.technologies;

    //insert into table
    if(errors.length > 0){
        res.render('add',{
            errors,
            name,
            price,
            technologies
        });
    } else{
        // if(!req.body.price) {
        //     req.body.price = "Unknown";
        // } else {
        //     req.body.price = `₹${req.body.price}`;
        // }

        //Make lowercase and remove space after comma
        req.body.technologies = req.body.technologies.toLowerCase().replace(/, /g, ',');
       

        Product.create(req.body)
        .then((prod) => {
            console.log(prod);
            req.flash('success', 'Product added successfully');
            res.redirect('/products');
        },(err) => {console.log(err);})
        .catch((err) => {console.log(err);          req.flash('error', 'Product was not added');

            res.send(err);})
        
    }
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};



module.exports = router;