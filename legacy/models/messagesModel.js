import { db } from "../config/db.js";

// ADD NEW MESSAGE 
export const addMessage = (conversation_id, sender_id, text) => {
    return db('messages')
    .insert({conversation_id, sender_id, text}) // Pass an object
    .returning('*')
}

// GET MESSAGES
export const getMessagesByConversationId = (conversation_id) => {
    return db('messages')
    .select('*')
    .where('conversation_id', conversation_id)
    .orderBy('created_at', 'asc'); // Order messages by their creation time, oldest first
}
