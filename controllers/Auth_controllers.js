const { Op } = require('sequelize');
const {appFire} = require('../fireBase_Credentials')
const {admin} = require('../FireBaseDB')

const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} = require("firebase/auth");
const users = require("../modles/UserAuth_model");

const login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log('checking for ',email , password);
  const auth = getAuth(appFire);
  const userdata = await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      res.status(201).json({
        status: "success",
        message: "user have been logged in  ",
        data: user,
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: "fail",
        message: error,
       
      });
      console.log(error);
    });
};

const signUp = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try{
  const auth = getAuth(appFire);
  const userdata = await createUserWithEmailAndPassword(auth, email, password)
  const userinfo = userdata.user;
  enterInDataBase(req, res, userinfo);
  }
    catch(error)  {
      res.json({
        status: "fail",
        message: error,
      });
    };
};

const GenerateCode = () => {
  let code = Math.floor(Math.random() * 900000) + 100000;
  return code;
};
const enterInDataBase = async (req, res, data) => {
  console.log("data is hitted", data.stsTokenManager);

  try {
    const email = data.email;
    const refreshToken = data.stsTokenManager.refreshToken;
    const uid = data.uid;
    const code = await GenerateCode();

    const newUser = await users.create({ email, refreshToken, code ,uid});
    if (newUser) {
      res.status(201).json({
        data: newUser,
        message: "created successfully, and entered in DB",
      });
    }else{
      res.status(201).json({
        data: newUser,
        message: "created successfully, but not in DB",
      });
    }
    
  } catch (error) {
    console.log(error, "internal server error");
  }
};

const verifyemail = async (req, res) => {
  try {
    const { email, code } = req.body;
    console.log("Getting info about", email, code);

    const user = await users.findOne({
      where: {
        [Op.and]: [
          { email: email },
          { code: code },
        ],
      },
    });
    console.log('COMPLETE DATA',user);
    if (user) {
        // console.log('Layer-1',user.Users);
        // const uid = user;
        // console.log("I AM GENERATING",user.Users.dataValues);
        const UID = user.id
        console.log(user.uid);
      // Update the user's emailVerified status
      await admin.auth().updateUser(uid=UID,{emailVerified: true})

      res.status(200).json({
        status: "success",
        message: "User email verified successfully",
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "No such User found",
      });
    }
  } catch (error) {
    console.log(error, "There is an error finding the user");
    res.status(500).json({
      status: "fail",
      message: "Either server error or no such student",
    });
  }
};

module.exports = { login, signUp, verifyemail };





/*

[
    Users {
      dataValues: {
        id: 1,
        refreshToken: 'AMf-vByWj-seNg9rNBMwuuiIuLN76fOP0jmrRpbKG9tmjIJfpLc3wobTNzSRWGBzUi3Kz3jiudrwTXfVhFNk5zUPvCIIofVP7gu7X5EiIhx1k3HMjNPxirT_uOUmPBWbbzaFnxw0D52pVlpq-fR78peRPcIsCIpKgLszDBGGe2alwqPvu3eYGFDSUON60Mu7s2ozdvSsYU-3VB1Svj1RMSgdFoYW1JXCgw',
        uid: 'yVTz8hQpBWQpT3i7MfRXdwbslmZ2',
        email: '33444@tes.com',
        name: null,
        code: '540382',
        phone: null,
        createdAt: 2024-07-19T11:41:02.254Z,
        updatedAt: 2024-07-19T11:41:02.254Z
      },
      _previousDataValues: {
        id: 1,
        refreshToken: 'AMf-vByWj-seNg9rNBMwuuiIuLN76fOP0jmrRpbKG9tmjIJfpLc3wobTNzSRWGBzUi3Kz3jiudrwTXfVhFNk5zUPvCIIofVP7gu7X5EiIhx1k3HMjNPxirT_uOUmPBWbbzaFnxw0D52pVlpq-fR78peRPcIsCIpKgLszDBGGe2alwqPvu3eYGFDSUON60Mu7s2ozdvSsYU-3VB1Svj1RMSgdFoYW1JXCgw',
        uid: 'yVTz8hQpBWQpT3i7MfRXdwbslmZ2',
        email: '33444@tes.com',
        name: null,
        code: '540382',
        phone: null,
        createdAt: 2024-07-19T11:41:02.254Z,
        updatedAt: 2024-07-19T11:41:02.254Z
      },
      uniqno: 1,
      _changed: Set(0) {},
      _options: {
        isNewRecord: false,
        _schema: null,
        _schemaDelimiter: '',
        raw: true,
        attributes: [Array]
      },
      isNewRecord: false
    }
  ]
*/  
