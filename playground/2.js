require("../src/db/mongoose");
const Task = require("../src/models/task");


// Task.findByIdAndDelete("622ecd48cec26d5a1999cae0")
// .then((response)=>{
//     console.log(response);
//     return Task.countDocuments({ completed : false});
// })
// .then((count)=> {
//     console.log(count);
// })
// .catch((error)=> {
//     console.log(error);
// })

const deleteAndCount = async(_id) => {
    const task = await Task.findByIdAndDelete(_id);
    console.log("Deleted task: \n", task);
    return await Task.countDocuments({ completed : false });
}

deleteAndCount("622f61d6d32af7fe614c3cdf")
.then((count)=>{
    console.log(count);
})
.catch((e)=>{
    console.log(e);
})