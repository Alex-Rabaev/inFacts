import { createPost, getPostById, updatePostById, updateLastUpdate, deletePostById } from "../models/postsModel.js";

// create a post
export const _createPost = (req, res) => {
    const {user_id, description, img} = req.body;

    createPost(user_id, description, img)
    .then(row => {
        res.json(row)
    })
    .catch(err => {
        res.status(500).json({msg: "something went wrong"})
    })
};

// update a post by id
export const _updatePostById = async (req, res) => {
    try {
        const _post = await getPostById(req.params.id);
        const post = _post[0];
        if (post.user_id === req.body.user_id) {
            await updatePostById(req.params.id, req.body);
            await updateLastUpdate(req.params.id);
            res.status(200).json("The post has been updated")
        } else {
            return res.status(403).json({msg: "You can update only your post"});
        }
    } catch (error) {
        return res.status(404).json({msg: "something went wrong"});
    }
};

// delete post
export const _deletePostById = async (req, res) => {
    try {
        const _post = await getPostById(req.params.id);
        const post = _post[0];
        if (post.user_id === req.body.user_id  || req.body.isAdmin) {
            await deletePostById(req.body.user_id, req.params.id);
            res.status(200).json("The post has been deleted")
        } else {
            return res.status(403).json({msg: "You can delete only your post"});
        }
    } catch (error) {
        return res.status(404).json({msg: "something went wrong"});
    }
};

// like/unlike a post
export const _likePost = async (req, res) => {
    try {
        const _post = await getPostById(req.params.id);
        const post = _post[0];
        if (!post.likes.includes(req.body.user_id)) {
            const updatedLikes = [...post.likes, req.body.user_id];
            await updatePostById(req.params.id, {likes: updatedLikes});
            return res.status(200).json("You liked this post");
        } else {
            const updatedLikes = post.likes.filter(id => id !== req.body.user_id);
            await updatePostById(req.params.id, {likes: updatedLikes});
            return res.status(200).json("You unliked this post");
        }
    } catch (error) {
        return res.status(404).json({msg: "something went wrong"});
    }
};

// get post by id
export const _getPostById = async (req, res) => {
    try {
        const post = await getPostById(req.params.id);
        if (!post.length) {
            return res.status(404).json({msg: "The post does not exist"});
        } else {
            return res.status(200).json(post);
        }
    } catch (error) {
        return res.status(404).json({msg: "something went wrong"});
    }
    
};