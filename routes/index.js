<<<<<<< HEAD
const restController = require("../controllers/restController.js")
const adminController = require("../controllers/adminController.js")
const userController = require("../controllers/userController.js")
const multer = require("multer")
const upload = multer({ dest: "temp/" })
const fs = require("fs")

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect("/signin")
}

const authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      return next()
    }
    return res.redirect("/")
  }
  res.redirect("/signin")
}

module.exports = (app, passport) => {
  //如果使用者訪問首頁，就導向 /restaurants 的頁面
  app.get("/", authenticated, (req, res) => res.redirect("/restaurants"))

  //在 /restaurants 底下則交給 restController.getRestaurants 來處理
  app.get("/restaurants", authenticated, restController.getRestaurants)

  // 連到 /admin 頁面就轉到 /admin/restaurants
  app.get("/admin", authenticatedAdmin, (req, res) => res.redirect("/admin/restaurants"))

  // 在 /admin/restaurants 底下則交給 adminController.getRestaurants 處理
  app.get("/admin/restaurants", authenticatedAdmin, adminController.getRestaurants)

  app.get("/admin/restaurants/create", authenticatedAdmin, adminController.createRestaurant)

  app.post("/admin/restaurants", authenticatedAdmin, upload.single("image"), adminController.postRestaurant)

  app.get("/admin/restaurants/:id", authenticatedAdmin, adminController.getRestaurant)

  app.get("/admin/restaurants/:id/edit", authenticatedAdmin, adminController.editRestaurant)

  app.put("/admin/restaurants/:id", authenticatedAdmin, upload.single("image"), adminController.putRestaurant)

  app.delete("/admin/restaurants/:id", authenticatedAdmin, adminController.deleteRestaurant)

  app.get("/signup", userController.signUpPage)

  app.post("/signup", userController.signUp)

  app.get("/signin", userController.signInPage)

  app.post("/signin", passport.authenticate("local", { failureRedirect: "/signin", failureFlash: true }), userController.signIn)

  app.get("/logout", userController.logout)
=======
module.exports = (app) => {
  app.get('/', (req, res) => {
    res.send('Hello World!')
  })
>>>>>>> origin/R01-test
}
