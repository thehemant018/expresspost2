const { render } = require('ejs');
const {Router}=require('express');
const router=Router();
const multer=require('multer');
const path=require('path');
const Blog=require('../models/blog')
const Comment=require('../models/comment')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
        const fileName=`${Date.now()}-${file.originalname}`;
        cb(null,fileName);
    }
  })
  
  const upload = multer({ storage: storage })
  


router.get('/add-new',(req,res)=>{
    return res.render('addBlog',{
        user:req.user,
    })
})
router.post('/',upload.single("coverImage"),async (req,res)=>{
//    console.log(req.body);
//    console.log(req.file);
    const {title,body}=req.body;
    const blog=await Blog.create({
        body,
        title,
        createdBy:req.user._id,
        coverImage:`/uploads/${req.file.filename}`
    });
   return res.redirect(`/blog/${blog._id}`);
})



router.get('/:id',async (req,res)=>{
    const blog=await Blog.findById(req.params.id).populate('createdBy');
    const comments=await Comment.find({blogId: req.params.id}).populate('createdBy');
    return res.render('blog',{
        user:req.user,
        blog,
        comments,
    })
});

router.delete('/deletepost/:bid',async (req,res)=>{
    let blog = await Blog.findByIdAndDelete(req.params.bid);
    console.log('post deleted')
    return res.redirect('/');
})



router.post('/comment/:blogId',async (req,res)=>{
    const comment=await Comment.create({
        content:req.body.content,
        blogId:req.params.blogId,
        createdBy:req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports=router;