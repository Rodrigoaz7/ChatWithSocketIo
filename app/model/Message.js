
// A basic struct of messages
const mongoose  = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({ 
    msg: String,
    publica: Boolean,
    sender: String,
    reciever: String,
    foi_lida: {
    	type: Boolean,
    	default: true
    }
});

module.exports = mongoose.model('Mensagens', MessageSchema);