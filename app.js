require('dotenv').config();
const express=require('express');
const app=express();
const { render } = require("ejs");
const path=require('path');
const mongoose =require('mongoose');
const userRoute=require('./routes/user');
const blogRoute=require('./routes/blog');
const cookiePaser=require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const port= process.env.PORT || 8000;
const Blog=require('./models/blog');
const methodOverride = require('method-override')
app.use(methodOverride('_method'))

mongoose.connect(process.env.MONGO_URL).then(e=> console.log('MongoDB connected'));

app.set('view engine', 'ejs');
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:false}));
app.use(cookiePaser());
app.use(express.json());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public')));


app.get('/',async (req,res)=>{
    // res.send('Welcome');
    // console.log(req.user);
    const allBlogs=await Blog.find({});
     res.render("home",{user:req.user, blogs:allBlogs,});
});
app.use('/user',userRoute);
app.use('/blog',blogRoute);
app.listen(port,()=>{
    console.log(`listening on http://localhost:${port}`)
})