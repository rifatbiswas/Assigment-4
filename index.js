
const express = require('express');
const path = require('path');
const multer = require('multer');
const app = express();
const PORT = 4040;

//middlewere
app.use(express.json());

/* <<<<<<<<<====**make post request use header/ query /body**=====>>>>>>>>>>*/
app.post('/prameter',(req,res)=>{
    //use header prameter
    const plactform = req.header('plactform');

    //use query prameter
    const firstName = req.query.firstName;
    const lastName = req.query.lastName;
    const fullName = firstName + ' ' + lastName;

    //use body prameter
    const location = req.body.district
   
    //result
    const result = `Use header >> ${plactform} \n Use query >> ${fullName} \n Use body >> ${location}`; 

    //respons
    res.send(result);
});

/* <<<<<<<<<====**uplode file**=====>>>>>>>>>>*/
const UPLODE_LOCAL = './uplode/';

//define a storage
const storage = multer.diskStorage({
    destination:(req, file, callback)=>{
        callback(null, UPLODE_LOCAL);
    },
    filename:(req,file,callback) => {
        const fileExt = path.extname(file.originalname);
        const fileName = file.originalname
                             .replace(fileExt, '')
                             .toLowerCase()
                             .split(' ')
                             .join('-') + '-' + Date.now();

        callback(null, `${fileName}${fileExt}`);                     
    }
});

//uplode file
const uplode = multer({
    storage:storage,
    //mimetype check
    fileFilter:(req, file, callback) => {
        if(file.mimetype === 'image/jpg'||
          file.mimetype === 'image/jpeg'||
          file.mimetype === 'image/png'
        ){
            callback(null, true);
        }else{
            callback(new Error('Only png, jpg & jpeg saporeted!'));
        }
    }
});

//uplode file stroge
fileUP = uplode.single('avatar');

//post uplode API
app.post('/uplode',fileUP, (req, res) => {
    res.send('File is successfull uplode');
});


/* <<<<<<<<<====**Dowenlode API**=====>>>>>>>>>>*/
const Download_Local = './download/mern-(1)-1670392499654.png'

//Dounlode GET API
app.get('/download', (req,res) => {
    res.download(Download_Local,(error) => {
        if (!error) {
            res.send('File Download success');
        } else {
            res.send('File Download Failed!');
        }
    });
});


/* <<<<<<<<<====**error Handeling**=====>>>>>>>>>>*/
app.use((err,req,res,next)=>{
    if (err) {
        if (err instanceof multer.MulterError) {
            res.status(500).send('THere is an uplode error!');
        } else {
            res.status(500).send(err.message);
        }
    } else {
        res.send('Success');
    }
});

//server listen
app.listen(PORT, ()=>{
    console.log(`server is runing at http://localhost:${PORT} \nDevelope By >> Ismile Sardar`);
});


