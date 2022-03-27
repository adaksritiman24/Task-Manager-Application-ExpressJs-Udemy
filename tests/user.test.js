const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const {userOne, userOneId, populateDb} = require("./db");

beforeEach(populateDb);

// afterEach(()=>{
//     console.log("After Each");
// })

test("Should sign up a new user", async ()=>{
    const response = await request(app)
    .post('/users')
    .send( {
        name : "Sritiman",
        email : "sritiman@gmail.com",
        password : "sritiman1999",
    })
    .expect(201); //created

    //Assert that the db was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();
})

test("Should be able to log in", async ()=>{
    const response  = await request(app)
    .post("/users/login")
    .send( { 
        email : userOne.email,
        password : userOne.password,
    } )
    .expect(200); //OK

    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();
    expect(response.body.token).toBe( user.tokens[1].token );
})

test("Should not login non-existent user",  async()=>{
    await request(app)
    .post("/users/login")
    .send({
        email : "nonexistant@gmail.com",
        password : "non-existant",
    })
    .expect(400);//bad request
})

test("should get profile for user", async ()=>{
    await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`) //setting headers
    .send()
    .expect(200);
})

test("should not get profile for unauthenticated user", async()=>{
    await request(app)
    .get("/users/me")
    .send()
    .expect(401);
})

test("should delete account for user if authenticated", async()=>{
    await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

    const user = await User.findById(userOneId);
    expect(user).toBeNull();
})

test('should not delete account for unauthorized user', async ()=>{
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401);
})

test('should upload avatar image', async ()=>{
    await request(app)
    .post("/users/me/avatar")
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar','tests/fixtures/profile-pic.jpg')
    .expect(200);

    const user = await User.findById(userOne._id)
    expect(user.avatar).toEqual(expect.any(Buffer));
})


test('Should update name field for authenticated user', async ()=>{
    await request(app)
    .patch("/users/me")
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        name : "Mike Nills"
    })
    .expect(200); //OK

    const user = await User.findById(userOne._id);
    expect(user.name).toEqual("Mike Nills");
})

test('Should not update invalid user fields', async ()=>{
    await request(app)
    .patch("/users/me")
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        location : "Chennai"
    })
    .expect(400);//bad request
})