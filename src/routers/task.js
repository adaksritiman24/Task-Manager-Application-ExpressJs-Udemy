const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const { request } = require("express");
const User = require("../models/user");

const router = new express.Router();

router.post('/tasks', auth,  async (req, res)=> {
    const task = new Task({...req.body, owner : req.user._id});
    
    try {
        
        await task.save();
        res.status(201).send(task);
    }
    catch (e) {

        res.status(400).send(e);
    }
    
})

// get /tasks?completed=true
//get /tasks?limit=10&skip=10
// get /tasks?sortBy=createdAt:asce
router.get("/tasks", auth, async (req, res)=> {

    const match = {};
    const sort = {};
    const limit = parseInt(req.query.limit);
    if(req.query.completed)
        match.completed = req.query.completed === 'true';

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(":");
        sort[parts[0]] = parts[1] === "desc"? -1 : 1;
    }

    try {
        // const tasks = await Task.find({ owner : req.user._id});
        const tasks = await req.user.populate({
            path : "tasks",
            match,
            options : {
                limit,
                skip : parseInt(req.query.page)*limit,
                sort,
            }
            
        })

        res.send(tasks.tasks);
    }
    catch (e) {
        res.status(500).send();
    }

})



router.get("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOne({ _id , owner : req.user._id });
        if(!task) {
            return res.status(404).send();
        }
        res.send(task);
    }

    catch (e) {
        res.status(500).send();
    }

})


router.patch ( "/tasks/:id", auth, async (req, res)=> {
    
    const _id = req.params.id;
    const updatesRequested = Object.keys(req.body);
    const allowedUpdates = ['description','completed'];
    
    const isValidOperation = updatesRequested.every((field)=> allowedUpdates.includes(field) );

    if(!isValidOperation)
        return res.status(404).send({error : "Invlid Updates"});
    
    try {
        const task = await Task.findOne({ _id , owner : req.user._id});
        
        
        if(!task)
            return res.status(404).send();
            
        updatesRequested.forEach((field) => {
            task[field] = req.body[field];
        });
        
        await task.save();

        return res.send(task);    
    }
    catch (e) {
        res.status(400).send();
    }
})

router.delete("/tasks/:id", auth, async (req, res)=>{
    
    try {
        const task = await Task.findOneAndDelete({_id : req.params.id, owner : req.user._id});
        
        if(!task)
            return res.status(404).send();
        res.send(task);    
    }
    catch (e) {
        res.status(500).send();
    }
})

module.exports = router;