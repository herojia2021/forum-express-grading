const express = require("express")
const handlebars = require("express-handlebars") // 引入 handlebars
const db = require("./models") // 引入資料庫
const flash = require("connect-flash")
const session = require("express-session")
const passport = require("./config/passport")
const methodOverride = require("method-override")
const app = express()
const port = process.env.PORT || 3000

app.engine("handlebars", handlebars({ defaultLayout: "main", helpers: require("./config/handlebars-helpers") }))
app.set("view engine", "handlebars") // 設定使用 Handlebars 做為樣板引擎

app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
const helpers = require("./_helpers")
app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success_messages")
  res.locals.error_messages = req.flash("error_messages")
  res.locals.user = helpers.getUser(req)
  next()
})
app.use(methodOverride("_method"))
app.use("/upload", express.static(__dirname + "/upload"))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require("./routes")(app, passport)

module.exports = app
