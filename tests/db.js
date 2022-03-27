const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../src/models/user');
const Task = require('../src/models/task');

const userOneId = mongoose.Types.ObjectId();
const userOne = {
    _id : userOneId,
    name : "Mike",
    email : "mike@gmail.com",
    password : "mike1999",
    tokens : [
        {
            token : jwt.sign({_id : userOneId}, process.env.JWT_SECRET)
        }
    ]
}
// beforeEach( async()=>{
//     await User.deleteMany();
//     await new User(userOne).save();
// })


const userTwoId = mongoose.Types.ObjectId();
const userTwo = {
    _id : userTwoId,
    name : "Rahul",
    email : "rahul@gmail.com",
    password : "rahul1999",
    tokens : [
        {
            token : jwt.sign({_id : userTwoId}, process.env.JWT_SECRET)
        }
    ]
}

const taskOneId = mongoose.Types.ObjectId();
const taskOne = {
    _id : taskOneId,
    description : "First test task",
    completed : false,
    owner : userOne._id
}
const taskTwo = {
    _id : mongoose.Types.ObjectId(),
    description : "Second test task",
    completed : true,
    owner : userOne._id
}
const taskThree = {
    _id : mongoose.Types.ObjectId(),
    description : "third test task",
    completed : true,
    owner : userTwo._id
}

const populateDb = async()=>{
    await User.deleteMany();
    await Task.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();

    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();

}

module.exports = {
    userOneId,
    userOne,
    populateDb,
    userTwoId,
    userTwo,
    taskOneId
}

