import { addMessage, getMessagesByConversationId } from "../models/messagesModel.js";

// add a message
export const _addMessage = (req, res) => {
    const {conversation_id, sender_id, text} = req.body;

    addMessage(conversation_id, sender_id, text)
    .then(row => {
        // console.log('in then');
        res.json(row)
    })
    .catch(err => {
        res.status(500).json({msg: "something went wrong", err})
    })
};

// get messages
export const _getMessagesByConversationId = (req, res) => {
    const { conversation_id } = req.params; // Assuming you pass the conversationId as a route parameter

    getMessagesByConversationId(conversation_id)
    .then(messages => {
        res.json(messages);
    })
    .catch(err => {
        res.status(500).json({msg: "Something went wrong", err});
    });
};