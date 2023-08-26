import express from 'express';
import { 
        _getAllTopics, 
        _getTopicById,
        _addUserToTopic,
        _removeUserFromTopic,
        _getRandomTopicIdFromUser
    } from '../controllers/topicsController.js';

const topics_router = express.Router();

// get all topics
topics_router.get('/all', _getAllTopics)

// get topic by id
topics_router.get("/:id", _getTopicById);

// add topic to user 
topics_router.put('/add/:id', _addUserToTopic)

// add topic to user 
topics_router.put('/remove/:id', _removeUserFromTopic)

// get a random topic_id from the user_topics array of a user
topics_router.get('/randomtopic/:user_id', _getRandomTopicIdFromUser)

export default topics_router;