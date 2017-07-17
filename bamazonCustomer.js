var mysql = require('mysql');
var prompt = require('prompt');
var Table = require('cli-table');
var inquirer = require('inquirer');


var connection = mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    password:"",
    database:"bamazon"
});


// Connect to my database 
var checkandBuy = function(){

connection.query('SELECT*FROM products',function(err,res){
// Create a table to display the products
var table = new Table ( {
    head: ['ID', 'Product Name', 'Department', 'Price', 'Stock Quantity'],
    style:{
        head:['blue'],
        compact:false,
        colAligns:['center']
    }
                         
}
)

//Display All items for sale
console.log("Here Are all the items available for sale");
console.log("------------------------------------------");
for (var i = 0; i < res.length; i++) {
table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].sotock_quantity]);
   
}
console.log("-----------------------------------");

//Logs the cool Table with item in for purchase.
console.log(table.toString());
inquirer.prompt([{
    name:"itemid",
    type:"input",
    message:"What is the item ID you would like to buy?",
    validate: function(value){
        if(isNaN(value) == false){
            return true
        }else{false}
    }
},{
    name:"Quantity",
    type:"input",
    message:"How many of this items would you like to purchase?",
    validate:function(value){
        if(isNaN(value) == false){
            return true
        }else{false}
    }

}]).then(function(answer){
var chosenId = answer.itemid -1
var chosenProduct = res[chosenId]
var chosenQuantity = answer.Quantity

if(chosenQuantity < res[chosenId].sotock_quantity ){
console.log("Your total for " + "(" + answer.Quantity + ")" + " - " + res[chosenId].product_name + " is: " + res[chosenId].price * chosenQuantity)
connection.query("UPDATE products SET ? WHERE ?",[{
    sotock_quantity:res[chosenId].sotock_quantity - chosenQuantity
},{
    id:res[chosenId].id
}],function(err,res){if(err){console.log(err)}else{checkandBuy()}})
}

 });


})
    
    

}
checkandBuy()