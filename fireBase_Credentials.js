
const { initializeApp } = require( "firebase/app");
const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSEGINGSENDERID,
  appId: process.env.APPID,
  measurementId: process.env.MESUREMENTID
};

const appFire = initializeApp(firebaseConfig);


module.exports = {appFire}
