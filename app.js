//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://mysteryswaraj:Mystery-123@cluster0.igha0.mongodb.net/?retryWrites=true&w=majority" , {useNewUrlParser : true, useUnifiedTopology: true});

const itemsSchema = new mongoose.Schema({
   name : String
});

const item = mongoose.model("item" , itemsSchema);

const item1 = new item({
   name : "playcricket"
});

const item2 = new item({
  name : "eatfood"
});

const item3 = new item({
  name : "readbooks"
});

const defaultArray = [item1,item2,item3];

const listSchema = new mongoose.Schema({
    name : String,
    items : [itemsSchema] 
});

const List = mongoose.model("list" , listSchema);


app.get("/", function(req, res) {

  item.find( function(err, items){
     if(items.length === 0){
       item.insertMany(defaultArray , function(err) {
         if(err){
           console.log(err);
         } else {
           console.log("Successfully submitted!");
         }
       });
       res.redirect("/");
     } else {
      res.render("list" , {listTitle : "Today" , newListItems : items});
     }

      
  });
  
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const newItem = new item({
    name : itemName
  });

  if(listName === "Today"){
    item.insertMany([newItem] , function(err) {
      if(err){
        console.log(err);
      } else {
        console.log("Successfully inserted!");
      }
    });
  
    res.redirect("/");
  } else {
     List.findOne({name : listName} , function(err , foundList) {
          if(!err){
            foundList.items.push(newItem);
            foundList.save();
          }
     });

    res.redirect("/"+listName);
  }
  
});

app.post("/check" , function(req,res) {
    const id = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){
      item.findByIdAndRemove(id , function(err) {
        if(err){
          console.log(err);
        } else {
          console.log("Successfully Removed!");
          res.redirect("/");
        }
    });
    } else {
      List.findOneAndUpdate({name : listName} , {$pull: {items: {_id : id}}} , function(err,foundlist){
        if(!err){
          res.redirect("/"+listName);
        }
      });

    }

   
});

app.get("/:customListName" , function(req,res) {
  const customListName = req.params.customListName;  

   List.findOne({name:customListName} , function(err,foundList) {
     if(err){
       console.log(err);
     }else {

      if(!foundList){
        const list = new List({
          name : customListName,
          items : defaultArray
        });
  
        list.save();
        res.redirect("/"+customListName);
      } else {
        res.render("list" , {listTitle : customListName , newListItems : foundList.items});
      }
     
     }
   });

 

});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

let port = process.env.PORT;
if(port === null || port === ""){
  port = 3000;
}

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
