import { addConversation, getConversationByUserId, getConversationOfTwoUsers } from "../models/conversationsModel.js";

// add a conversation
export const _addConversation = (req, res) => {
    const {senderId, receiverId} = req.body;
    addConversation(senderId, receiverId)
    .then(row => {
        res.json(row)
    })
    .catch(err => {
        res.status(500).json({msg: "something went wrong", err})
    })
};

// get conversation by user_id
export const _getConversationByUserId = async (req, res) => {
    try {
        const conversation = await getConversationByUserId(req.params.id);
        if (!conversation.length) {
            return res.status(404).json({msg: "The conversation does not exist"});
        } else {
            return res.status(200).json(conversation);
        }
    } catch (error) {
        return res.status(404).json({msg: "something went wrong"});
    }
};

// get conversation of two users
export const _getConversationOfTwoUsers = async (req, res) => {
  try {
    const conversation = await getConversationOfTwoUsers(req.params.firstUserId, req.params.secondUserId);
    res.status(200).json(conversation)
  } catch (err) {
    res.status(500).json(err);
  }
};