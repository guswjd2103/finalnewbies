const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true });
//const conn = mongoose.connection;
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : String,
    password : String,

    title : String,
    src : String,
    price : String
})

/*const list = new Schema({
    title : String,
    src : String,
    price : String
})*/
//const List = mongoose.model('user',list);
var User = mongoose.model('user', userSchema);
module.exports = User;
