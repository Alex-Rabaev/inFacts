import {getTopicById, getAllTopics, addUserToTopic} from "../models/topicsModel.js";
import {getUserById, updateUserById} from "../models/usersModel.js"

// get all topics
export const _getAllTopics = async (req, res) => {
    try {
        const rows = await getAllTopics();
        res.json(rows);
    } catch (err) {
        res.status(404).json({msg: "something went wrong"});
    }
}

// get topic by id
export const _getTopicById = async (req, res) => {
    try {
        const topic = await getTopicById(req.params.id);
        if (!topic.length) {
            return res.status(404).json({msg: "The topic does not exist"});
        } else {
            return res.status(200).json(topic);
        }
    } catch (error) {
        return res.status(404).json({msg: "something went wrong", error});
    }
};

// add user to topic and add topic to user
export const _addUserToTopic = async (req, res) => {
    try {
        const _topic = await getTopicById(req.params.id);
        const _currentUser = await getUserById(req.body.user_id);
        const topic = _topic[0];
        const currentUser = _currentUser[0];

        if (!currentUser.user_topics.includes(topic.topic_id)) {
            const updatedTopicUsers = [...topic.added_by_users_arr, currentUser.user_id];
            await addUserToTopic(topic.topic_id, {added_by_users_arr: updatedTopicUsers});
            const updatedUserTopics = [...currentUser.user_topics, topic.topic_id];
            await updateUserById(currentUser.user_id, {user_topics: updatedUserTopics});
            res.status(200).json("topic has been added");
        } else {
            return res.status(403).json({msg: "User already has this topic"});
        }
    } catch (error) {
        return res.status(404).json({msg: "something went wrong"});
    }
}

//  remove user from topic and add topic from user
export const _removeUserFromTopic = async (req, res) => {
    try {
        const _topic = await getTopicById(req.params.id);
        const _currentUser = await getUserById(req.body.user_id);
        const topic = _topic[0];
        console.log(topic);
        const currentUser = _currentUser[0];
        console.log(currentUser);

        if (currentUser.user_topics.includes(topic.topic_id)) {
            console.log('in if statement');
            const updatedTopicUsers = topic.added_by_users_arr.filter(id => id !== currentUser.user_id);
            console.log(updatedTopicUsers);
            await addUserToTopic(topic.topic_id, {added_by_users_arr: updatedTopicUsers});
            const updatedUserTopics = currentUser.user_topics.filter(id => id !== topic.topic_id);
            console.log(updatedUserTopics);
            await updateUserById(currentUser.user_id, {user_topics: updatedUserTopics});
            res.status(200).json("topic has been removed");
        } else {
            return res.status(403).json({msg: "You didn't add this topic yet"});
        }
    } catch (error) {
        return res.status(404).json({msg: "something went wrong"});
    }
}

// get a random topic_id from the user_topics array of a user
export const _getRandomTopicIdFromUser = async (req, res) => {
    try {
        // 1. Retrieve user by user_id
        const userId = req.params.user_id;  // Or from req.body depending on your setup
        const user = await getUserById(userId);
        // console.log(user);

        let topicIds = [];

        // Check if user_topics is not empty
        if (user[0].user_topics && user[0].user_topics.length > 0) {
            topicIds = user[0].user_topics;
        } else {
            // If user_topics is empty, retrieve all topics
            const allTopics = await getAllTopics();
            topicIds = allTopics.map(topic => topic.topic_id);
        }
        // console.log(topicIds);

        // Generate a random index
        const randomIndex = Math.floor(Math.random() * topicIds.length);

        // Return the random topic_id
        const randomTopicId = topicIds[randomIndex];
        // console.log(randomTopicId);
        return res.status(200).json({ topic_id: randomTopicId });

    } catch (error) {
        return res.status(404).json({ msg: "something went wrong" });
    }
}