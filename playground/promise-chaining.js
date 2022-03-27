require('../src/db/mongoose');
const User = require("../src/models/user");
const Task = require("../src/models/task");



// User.findByIdAndUpdate("622ecc54cd779073b83537ee", {age : 1}).then((user)=>{
//     console.log(user);
//     return User.countDocuments({age : 1});
// })
// .then((result)=>{
//     console.log(result);
// })
// .catch((error)=>{
//     console.log(error);
// })

// Task.find({}).count().then((count)=>{
//     console.log(count);
// })
// .catch((error)=>{
//     console.log(error);
// })




const updateAgeAndCount = async (_id, age) => {
    const user = await User.findByIdAndUpdate(_id , { age });
    const count = await User.countDocuments({ age });
    return count;
}

updateAgeAndCount("622ecc54cd779073b83537ee", 2).then((count) => {
    console.log(count);
})
.catch((error) => {
    console.log(error);
})