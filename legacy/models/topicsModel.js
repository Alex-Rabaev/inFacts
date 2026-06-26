import { db } from "../config/db.js";

// CREATE A TOPIC 
// export const createTopic = (user_id, description, img) => {
//     return db('posts')
//     .insert({user_id, description, img}) // Pass an object
//     .returning('*')
// }

// GET A TOPIC BY ID
export const getTopicById = (topic_id) => {
    return db('topics')
    .select('*')
    .where({topic_id})
}

// GET ALL TOPICS
export const getAllTopics = () => {
    return db('topics')
    .select('*')
    .orderByRaw('array_length(added_by_users_arr, 1) DESC');
}

// ADD USER TO TOPIC BY ID
export const addUserToTopic = (topic_id, updatedData) => {
    return db('topics')
    .where({topic_id})
    .update(updatedData);
}