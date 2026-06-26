import { db } from "../config/db.js";

// CREATE A POST 
export const createPost = (user_id, description, img, isfact, prooflinks, img_location, topic_id, topic_img) => {
    return db('posts')
    .insert({user_id, description, img, isfact, prooflinks, img_location, topic_id, topic_img}) // Pass an object
    .returning('*')
}

// GET A POST BY ID
export const getPostById = (postId) => {
    return db('posts')
    .select('*')
    .where({post_id: postId})
}

// UPDATE A POST BY ID
export const updatePostById = (postId, updatedData) => {
    return db('posts')
    .where({post_id: postId})
    .update(updatedData);
}

export const updateLastUpdate = (postId) => {
    return db('posts')
    .where({post_id: postId})
    .update({updated_at: new Date()});
}

// DELETE POST BY ID
export const deletePostById = (user_id, postId) => {
    return db('posts')
    .where({post_id: postId})
    .del();
}

// GET ALL POSTS OF A USER BY user_id
export const getPostsByUserId = async (userId) => {
    console.log("in getPostsByUserId ________________ !!!!!!!!!, user_id = ", userId);
    const x = await db('posts')
    .select('*')
    .where({user_id: userId})
    console.log("x =======>>>>", x);
    return x;
}

export const getPostsByUserIds = async (userIds) => {
    const x = await db('posts')
    .select('*')
    .whereIn("user_id", userIds)
    return x;
}