const {Schema,model}=require('mongoose');

const contactSchema=new Schema({
    reqName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    query:{
        type:String,
        required:true,
    },
    date:{
        type:String,
        default:new Date(+new Date() + 7*24*60*60*1000)
    },
});
const Contact=model('contact',contactSchema);
module.exports=Contact;