import express from 'express';

const authRouter = express.Router();

authRouter.get("/", (req,res) => {
    res.send("hey it's auth route")
});

export default authRouter;