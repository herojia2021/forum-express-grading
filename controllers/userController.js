const bcrypt = require("bcryptjs")
const db = require("../models")
const User = db.User
const Favorite = db.Favorite
const Like = db.Like
const helpers = require("../_helpers")
const fs = require("fs")

const userController = {
  signUpPage: (req, res) => {
    return res.render("signup")
  },

  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash("error_messages", "兩次密碼輸入不同！")
      return res.redirect("/signup")
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then((user) => {
        if (user) {
          req.flash("error_messages", "信箱重複！")
          return res.redirect("/signup")
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
          }).then((user) => {
            req.flash("success_messages", "成功註冊帳號！")
            return res.redirect("/signin")
          })
        }
      })
    }
  },

  signInPage: (req, res) => {
    return res.render("signin")
  },

  signIn: (req, res) => {
    req.flash("success_messages", "成功登入！")
    res.redirect("/restaurants")
  },

  logout: (req, res) => {
    req.flash("success_messages", "登出成功！")
    req.logout()
    res.redirect("/signin")
  },

  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId,
    }).then((restaurant) => {
      return res.redirect("back")
    })
  },

  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId,
      },
    }).then((favorite) => {
      favorite.destroy().then((restaurant) => {
        return res.redirect("back")
      })
    })
  },

  addLike: (req, res) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId,
    }).then((restaurant) => {
      return res.redirect("back")
    })
  },

  removeLike: (req, res) => {
    return Like.destroy({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId,
      },
    }).then((like) => {
      return res.redirect("back")
    })
  },

  getUser: (req, res) => {
    return User.findByPk(req.params.id).then((user) => {
      return res.render("profile", { user: user.toJSON() })
    })
  },

  editUser: (req, res) => {
    return User.findByPk(req.params.id).then((user) => {
      return res.render("edit", { user: user.toJSON() })
    })
  },

  putUser: (req, res) => {
    console.log("========================+++++++++++++")
    console.log(req)
    const { file } = req
    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log("Error: ", err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return User.findByPk(req.params.id).then((user) => {
            user
              .update({
                name: req.body.name,
                image: file ? `/upload/${file.originalname}` : user.image,
              })
              .then((user) => {
                req.flash("success_messages", "使用者資料編輯成功")
                res.redirect(`/users/${req.params.id}`)
              })
          })
        })
      })
    } else {
      return User.findByPk(req.params.id).then((user) => {
        console.log(req.body)
        user
          .update({
            name: req.body.name,
            email: req.body.email,
            image: user.image,
          })
          .then((user) => {
            req.flash("success_messages", "使用者資料編輯成功")
            res.redirect(`/users/${req.params.id}`)
          })
      })
    }
  },
}

module.exports = userController
