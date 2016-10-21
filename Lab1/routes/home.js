var ejs=require("ejs");
var http=require("http");
var mysql=require("./mysql");

var pid;

exports.callsignin=function(req,res)
{

    console.log("signin");

    ejs.renderFile('./views/signin.ejs',function (err,result){

        if (!err)
        {
            res.end(result);
        }
        // render or error
        else
        {
            res.end('An error occurred');
            console.log(err);
        }

    });

};

exports.signout=function(req,res)
{

    console.log("signout");

    var n=req.session.lastlogin;

    var userupdate="INSERT INTO userlog (`user`, `lastlogin`) VALUES ('"+req.session.user+"', '"+req.session.lastlogin+"')";

    mysql.fetchData(function(err,result){

        console.log(result);
        if(err)
        {
            throw err;

        }
        else{

            if(result.length>0)
            {
                console.log("updated");


                }


            }

    },userupdate);

    req.session.destroy();
    res.render("index");

};

exports.homepage=function(req,res)
{

    console.log("signin");

    ejs.renderFile('./views/index.ejs',function (err,result){

        if (!err)
        {
            res.end(result);
        }
        // render or error
        else
        {
            res.end('An error occurred');
            console.log(err);
        }

    });

};

exports.sellcall=function (req,res) {

    console.log("sellcall");

    ejs.renderFile('./views/selling_one.ejs',function(err,result){

        if(!err)
        {
            res.end(result);
        }
        else{
            res.end('error occured');
            console.log(err);
        }
    });


};

exports.checkjump=function(req,res){

    console.log("checkjump");
    //simply check if there is a user session
    //fetch the username and password from the file-npt req i guess
    var user="user";
    //call the db
    if(req.session.user) //compare and if true //check if the session exists
    {
        //assign username to session
        ejs.renderFile('./views/selling_two.ejs',function(err,result){

            if(!err){
                res.end(result);
            }
            else
            {
                res.end("error occured");
                console.log(err);

            }
        });
    }
    else {
        res.render("index");
    }

};

exports.checklogin=function(req,res){

    var user=req.param('user');
    var pass=req.param('password');
    console.log(user);

    var n=Date();
    var getUser="select * from userdetails where user='"+req.param("user")+"' and password= SHA1('"+req.param("password")+"')";
    console.log("Query is:"+getUser);

    mysql.fetchData(function(err,result){

        console.log(result);
        if(err)
        {
            throw err;

        }
        else{

            if(result.length>0)
            {
                console.log("valid user");

                req.session.user=user;   //session needs to be created
                req.session.lastlogin=n;
                ejs.renderFile('./views/index.ejs',function(err,result){  //login successful render the file
                    if(!err)
                    {
                        console.log("success-- reroute to index");

                        var result={
                            success:true
                        };
                        console.log(result);
                        res.send(result);


                    }
                    else{
                        console.log("some error when rendering");
                        res.end(err);
                    }
                });

            }
            else{
                //invalid login
                var success ='';
                var result={
                    success:false
                };
                console.log(result);
                res.send(result);

                //res.render("index");    //render the file
                console.log("user doesnt exists");
            }
        }
    },getUser);

};

exports.registeruser=function(req,res){

    var user=req.param("newuser");
    var password=req.param("password");
    var lastname=req.param("lastname");
    var firstname=req.param("firstname");

    var adduser="INSERT INTO userdetails (`user`, `password`, `firstname`, `lastname`) VALUES ('"+req.param("newuser")+"',SHA1('" +req.param("password")+"'), '"+req.param("firstname")+"', '"+req.param("lastname")+"')";

    mysql.fetchData(function(err,results){

        console.log(results);
        if(err)
        {
            var data={
                duplicate:true
            };
            res.send(data);

        }
        else
        {
            if(results.affectedRows>0){
                //rediret to login page
                ejs.renderFile('./views/signin.ejs',function(err,result){  //login successful render the file
                    if(!err)
                    {
                        console.log("success reroute to index");
                        var result={
                            success:true
                        };
                        res.send(result);
                    }
                    else{
                        console.log("some error when rendering");
                        res.end(err);
                    }
                });
                console.log("user added");
            }

            else
            {
                //user exits
                var result={
                    success:false
                };
                res.send(result);
                console.log("user exists");
            }
        }
    },adduser);

};

exports.additems=function(req,res){   //write a export for item sell form

    var user=req.session.user;
    var title = req.param("title");
    var desc = req.param("desc");
    var sellerdetails = req.param("sellerdetails");
    var price = req.param("price");
    var avail = req.param("avail");
    var check = req.param("check");

    var date = new Date();
    var day=date.getDate();

    var id=Math.floor((Math.random() * 10000) + 1);   //random numbers

    console.log(check);
    console.log(avail);
    console.log(price);
    console.log(desc);
    console.log(day);
    console.log(id);

    var additem="INSERT INTO saleitems (`user`, `title`, `itemdesc`, `sellerinfo`,`itemprice`,`quantity`,`bidding`,`timecopy`,`id`) VALUES ('"+user+"','"+req.param("title")+"', '"+req.param("desc")+"', '"+req.param("sellerdetails")+"', '"+req.param("price")+"','"+req.param("avail")+"','"+req.param("check")+"','"+day+"','"+id+"')";

    console.log(additem);


    mysql.fetchData(function(err,results){

        console.log(results);
        if(err)
        {
            throw err;

        }
        else
        {
            if(results.affectedRows>0){
                //rediret to login page
                ejs.renderFile('./views/index.ejs',function(err,result){  //addition successful render the file
                    if(!err)
                    {
                        console.log("item success reroute to index");
                        var result={
                            success:true
                        };
                        res.send(result);
                    }
                    else{
                        console.log("some error when rendering");
                        res.end(err);
                    }
                });
                console.log("item added");
            }

            else
            {
                //addition failed
                var result={
                    success:false
                };
                res.send(result);
                console.log("addition failed");
            }
        }
    },additem);


};


exports.shoppingcart=function(req,res)
{

  console.log("inside shoppingcart");

    ejs.renderFile('./views/shoppingcart.ejs',function(err,result){

        if(!err)
        {
            res.send(result);
        }
        else
        {
            console.log("some error while rendering");
            res.end(err);
        }
    });

};


exports.displayinindex=function(req,res){     //to display advt

    console.log("inside displayinindex");

    var getItems="select * from saleitems ";
    console.log("Query is:"+getItems);

    mysql.fetchData(function(err,result){

        console.log(result);
        if(err)
        {
            throw err;

        }
        else{

            if(result.length>0)
            {
                console.log("items present");

                    var data={
                        result:result,
                        success:true,
                        user:req.session.user
                    };
                ejs.renderFile('./views/index.ejs',function(err,result){  //login successful render the file
                    if(!err)
                    {
                        console.log("success-- reroute to index");


                        console.log(data);
                        res.send(data);


                    }
                    else{
                        console.log("some error when rendering");
                        res.end(err);
                    }
                });

            }
            else{
                //NO items to display
                var success ='';
                var data={

                    success:false,
                    user:req.session.user
                };
                console.log(data);
                res.send(data);

                //res.render("index");    //render the file
                console.log("no items to display");
            }
        }
    },getItems);

};


exports.listshoppingcart=function(req,res)
{
    console.log("inside shoppingcart");

    if(req.session.user) {

        var listItems = "select * from cart where user='" +req.session.user+"' ";

        console.log("Query is:" + listItems);

        mysql.fetchData(function (err, result) {

            console.log(result);
            if (err) {
                throw err;

            }
            else {

                if (result.length > 0) {
                    console.log("items present");

                    var data = {
                        result: result,
                        success: true,
                        user: req.session.user
                    };
                    ejs.renderFile('./views/shoppingcart.ejs', function (err, result) {  //login successful render the file
                        if (!err) {
                            console.log("success-- reroute to index");


                            console.log(data);
                            res.send(data);


                        }
                        else {
                            console.log("some error when rendering");
                            res.end(err);
                        }
                    });

                }
                else {
                    //NO items to display
                    ejs.renderFile('./views/shoppingcart.ejs', function (err, result) {  //login successful render the file
                        if (!err) {
                            console.log("nothing to show");
                            var data = {
                                result: result,
                                success: false,
                                user: req.session.user
                            };

                            console.log(data);
                            res.send(data);


                        }
                        else {
                            console.log("some error when rendering");
                            res.end(err);
                        }
                    });
                }
            }
        }, listItems);

    }
    else
    {
        var data = {

            failed: true

        };

        console.log(data);
        res.send(data);


    }

};

exports.jmpcart=function(req,res){

    console.log("jmpcart");

    ejs.renderFile('./views/shoppingcart.ejs',function (err,result){

        if (!err)
        {
            res.end(result);
        }
        // render or error
        else
        {
            res.end('An error occurred');
            console.log(err);
        }

    });



};


exports.userprofile=function(req,res){

    console.log("userprofile");

    ejs.renderFile('./views/userprofile.ejs',function (err,result){

        if (!err)
        {
            res.end(result);
        }
        // render or error
        else
        {
            res.end('An error occurred');
            console.log(err);
        }

    });

};

exports.callproductpage=function(req,res){    //call the product page

    pid=req.param("id");
    //pid1=req.query("id");
    console.log(pid);

    console.log("inside callproductpage");
    if(req.session.user==undefined)
    {
        req.session.user="guest";
        req.session.pid=pid;
    }
    else
    {
        req.session.pid=pid;
    }

    var n = Date();
    var cartitem="INSERT INTO userlogs (`user`, `pid`, `timestamp`) VALUES ('"+req.session.user+"','"+req.session.pid+"', '"+n+"')";


    mysql.fetchData(function(err,result){

        console.log(result);
        if(err)
        {
            throw err;

        }
        else{

            if(result.length>0)
            {
                console.log("entered into db");

            }




        }
    },cartitem);

    res.render('productpage', { title: 'Express' });


    /*console.log("callproductpage");

    pid=req.param("productid");

    console.log(pid);

    ejs.renderFile('./views/productpage.ejs',function (err,result){

        if (!err)
        {

            res.end(result);
        }
        // render or error
        else
        {
            res.end('An error occurred');
            console.log(err);
        }

    });*/

};

exports.checkout=function(req,res) {

    console.log("checkout");


    ejs.renderFile('./views/cardvalidation.ejs',function (err,result){

        if (!err)
        {
            res.end(result);
        }
        // render or error
        else
        {
            res.end('An error occurred');
            console.log(err);
        }

    });

};


///backend of the productpage display
exports.getcart=function(req,res){

  var id=req.session.pid;

    var getcart="select * from saleitems where id='" +id+"'";
    console.log("Query is:"+getcart);
    //sales item

    var date = new Date();
    var day=date.getDate();

    mysql.fetchData(function(err,result){

        console.log(result);
        if(err)
        {
            throw err;

        }
        else{

            if(result.length>0)
            {
                console.log("valid pid");

                var data={
                    result:result,
                    success:true,
                    day:day
                };

                console.log(data);
                res.send(data);

                /*
                ejs.renderFile('./views/productpage.ejs',function(err,result){  //login successful render the file
                    if(!err)
                    {
                        console.log("success-- reroute to productpage");


                        console.log(data);
                        res.send(data);


                    }
                    else{
                        console.log("some error when rendering");
                        res.end(err);
                    }
                });

                */

            }
            else{
                //invalid login
                var success ='';
                var result={
                    success:false
                };
                console.log(result);
                res.send(result);

                //res.render("index");    //render the file
                console.log("item doesnt exists");
            }
        }
    },getcart);

};

//insert to the cart database
exports.addtocart=function(req,res){

console.log("inside the function to add to cart database");

    var user=req.session.user;
    var title = req.param("title");
    var itemdesc = req.param("itemdesc");
    var id=req.param("id");
    var rate = req.param("rate");
    var quantity = req.param("qty");
    var total = req.param("total");

    console.log(id);
    console.log(quantity);
    console.log(rate);
    console.log(total);
    console.log(user);


    var cartitem="INSERT INTO cart (`user`, `title`, `itemdesc`, `quantity`,`rate`,`id`,`total`) VALUES ('"+user+"','"+req.param("title")+"', '"+req.param("itemdesc")+"', '"+req.param("qty")+"', '"+req.param("rate")+"','"+req.param("id")+"','"+req.param("total")+"')";

    console.log(cartitem);

    if(req.session.user!="guest")
    {
        mysql.fetchData(function(err,results){

            console.log(results);
            if(err)
            {
                throw err;

            }
            else
            {
                if(results.affectedRows>0){
                    //rediret to login page

                            console.log("success reroute to index");
                            var result={
                                success:true
                            };
                            res.send(result);
                        }
                        else{
                            console.log("some error when rendering");
                            res.end(err);
                        }
                    }
                    console.log("user added");
                },cartitem);



        }


    else
    {
        var result={
            success:false
        };
        res.send(result);
    }



};

exports.cardvalid=function(req,res) {   //do the card autentication and update the cart and available items and user profile

    console.log("inside the cardvalid ");


    var card = req.param('card');
    var cvv = req.param('cvv');
    var year = req.param('year');
    var month = req.param('month');


    console.log("cvv "+cvv);
    console.log("card "+card);

    var clength = card.toString().length;
    var cvvl = cvv.toString().length;

    console.log(clength);
    console.log(cvvl);
    if (clength == 16 && cvvl == 3) {

        console.log("valid Login");

        var data = {
            success: true
        };

        var query1 = "select id,quantity from cart where user='" + req.session.user + "'";

        mysql.fetchData(function (err, results) {
            if (err) {
                throw err;
            }
            else {
                console.log(JSON.stringify(results));
                for (i = 0; i < results.length; i++) {
                    var pid = results[i].id;
                    var qty = results[i].quantity;
                    console.log("here"+pid+" "+qty);


                    var query2 = "update saleitems set quantity = (quantity-'" + qty + "') where id in ('" + pid + "')";

                    mysql.fetchData(function (err, results) {
                        if (err) {
                            throw err;
                        }
                        else {

                            console.log("successful");
                        }

                            }, query2);

                        }


                }
                for (i = 0; i < results.length; i++) {
                var pid = results[i].id;
                var qty = results[i].quantity;
                console.log("here"+pid+" "+qty);

                    var query3 = "INSERT INTO userbuy (`user`, `itemdesc`, `quantity`) VALUES ('" + req.session.user + "','" + pid + "', '" + qty + "')";

                    mysql.fetchData(function (err, results) {
                        if (err) {
                            throw err;
                        }
                        else {

                            console.log("successful entry");

                        }

                    }, query3);


                }


        }, query1);

        var flushcart = "delete from cart where user ='"+req.session.user+"'";

        mysql.fetchData(function (err, results) {
            if (err) {
                throw err;
            }
            else {

                console.log("successful");
            }

        }, flushcart);




        res.send(data);
    }


    else {
        console.log("Invalid Login");
        var data = {
            success: false
        };
        res.send(data);
    }



};

/*
exports.calculateTotal=function(req,res){  //to calculate the net total of the shopping cart

  console.log("inside cal total fuccntion");
    var listsum = "select sum(total) as total from cart where user='" +req.session.user+"' ";

    if(req.session.user!="guest")
    {
        mysql.fetchData(function(err,results){

            console.log(results);
            if(err)
            {
                throw err;

            }
            else
            {
                if(results.affectedRows>0){
                    //rediret to login page

                    console.log("success reroute to index");
                    console.log(results);
                    res.send(results);
                }
                else{
                    console.log("some error when rendering");
                    res.end(err);
                }
            }
            console.log("cal done");
        },listsum)};



    };
*/

exports.addtobid=function(req,res){  // to add to bidding cart

    console.log("inside cal total fuccntion");
    var n=Date();
    var addtobid="INSERT INTO addbid (`user`, `pid`, `timestamp`, `amt`,`qty`) VALUES ('"+req.session.user+"','"+req.param("pid")+"', '"+n+"', '"+req.param("bidamt")+"', '"+req.param("qty")+"')";


    if(req.session.user!="guest") {
        mysql.fetchData(function (err, results) {

            console.log(results);
            if (err) {
                throw err;

            }
            else {
                if (results.affectedRows > 0) {
                    //rediret to login page

                    console.log("success reroute to index");
                    console.log(results);
                    var data = {
                        success: true
                    };
                    res.send(data);
                }
                else {
                    console.log("some error when rendering");
                    res.end(err);
                }
            }
            console.log("cal done");
        }, addtobid);
    }
    else
    {
        var data = {
            success: false
        };
        res.send(data);
    }



};
//create user profile
exports.userprofile=function(req,res)
{
  console.log("inside userprofile");

    var user=req.session.user;

    if(user!="guest" || user!="undefined")
    {
        var fetchdata="select * from userdetails,saleitems,userbuy,userlog where userdetails.user=saleitems.user=userbuy.user=userlog.user='"+req.session.user+"'";

        mysql.fetchData(function (err, results) {
            if(err)
            {
                throw err;
            }
            else
            {
                var data={
                    result:results,
                    success:true
                };
                res.send(data);
            }

        },fetchdata);

    }
    else
    {
        var data={

            failed:true
        };
        res.send(data);
    }



};

exports.editcart=function(req,res) {

    var id = req.param("id");

    console.log("id");
    var querydelete = "delete from cart where id ='"+req.param("id")+"'";

    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        }
        else {
            var data = {

                success: true
            };
            res.send(data);
        }

    }, querydelete);






};