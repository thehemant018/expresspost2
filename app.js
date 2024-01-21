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

if (!process.env.MONGO_URL) {
    console.error('MONGO_URL is not defined in the environment variables.');
    process.exit(1); // Exit with an error code
}
mongoose.connect(process.env.MONGO_URL).then(e=> console.log('MongoDB connected'));

app.set('view engine', 'ejs');
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:false}));
app.use(cookiePaser());
app.use(express.json());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public')));


app.get('/',async (req,res)=>{
    try {
        console.log('Before fetching blogs');
        const allBlogs=await Blog.find({});
        console.log('after fetching blogs');
     res.render("home",{user:req.user, blogs:allBlogs,});
    } catch (error) {
        next(error); 
    }
    
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.use('/user',userRoute);
app.use('/blog',blogRoute);
app.listen(port,()=>{
    console.log(`listening on http://localhost:${port}`)
})