const express = require("express");
require('dotenv').config();
const sequelize = require('./dataBase/db')
const connect = require('./dataBase/connection')
const app = express();
const port = 4000;
const AWS = require('aws-sdk')
const FS = require('fs')
const multer = require('multer');
const Access_key = process.env.Access_key
const Secret_key = process.env.Secret_key
app.use(express.json());
const authRouter = require('./routes/Auth_Routes')

const cors = require("cors");
const Users = require('./modles/UserAuth_model')

app.use(cors());





app.use('/api/v1',authRouter)
AWS.config.update({
  accessKeyId: Access_key,
  secretAccessKey: Secret_key
});

var s3 = new AWS.S3();
const upload = multer({ dest: 'uploads/' });

app.get('/uploadImage',(req,res)=>{
  res.send(`
    <h2>File Upload With <code>"Node.js"</code></h2>
    
    <form action="/processImage" method="post" enctype="multipart/form-data">
      <div>Select a file: 
        <input type="file" name="file" />
      </div>
      <input type="submit" value="Upload" />
    </form>
  `);
})

app.post('/processImage', upload.single('file'), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const params = {
    Bucket: "tyloones-himanshu",
    Key: file.originalname, // Use the original file name as the key
    Body: require('fs').createReadStream(file.path)
  };
  UpdateInDataBase(req,res,params.Key)
  s3.putObject(params, (error, data) => {
    if (error) {
      console.log("can't upload the file", error);
      return res.status(500).send('Error uploading file.');
    } else {
      console.log('successfully uploaded');
      res.status(200).json({
        status: "success",
        data:params.Key,
        message: "File has been uploaded"
      });
    }
  });
});
const UpdateInDataBase = async (req, res, data) => {
  console.log("data is hitted", data);

  try {
    const user = await Users.findOne({
      where:{refreshToken:process.env.REFRESHTOKEN}
    })
    user.update({ProfilePicture:`${data}`})
    res.status(201).json({
      data: newUser,
      message: "created successfully",
    });
  } catch (error) {
    console.log(error, "internal server error");
  }
};


app.get("/viewPicture",async(req,res)=>{
  const user = await Users.findOne({
    where:{refreshToken:process.env.REFRESHTOKEN}
  })
  const src = `${process.env.AWS_CF}${user.ProfilePicture}`
  res.send(`<img src="${src}" alt="" width="1000px"/>` )
})



app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "connected successfully",
  });
});


sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    connect();
  });
});
