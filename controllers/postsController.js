import { createPost, getPostById, updatePostById, updateLastUpdate, deletePostById, getPostsByUserId } from "../models/postsModel.js";
import { getUserById } from "../models/usersModel.js";

// create a post
export const _createPost = (req, res) => {
    const {user_id, description, img, isfact, prooflinks, img_location, topic_id, topic_img} = req.body;

    createPost(user_id, description, img, isfact, prooflinks, img_location, topic_id, topic_img)
    .then(row => {
        res.json(row)
    })
    .catch(err => {
        res.status(500).json({msg: "something went wrong", err})
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

// get all posts of a user by user_id
export const _getPostsByUserId = async (req, res) => {
    try {
        const posts = await getPostsByUserId(req.params.id);
        if (!posts.length) {
            return res.status(404).json({msg: "This user hasn't posted anything yet"});
        } else {
            return res.status(200).json(posts);
        }
    } catch (error) {
        return res.status(404).json({msg: "something went wrong"});
    }
};

// get all posts of followers
export const _getFollowersPosts = async (req, res) => {
    try {
        const _currentUser = await getUserById(req.params.id);
        const currentUser = _currentUser[0];
        console.log(currentUser);

        const userPosts = await getPostsByUserId(currentUser.user_id);
        console.log(userPosts);
        const followsPosts = await Promise.all(currentUser.followers.map((fol_id) =>{
            return getPostsByUserId(fol_id);
        }));
        const allUserPosts = userPosts.concat(...followsPosts);
        if (!allUserPosts.length) {
            return res.status(404).json({msg: "You and those you follow have not made any posts yet"});
        } else {
            return res.status(200).json(allUserPosts);
        }
    } catch (error) {
        return res.status(404).json({msg: "something went wrong"});
    }
};