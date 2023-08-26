import dotenv from "dotenv";
import fetch from "node-fetch";
import { _getRandomTopicIdFromUser, _getTopicById } from "./topicsController.js";
import { createPost } from "../models/postsModel.js";
import { getAllTopics, getTopicById } from "../models/topicsModel.js";
import { getUserById } from "../models/usersModel.js";

// AIzaSyClgmJIvGyrHdxk9r3pXZTx6BVAGl0Rnpw

// create a fact
export const _getInterestingFact = (req, res) => {
    const {topic, description} = req.body;
    const prompt = `Tell me an interesting fact about something on ${topic} topic (${description}), 
    without greetings and entry words like "One interesting fact about ${topic} is". Minimum text size 300 characters, Maximum text size 900 characters`
    baseGptRequest(prompt)
    .then(row => {
        res.json(row)
    })
    .catch(err => {
        res.status(500).json({msg: "something went wrong"})
    })
};

// create a query for proof links
export const _getProofSearchQuery = (req, res) => {
    const {fact} = req.body;
    const prompt = `${fact}. Give me 1 short good query for searching proof information of this fact in google`
    baseGptRequest(prompt)
    .then(row => {
        res.json(row)
    })
    .catch(err => {
        res.status(500).json({msg: "something went wrong"})
    })
    
}

export async function _getTop3Links(req, res) {

    const {query} = req.body;
    console.log('ssssssss',query);

        
    const links = await googleSearchRequest(query);
    return res.status(200).json(links);



    // .then(row => {
    //     console.log('in then aaaaa=>>>>',row);
    //     res.json(row)
    // })
    // .catch(err => {
    //     res.status(500).json({msg: "something went wrong"})
    // })
}


async function googleSearchRequest(query) {
    const apiKey = 'AIzaSyClgmJIvGyrHdxk9r3pXZTx6BVAGl0Rnpw'; // Replace with your Google Cloud API key
    const cx = 'a2bf4ea05b5314aaf'; // Replace with your Custom Search Engine ID
    const url = `https://www.googleapis.com/customsearch/v1?q=${query}&key=${apiKey}&cx=${cx}&num=3`;
    console.log('url in googleSearchRequest', url);
    const response = await fetch(url);
    console.log('url in googleSearchRequest', response);
    const data = await response.json();
    console.log('data in googleSearchRequest', data);

    // console.log('bbbbbbb=>>>>',data);
    return data.items.map(item => item.link);
}

async function baseGptRequest(prompt) {
    const api_url = 'https://api.openai.com/v1/chat/completions';
    const api_key = "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";
    

    const headers = {
        'Authorization': `Bearer ${api_key}`,
        'Content-Type': 'application/json'
    };

    const body = JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                "role": "user",
                "content": `${prompt}`
                }
            ],
            "temperature": 1,
            "max_tokens": 512,
            "top_p": 1,
            "frequency_penalty": 0,
            "presence_penalty": 0
        });

    const response = await fetch(api_url, {method: 'POST', headers: headers, body: body});
    const data = await response.json();

    return data.choices[0].message.content.trim();
}

// getInterestingFact('dinosaurs').then(console.log).catch(console.error);


// creating fact post object 

export const _createFactPost = async (req, res) => {
    try {
        const userId = req.body.user_id;
        const user = await getUserById(userId);
        let topicIds = [];
        if (user[0].user_topics && user[0].user_topics.length > 0) {
            topicIds = user[0].user_topics;
        } else {
            const allTopics = await getAllTopics();
            topicIds = allTopics.map(topic => topic.topic_id);
        }
        const randomIndex = Math.floor(Math.random() * topicIds.length);
        const randomTopicId = topicIds[randomIndex];
        console.log(randomTopicId);

        const topic_info = await getTopicById(randomTopicId)

        console.log("Topic_info 111111 ------->>>>>", topic_info[0]);
        console.log("Topic_info ===>", topic_info, topic_info[0].topic_name, topic_info[0].topic_img);

        const topic_name = topic_info[0].topic_name
        const topic_img = topic_info[0].topic_img
        const topic_desc = topic_info[0].description
        // Step 1: Generate a fact based on the topic
        const factResponse =  await baseGptRequest(`Tell me an interesting fact about something on ${topic_name} topic (${topic_desc}), 
    without greetings and entry words like "One interesting fact about ${topic_name} is". Minimum text size 300 characters, Maximum text size 900 characters`);
        const description = factResponse;
        console.log("after getting fact response", factResponse);

        // Step 2: Generate a search query for the fact
        const searchQueryResponse = await baseGptRequest(`${description}. Give me 1 good and short query for searching proof information of this fact in google`);
        const query = searchQueryResponse.replace(/^"|"$/g, '');
        console.log("after getting query for google --> ", query);

        // Step 3: Get the top 3 proof links using the search query

        const linksResponse = await googleSearchRequest(query);
        console.log("linksResponse ----->>>>>>", linksResponse);


        // Gather other information
        const user_id = 21; // This could be dynamically determined based on the logged-in user or passed in via the request
        const isfact = true;
        console.log(isfact);

        // Step 4: Create the post object
        const postObject = {
            user_id,
            description,
            isfact,
            prooflinks : linksResponse,
            topic_img,
            topic_id: randomTopicId
        };
        console.log("main object ----> ", postObject);

        // Step 5: Insert the post object into the posts table
        // This depends on your DB setup, so you'd use whatever method you have in place to insert data into the posts table
        const insertedPost = await createPost(
            user_id,
            description,
            undefined,
            isfact,
            linksResponse,
            undefined,
            randomTopicId,
            topic_img
        ); // Replace with your DB method

        res.status(200).json(insertedPost);

    } catch (error) {
        res.status(500).json({ msg: "something went wrong", error: error.message });
    }
};