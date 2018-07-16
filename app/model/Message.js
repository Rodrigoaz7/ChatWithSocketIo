
// A basic struct of messages
const mongoose  = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({ 
    msg: String,
    FoiLida: Boolean,
    sender: String,
    reciever: String
});

module.exports = mongoose.model('Mensagens', MessageSchema);