import express from 'express';
import { _addMessage, _getMessagesByConversationId } from '../controllers/messagesController.js';

const messages_router = express.Router();

// add new message
messages_router.post('/', _addMessage)

// get messages by conversation_id
messages_router.get('/:conversation_id', _getMessagesByConversationId);



export default messages_router;