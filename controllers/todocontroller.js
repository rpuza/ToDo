var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//Connect to the database
mongoose.connect('mongodb+srv://test:test@cluster0.ug6ad.mongodb.net/cluster0?retryWrites=true&w=majority',{ useUnifiedTopology: true,useNewUrlParser: true });

//Create a schema - This is like a blueprint
var todoSchema = new mongoose.Schema({
  item: String
});

var Todo = mongoose.model('Todo',todoSchema);

var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app){

app.get('/todo', function(req,res){
  //get data from mongodb and pass it to view
  Todo.find({},function(err,data){
    if(err) throw err;
    res.render('todo',{todos: data});
  });
});

app.post('/todo', urlencodedParser, function(req,res){
  //get data from view and add it to mongodb
  var newTodo = Todo(req.body).save(function(err,data){
    if(err) throw err;
    res.json({todos:data});
  });
});

app.delete('/todo/:item', function(req,res){
  //delete the requested item from mongodb
  Todo.find({item: req.params.item.replace(/\-/g," ")}).deleteOne(function(err,data){
    if(err) throw err;
    res.json({todos:data});
  });
});

};
