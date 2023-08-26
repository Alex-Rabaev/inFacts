import express from 'express';
import { _addConversation, _getConversationByUserId, _getConversationOfTwoUsers } from '../controllers/conversationsController.js';

const conversations_router = express.Router();

// add new conversation
conversations_router.post('/', _addConversation)

// get conversation of a user
conversations_router.get("/:id", _getConversationByUserId);

// get conversation of two users
conversations_router.get("/find/:firstUserId/:secondUserId", _getConversationOfTwoUsers);


export default conversations_router;