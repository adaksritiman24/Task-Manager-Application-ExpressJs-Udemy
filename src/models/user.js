const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');


const userSchema = mongoose.Schema( { 
    name : {
        type : String,
        required : true,
        trim : true,
    },
    age :  {
        type : Number,
        default : 0,
        validate(value){
            if(value < 0)
                throw new Error("Age must be a positive number.");
        }
    },

    tokens : [{
        token : {
            type : String,
            required : true
        }
    }],

    email : {
        type : String,
        required : true,
        trim : true,
        lowercase : true,
        unique : true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error("Email is invalid!");
        }
    },
    password : {
        type : String,
        required : true,
        minLength : [7, "Should be greater than 6 letters"],
        trim : true,
        validate(value) {
            if (value.toLowerCase().includes('password'))
                throw new Error("Password should not contain the word 'password'.")
        }
    },
    avatar : {
        type : Buffer//image data in base64 encoded format
    }   
} , {
    timestamps : true
});

userSchema.virtual('tasks',{
    ref : 'Task',
    localField : "_id",
    foreignField : "owner",

})

userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({_id : user._id.toString()},process.env.JWT_SECRET);

    user.tokens.push({ token });
    await user.save();
    return token; 
}

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

userSchema.statics.findByCredentials = async (email, password)=> {
    const user = await User.findOne( { email });

    if(!user){
        
        throw new Error("Unable to log In");
    }
        
    
    const isMathch = await bcrypt.compare(password, user.password);
    if(!isMathch){
        
        throw new Error("Unable to log In");
    }
    
    return user;
}


//has the plain text password before saving
userSchema.pre('save', async function(next){
    const user = this;

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})
//delete user tasks once user is reemoved
userSchema.pre('remove', async function(next){
    const user = this;
    await Task.deleteMany({owner : user._id});
    next();

})

const User = mongoose.model("User", userSchema);    


module.exports = User;