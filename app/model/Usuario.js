
// A basic struct of users
const mongoose  = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({ 
    nome: String, 
    username: {
    	type: String,
    	unique: true,
    	required: true
    },
    senha: String
});

module.exports = mongoose.model('Usuarios', UserSchema);