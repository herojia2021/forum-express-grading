const helpers = require("../_helpers")
const restController = require("../controllers/restController.js")
const adminController = require("../controllers/adminController.js")
const userController = require("../controllers/userController.js")
const categoryController = require("../controllers/categoryController.js")
const commentController = require("../controllers/commentController.js")
const multer = require("multer")
const upload = multer({ dest: "temp/" })
const fs = require("fs")

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect("/signin")
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) {
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

  app.get("/restaurants/feeds", authenticated, restController.getFeeds)

  app.get("/restaurants/:id", authenticated, restController.getRestaurant)

  app.get("/restaurants/:id/dashboard", authenticated, restController.getDashBoard)

  app.get("/admin", authenticatedAdmin, (req, res) => res.redirect("/admin/restaurants"))

  app.get("/admin/restaurants", authenticatedAdmin, adminController.getRestaurants)

  app.get("/admin/restaurants/create", authenticatedAdmin, adminController.createRestaurant)

  app.post("/admin/restaurants", authenticatedAdmin, upload.single("image"), adminController.postRestaurant)

  app.get("/admin/restaurants/:id", authenticatedAdmin, adminController.getRestaurant)

  app.get("/admin/restaurants/:id/edit", authenticatedAdmin, adminController.editRestaurant)

  app.put("/admin/restaurants/:id", authenticatedAdmin, upload.single("image"), adminController.putRestaurant)

  app.delete("/admin/restaurants/:id", authenticatedAdmin, adminController.deleteRestaurant)

  app.get("/admin/users", authenticatedAdmin, adminController.getUsers)

  app.put("/admin/users/:id/toggleAdmin", authenticatedAdmin, adminController.toggleAdmin)

  app.get("/admin/categories", authenticatedAdmin, categoryController.getCategories)

  app.post("/admin/categories", authenticatedAdmin, categoryController.postCategory)

  app.get("/admin/categories/:id", authenticatedAdmin, categoryController.getCategories)

  app.put("/admin/categories/:id", authenticatedAdmin, categoryController.putCategory)

  app.delete("/admin/categories/:id", authenticatedAdmin, categoryController.deleteCategory)

  app.get("/signup", userController.signUpPage)

  app.post("/signup", userController.signUp)

  app.get("/signin", userController.signInPage)

  app.post("/signin", passport.authenticate("local", { failureRedirect: "/signin", failureFlash: true }), userController.signIn)

  app.get("/logout", userController.logout)

  app.post("/comments", authenticated, commentController.postComment)

  app.delete("/comments/:id", authenticatedAdmin, commentController.deleteComment)

  app.post("/favorite/:restaurantId", authenticated, userController.addFavorite)

  app.delete("/favorite/:restaurantId", authenticated, userController.removeFavorite)

  app.post("/like/:restaurantId", authenticated, userController.addLike)

  app.delete("/like/:restaurantId", authenticated, userController.removeLike)

  app.get("/users/:id", authenticated, userController.getUser)

  app.get("/users/:id/edit", authenticated, userController.editUser)

  app.put("/users/:id", authenticated, upload.single("image"), userController.putUser)
}
