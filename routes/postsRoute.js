import express from 'express';
import { 
        _createPost, 
        _updatePostById, 
        _deletePostById, 
        _likePost, _getPostById, 
        _getPostsByUserId,
        _getFollowersPosts
    } from '../controllers/postsController.js';

const posts_router = express.Router();

// create a post
posts_router.post('/create', _createPost)

// update a post
posts_router.put("/update/:id", _updatePostById);

// delete a post
posts_router.delete("/delete/:id", _deletePostById);

// like a post
posts_router.put("/like/:id", _likePost);

// get a post
posts_router.get("/:id", _getPostById);

// get all posts of a user by user_id
posts_router.get("/user/:id", _getPostsByUserId);

// get all posts of user followers 
posts_router.get("/followers/:id", _getFollowersPosts);

export default posts_router;