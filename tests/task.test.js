const request = require("supertest");
const Task = require("../src/models/task");
const app = require('../src/app');

const {userOne, userTwo, populateDb, taskOneId} = require("./db");

beforeEach(populateDb);

test("should create task for user", async()=>{
    const response = await request(app)
    .post('/tasks')
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
        'description' : "from my test"
    })
    .expect(201);
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull();
});

test("should return two tasks for user", async()=>{
    const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

    expect(response.body.length).toEqual(2);
})


test("should not delete other user's task", async()=>{
    await request(app)
    .delete(`/tasks/${taskOneId}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);

    const taskOne = await Task.findById(taskOneId);
    expect(taskOne).not.toBeNull();
})