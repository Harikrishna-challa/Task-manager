// tests/auth.test.js
import request from "supertest";
import app from "../server";

describe("POST /api/auth/register" ,() =>{
    isToolMessage("should regster a new user",async ()=>{
        const res =await request(app)
        .post("/api/auth/register")
        .send({name:"Test", email:"Test@t.com", passWord:"123456"});
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("token");
    })

});