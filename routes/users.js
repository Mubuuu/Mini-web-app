const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");
const { response } = require("../app");
const productHelpers = require("../helpers/product-helpers");
const userHelpers = require("../helpers/user-helpers");

let verifyUser=null

const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/sign-in')
  }
}

/* GET home page. */
router.get("/", function (req, res, next) {
  let user = req.session.user;
  productHelpers.getAllProducts().then((products) => {
    // console.log(products);
    res.render("user/view-products",{products,user});
  });
});

router.get("/sign-in", function (req, res, next) {
 
    res.render("user/sign-in",{'loggedErr':req.session.loggedErr});
    req.session.loggedErr=false
  // }
});

router.get("/signup", function (req, res, next) {
  res.render("user/signup",{verifyUser});
  verifyUser=null
});

router.post("/sign-in", function (req, res, next) {
  res.redirect("/sign-in");
});
router.post("/login", function (req, res, next) {
  userHelpers.doLogin(req.body).then((response) => {
    console.log("pp");
    if (response.status) {
      console.log("ooo");
      req.session.loggedIn = true;
      req.session.user = response.user;
      res.redirect("/");
    } else {
      req.session.loggedErr = "invalid username or password";
      res.redirect("/sign-in");
    }
  });
});

router.post("/sign-up", function (req, res, next) {
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response);
    verifyUser=response

    // req.session.user=response
    res.redirect('/signup')
  });
});

router.post("/sign-out", function (req, res, next) {
  req.session.destroy()
  res.redirect("/");
});



router.get('/cart',verifyLogin,async(req,res)=>{
  let products=await userHelpers.getCartProducts(req.session.user._id)
   console.log(products);
     res.render('user/cart')
})

router.get('/add-to-cart/:id',verifyLogin,(req,res)=>{
  userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
    res.redirect('/')
  })
})


  


module.exports = router;
