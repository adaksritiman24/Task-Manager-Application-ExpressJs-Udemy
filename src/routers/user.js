const express = require('express');
const sharp = require('sharp');
const {sendWelcomeEmail, sendCancellationEmail} = require("../emails/accounts");
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');

const router = express.Router();

router.post('/users', async (req, res)=> {
    const user = new User(req.body);

    try{
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    }
    catch(e) {
        res.status(400).send(e);
    }
});

router.post('/users/login', async (req, res)=> {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user : user, token});
    }
    catch (e) {
        console.log(e);
        res.status(400).send();
    }
});

router.post('/users/logout', auth, async (req, res)=> {
    try {
        req.user.tokens = req.user.tokens.filter((token)=> token.token != req.token); //keep all tokens but the current one 
        await req.user.save();
        res.send();
    }
    catch (e) {
        res.status(500).send();
    }
});

router.post('/users/logoutAll', auth, async(req, res)=>{
    try {
        req.user.tokens = []
        await req.user.save();
        res.send();
    }
    catch (e) {
        res.status(500).send();
    }
})

router.get("/users/me", auth, async (req, res)=> {
    res.send(req.user);
})



router.patch("/users/me", auth, async (req, res) => {
    
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name' , "email" , "password", "age"];
    const isValidOperation = updates.every( (update)=> {return allowedUpdates.includes(update); } );

    if (!isValidOperation) 
        return res.status(400).send({error : "Invlid Updates"});

    try {

        updates.forEach((update)=>{
            req.user[update] = req.body[update];
        })

        await req.user.save();

        // const user = await User.findByIdAndUpdate(_id , req.body, {new : true, runValidators : true});
        // if(!user)
        //     return res.status(404).send();
        res.send(req.user);    
    }  
    catch (e) {
        res.status(400).send(e);
    }
})

router.delete("/users/me", auth, async (req, res)=> {
    try {
        //const deletedUser = await User.findByIdAndDelete(_id);
        // if(!deletedUser)
        //     return res.status(404).send();
        await req.user.remove();
        sendCancellationEmail(req.user.email, req.user.name);
        res.send(req.user);    
    }
    catch (e) {
        res.status(500).send();
    }
})


const avatar_upload = multer({

    limits : {
        fileSize : 1000000, //in bytes
    },
    fileFilter(req, file, cb){
        // cb(new Error("Please Upload an image."))
        // cb(undefined, true)
        // cd(undefined, false)

        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error("Please upload a .jpg, .jpeg or .png file."))
        }
        return cb(undefined, true); //accepted
    }
})

//avatars
router.post('/users/me/avatar', auth,avatar_upload.single('avatar') , async (req, res)=> {
    const buffer = await sharp(req.file.buffer).resize( {width:250, height:250} ).png().toBuffer();
    req.user.avatar = buffer;
    // req.user.avatar = req.file.buffer;

    await req.user.save();
    res.send();

}, (error, req, res, next)=>{
    res.status(400).send({error : error.message});
})

router.delete('/users/me/avatar', auth, async(req, res)=>{
    req.user.avatar = undefined;
    await req.user.save();

    res.send();
})

router.get('/users/:id/avatar', async (req, res)=> {
    try {
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar ) {
            throw new Error();
        }
        
        res.set('Content-Type', 'image/png'); //setting headers
        res.send(user.avatar);
    }
    catch (e) {
        res.status(404).send();
    }
})
module.exports = router;