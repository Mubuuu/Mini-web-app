var express = require("express");
const { response } = require("../app");
const { addProducts } = require("../helpers/product-helpers");
var router = express.Router();
const productHelpers = require("../helpers/product-helpers");
let verifyUser=null

/* GET users listing. */
router.get("/", function (req, res, next) {
  if (req.session.loggedIn) {
    res.redirect("/admin/view-users");
  } else {
    res.render("admin/sign-in", { admin: true ,"loggedErr":req.session.loggedErr});
    req.session.loggedErr=false
  }
});

const EmailAD = "admin@gmail.com";
const PasswordAD = "123";

router.post("/login", function (req, res, next) {
  console.log("najmu");
  const data = {
    Email: req.body.Email,
    Password: req.body.Password,
  };
  if (EmailAD === data.Email && PasswordAD === data.Password) {
    console.log("admin login");
    req.session.loggedIn = true;
    res.redirect("/admin/view-users");
  } else {
    req.session.loggedErr = "invalid username or password";
    res.redirect("/admin");
    
    
    
  }
});

router.get("/products", function (req, res, next) {
  if (req.session.loggedIn) {
    productHelpers.getAllProducts().then((products) => {
      console.log(products);
      res.render("admin/view-products", { admin: true, products });
    });
  } else {
    res.redirect("/admin");
  }
});
router.get("/add-products", function (req, res, next) {
  console.log("add products");
  res.render("admin/add-products", { admin: true });
});

router.post("/add-products", function (req, res, next) {
  console.log(req.body);
  console.log(req.files.Image);
  productHelpers.addProducts(req.body, (id) => {
    const Image = req.files.Image;
    Image.mv("./public/product-images/" + id + ".jpg", (err, done) => {
      if (!err) {
        console.log("keri");
        res.render("admin/add-products", { admin: true });
      } else {
        console.log("error aan");
        console.log(err);
      }
    });
  });
});

router.get("/delete-product/:id", (req, res) => {
  let proId = req.params.id;
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response) => {
    res.redirect("/admin/");
  });
});
router.get("/delete-user/:id", (req, res) => {
  let proId = req.params.id;
  console.log(proId);
  productHelpers.deleteUser(proId).then((response) => {
    res.redirect("/admin/view-users");
  });
});

router.get("/edit-product/:id", async (req, res) => {
  let product = await productHelpers.getProductDetails(req.params.id);
  console.log(product);
  res.render("admin/edit-product", { admin:true,product });
});

router.get("/edit-user/:id", async (req, res) => {
  let User = await productHelpers.getUserDetails(req.params.id);
  console.log(User);
  res.render("admin/edit-user", {admin:true, User });
});

router.post("/edit-product/:id", (req, res) => {
  console.log(req.params.id);
  let id = req.params.id;
  productHelpers.updateProduct(req.params.id, req.body).then(() => {
    res.redirect("/admin");
    if (req?.files?.Image) {
      let image = req.files.Image;
      image.mv("./public/product-images/" + id + ".jpg");
    }
  });
});

router.post("/edit-user/:id", (req, res) => {
  console.log(req.params.id);
  let id = req.params.id;
  productHelpers.updateUser(req.params.id, req.body).then(() => {
    res.redirect("/admin/view-users");
  });
});

router.get('/view-users',(req,res)=>{
  productHelpers.getAllUsers().then((userss) => {
    console.log(userss);
    res.render("admin/view-users", { admin: true, userss });
  });

})

router.get('/add-user',(req,res)=>{
 res.render('admin/add-user',{admin:true,verifyUser})
 verifyUser=null
})

router.post("/add-user", function (req, res, next) {
  productHelpers.doSignup(req.body).then((response) => {
    console.log(response);
    verifyUser=response
    res.redirect('/admin/add-user')
  });
});
router.post('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/admin')
})

module.exports = router;
