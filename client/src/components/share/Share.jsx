import React, { useEffect, useRef, useState } from 'react'
import './share.css'
import PermMediaIcon from '@mui/icons-material/PermMedia';
import CircularProgress from '@mui/material/CircularProgress';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function Share(props) {
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const user = props.user;
    // console.log(user);
    const description = useRef();
    const [file, setFile] = useState(null)
    const [isFetching, setIsFetching] = useState(false)
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [isFact, setPostOrFact] = useState(false);
    const [links, setLinks] = useState([""]);
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState("");



    useEffect(() => {
        const getAllTopics = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/topics/all`);
                const topics = res.data.sort((a, b) => a.topic_id - b.topic_id);
                setTopics(topics)
            } catch (error) {
                console.log(error);
            }
            }
        getAllTopics();
        // console.log(topics);
    }, []);


    const postOrFactHandler = () => {
        // console.log(isFact);
        setPostOrFact(!isFact);
        // console.log(isFact);
    }

    const addLink = () => {
        if (links.length < 3) {
            setLinks(prevLinks => [...prevLinks, ""]);
        }
    };

    const removeFile = () => {
        setFile(null);
        setImagePreviewUrl(null);
    };

    const uploadFile = async () => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await axios.post(`${BASE_URL}/api/uploads/upload-single`, formData);
            return res.data;
        } catch (e) {
            console.log(e.response.data.msg);  
        }
    };


    const submitHandler = async (event) => {
        event.preventDefault();
        setIsFetching(!isFetching);
        // console.log("selectedTopic", selectedTopic);
        const matchedTopic = topics.find(topic => topic.topic_id === parseInt(selectedTopic));
        const newPost = !isFact ? {
            user_id: user.user_id,
            description: description.current.value
        } : {
            user_id: user.user_id,
            description: description.current.value,
            isfact: isFact,
            prooflinks: links,
            topic_id: selectedTopic,
            topic_img: matchedTopic ? matchedTopic.topic_img : null,
        }
        // console.log("newPost ---->>>", newPost);
        if (file) {
            const uploadedFileData = await uploadFile();
            newPost.img = uploadedFileData[0].id;
        }

        try {
            await axios.post(`${BASE_URL}/api/posts/create`, newPost)
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className='share'>
            <div className="shareWrapper">
                <div className="shareTop">
                    <img className='shareProfileImg' src={user.profilepicture} alt="" />
                    <textarea 
                        maxLength={1000}
                        placeholder={`Whats in your mind ${user.firstname || user.username}?`} 
                        className="shareInput"
                        ref={description}
                    />
                </div>
                {
                    isFact && links.map((link, index) => (
                        <div key={index} className="linkInputWrapper">
                            <input 
                                value={link}
                                onChange={(e) => {
                                    const updatedLinks = [...links];
                                    updatedLinks[index] = e.target.value;
                                    setLinks(updatedLinks);
                                }}
                                placeholder="Enter link..."
                            />
                            {index === links.length - 1 && links.length < 3 && (
                                <button onClick={addLink}>+</button>
                            )}
                        </div>
                    ))
                }
                {
                    isFact && (<div className="topicSelector">
                        <select
                            value={selectedTopic}
                            onChange={(e) => setSelectedTopic(e.target.value)}
                        >
                            <option value="No topic" disabled>Select a topic</option>
                            {topics.map((topic) => (
                                <option key={topic.topic_id} value={topic.topic_id}>
                                    {topic.topic_name}
                                </option>
                            ))}
                        </select>
                    </div>)
                }
                {/* <hr className="shareHr" /> */}
                {imagePreviewUrl && (<div className="imageContainer">
                    <img src={imagePreviewUrl} alt="Selected Preview" className="selectedImagePreview" />
                    <CancelIcon onClick={removeFile} className="removeFileButton"></CancelIcon>
                </div>
                )}
                <form className="shareBottom" onSubmit={submitHandler}>
                    <div className="shareOptions">
                        <label htmlFor='file' className="shareOption">
                            <PermMediaIcon htmlColor={file ? 'tomato' : 'green'} className='shareIcon'/>
                            <span className="shareOptionText">Photo</span>
                            <input 
                                style={{display: 'none'}} 
                                name='file' 
                                type="file" 
                                id='file' 
                                accept='.png,.jpeg,.jpg' 
                                onChange={(e)=>{
                                    setFile(e.target.files[0]);
                                    setImagePreviewUrl(URL.createObjectURL(e.target.files[0]));
                                }}
                            />
                        </label>
                    <FormControlLabel 
                        control={<Switch onChange={postOrFactHandler}/>} 
                        label={isFact ? "Fact" : "Post"} />
                    </div>
                    <button className="newFactButton" type='button' disabled={isFetching}>
                        {isFetching ? <CircularProgress color="success" size={'15px'}/> : "New Fact"}
                    </button>
                    <button className="shareButton" type='submit' disabled={isFetching}>
                        {isFetching ? <CircularProgress color="success" size={'15px'}/> : "Submit"} 
                    </button>
                </form>

            </div>
        </div>
    )
}
