const { default: mongoose } = require('mongoose');
const Post = require('../models/postsModel');

const User = require('../models/userModel');


function identifyTags(text){
    const hashtagRegex = /\B#(\w*[a-zA-Z]+\w*)/g;
    const matches = text.match(hashtagRegex);
    return matches || [];
}



 
const addPost = async (req, res) => {
    const newPost = new Post(req.body);
    const user = null;
    if(mongoose.Types.ObjectId.isValid(req.body.user)){
        const user = new mongoose.Types.ObjectId(req.body.user);
    
    }else{
        res.status(500).json({ msg:0,erMsg:"Invalid user" })
        return
    }
    newPost.post = req.body.post;
    newPost.user.push(user);
    newPost.tags = identifyTags(newPost.post)
    const a = await User.findById(req.body.user)
    await newPost.save().then((data)=>{
        if(data){
            res.json({msg:1,post:data,firstname:a.firstname})
        }else{
            res.json({msg:0,erMsg:"Was not able to post please try again"})
        }
    }).catch((err)=>{
        res.status(500).json({ msg:0,erMsg:"Internal Error" })
    })


    
  };

const getAllPosts = async (req, res) => {

    Post.aggregate([
        {
            $lookup:{
                from: 'users', // The name of the User collection
                localField: 'user',
                foreignField: '_id',
                as: 'user'
            }
        }


    ]).sort({ createdAt: -1 }).then((posts)=>{

            res.json({ msg:1,posts })      
        
    }).catch((err)=>{
        res.status(500).json({ msg:0,erMsg:"Internal Error" })
    })
};





module.exports = {
addPost,
getAllPosts
}