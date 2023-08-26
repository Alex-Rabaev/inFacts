import { db } from "../config/db.js";

// ADD NEW CONVERSATION 
export const addConversation = (senderId, receiverId) => {
    return db('conversations')
    .insert({members: [senderId, receiverId]}) // Pass an object
    .returning('*')
}

// GET A CONVERSATION OF A USER
export const getConversationByUserId = (userId) => {
    return db('conversations')
    .select('*')
    .whereRaw('? = ANY(members)', [userId]); 
}

// GET A CONVERSATION OF TWO USERS
export const getConversationOfTwoUsers = (firstUserId, secondUserId) => {
    return db('conversations')
    .select('*')
    .whereRaw('? = ANY(members) AND ? = ANY(members)', [firstUserId, secondUserId]); 
}