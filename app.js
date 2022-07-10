

const express = require("express");
const bodyParser = require("body-parser");
const res = require("express/lib/response");
const mongoose = require("mongoose");
const _ = require("lodash")
const date = require(__dirname + "/date.js");

const app = express();

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.set("view engine","ejs");

mongoose.connect("mongodb+srv://Shriyash:shriyash1a2b@cluster0.ebx2i.mongodb.net/todolistDB")

const itemSchema = {
  name: String
};

const Item = mongoose.model("Item",itemSchema);

const item1 = new Item({
  name: "Welcome to your toddoList"
});

const item2 = new Item({
  name: "Hit the + button to add a new item"
});

const item3 = new Item({
  name:"<--Hit this to delete an item"
});

const listSchema={
  name:String,
  items:[itemSchema]
};

const List = mongoose.model("List",listSchema)

const defaultItems = [item1,item2,item3];
app.get("/", function(req, res){
Item.find({},function(err,foundItems){
  if(foundItems.length === 0){
    Item.insertMany(defaultItems,function(err){
      if(err){
        console.log(err)
      }else{
        console.log("Success")
      }
    });
    res.redirect("/")
  }else{
    let day = date.getDay();
    res.render("list",{ListTitle: day,newListItems: foundItems});
  }
})


});

app.get("/about",function(req,res){
  res.render("about");
})

app.post("/delete",function(req,res){
  const checkedItemId= req.body.checkbox;
  const listName = req.body.listName;
  let day = date.getDay();

  if(listName === day){
    Item.findByIdAndRemove(checkedItemId,function(err){
      if(!err){
        console.log("Successfullly deleted")
        res.redirect("/")
      }
    })
  }else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
      if(!err){
        res.redirect("/"+listName)
      }
    })

  }

  })

app.get("/:customListName",function(req,res){
  const customListName =  _.capitalize(req.params.customListName);

  List.findOne({name:customListName},function(err,foundList){
    if(!err){
      if(!foundList){
        //Create a new list
        const list = new List({
        name: customListName,
        items: defaultItems
        });
        list.save()
        res.redirect("/"+ customListName)
      } else{
        //Show an existing list
        res.render("List",{ListTitle:foundList.name,newListItems:foundList.items})
      }
    }
  })

});
app.post("/",function(req,res){
  const itemName = req.body.newItem;
  const item3 = new Item({
    name: itemName
  });
  item3.save();
  if(req.body.list === "Work"){
    res.redirect("/work");
  }
  else{
    res.redirect("/");
  }

});

let port = process.env.PORT;
if(port == null || port == ""){
  port = 3200;
}
app.listen(port, function(){
  console.log("Server has started successfully.");
});
