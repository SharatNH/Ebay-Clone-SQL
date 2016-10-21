var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session=require('express-session');


var routes = require('./routes/index');
var users = require('./routes/users');
var home=require('./routes/home');

var app = express();

var pid;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

console.log("inside app.js");
app.use(session({
  cookieName : 'session',
  secret : 'session_ass_test',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000
}));


console.log("h11");
app.get('/displayinindex',function(req,res){
  console.log("inside app.js displayinindex");
  home.displayinindex(req,res);
});

console.log("h12");
app.get('/jmpcart',function(req,res){
   console.log("inside the shopping cart function");
   home.jmpcart(req,res);
});

console.log("h17");
app.get('/userprofile',function(req,res){
  console.log("inside the shopping cart function");
  home.userprofile(req,res);
});

console.log("h18");
app.get('/calculateTotal',function(req,res){
 console.log("inside cal total");
  home.calculateTotal(req,res);
});

console.log("h13");
app.get('/callproductpage/:id',function(req,res){
   console.log("calling product page");
   //res.redirect('productpage.ejs');
  home.callproductpage(req,res);
});

console.log("h13  2 case");
app.get('/callproductpage/:id',function(req,res){
  console.log("calling product page");
  //res.redirect('productpage.ejs');
  home.callproductpage(req,res);
});

console.log("h14");
app.get('/getcart',function(req,res){
  console.log("inside getcart");
  home.getcart(req,res);

});

app.get('/addtobid',function(req,res){
  console.log("add to bid");
  home.addtobid(req,res);
});

console.log("h15");
app.get('/checkout',function(req,res){
  console.log("inside checkout");
  home.checkout(req,res);
});

console.log("h2");
app.get('/index',function(req,res)
{
  home.homepage(req,res);
});

console.log("h2");
app.get('/signin',function(req,res)
{
  home.callsignin(req,res);
});

console.log("h4");
app.get('/selling',function(req,res)
{
  home.sellcall(req,res);

});

console.log("h7");
app.get('/checkjump',function(req,res){
  home.checkjump(req,res);
});

console.log("h10");
app.get('/shoppingcart',function(req,res){
  home.shoppingcart(req,res);
});

app.get('/listshoppingcart',function(req,res){
  home.listshoppingcart(req,res);
});
console.log("h11");
app.get('/addtocart',function(req,res){
   home.addtocart(req,res);
});

console.log("h12");
app.post('/cardvalid',function(req,res){
  console.log("inside cardvalid");
  home.cardvalid(req,res);
});

console.log("h8");
app.post('/checklogin',function(req,res){
  home.checklogin(req,res);
});

console.log("h8");
app.get('/signout',function(req,res){
  home.signout(req,res);
});

console.log("h18");
app.post('/editcart',function (req,res) {
  home.editcart(req,res);
});
console.log("h17");
app.get('/userprofile',function(req,res){
  home.userprofile(req,res);
});
console.log("h9");
app.post('/registeruser',function(req,res){
  home.registeruser(req,res);
});

app.post('/additems',function(req,res){
  home.additems(req,res);
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
