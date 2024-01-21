const {Router}=require('express');
const { model } = require('mongoose');
const User=require('..//models/user');
const Contact=require('..//models/contact');
const router=Router();

router.get('/signin',(req,res)=>{
    return res.render('signin');
});

router.get('/signup',(req,res)=>{
    return res.render('signup');
});

router.post('/signin',async(req,res)=>{
    const{email,password}=req.body;
    try {
        const token =await User.matchPasswordAndGenerateToken(email,password);
        // console.log('Token',token);
        return res.cookie("token",token).redirect('/');
    } catch (error) {
        return res.render('signin',{
            error:"Incorrect email or password"
        });
    }
});

router.post('/signup',async (req,res)=>{
    const {userName,email,password}=req.body;
    await User.create({
        userName,
        email,
        password
    });
    return res.redirect("/");
});

router.get('/contact',(req,res)=>{
    return res.render('contact');
});

router.post('/contact',async(req,res)=>{
    const {reqName,email,query}=req.body;
    await Contact.create({
        reqName,
        email,
        query
    });
    return res.redirect("/");
})

router.get('/logout',(req,res)=>{
    res.clearCookie("token").redirect("/");
})
module.exports=router;