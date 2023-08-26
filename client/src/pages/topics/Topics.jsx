import React, { useEffect, useState } from 'react'
import './topics.css'
import Topbar from '../../components/topbar/Topbar'
import Leftbar from '../../components/leftbar/Leftbar'
import Rightbar from '../../components/rightbar/Rightbar'
import axios from 'axios';
import Topic from '../../components/topic/Topic'
import CircularProgress from '@mui/material/CircularProgress';



export default function Topics({user}) {

  const [topics, setTopics] = useState([]);
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
  const getAllTopics = async () => {
    try {
        const res = await axios.get("/api/topics/all");
        setTopics(res.data)
      } catch (error) {
        console.log(error);
      }
    }
    getAllTopics();
  }, [user.user_id]);



const clickHandler = async () => {
  setIsFetching(!isFetching);
  try {

    await axios.post("/api/posts/create", {user_id:user.user_id});
    window.location.reload();
  } catch (error) {
    console.error(error);
  }
}

// useEffect(() => {
//   const makeFactPost = async () => {
//     makeFactPost();
//   }, [postObject]);



  return (
    <>
      <Topbar user={user}/>
      <div className="topics">
        <Leftbar user={user}/>
        <div className="topicsWrapper">
          <button onClick={clickHandler} className="addRemoveTopicButton" >
            {isFetching ? <CircularProgress color="success" size={'15px'}/> : "Generate a random fact"}
          </button>
          <hr/>
          {topics.map(topic=>(
              <Topic key={topic.topic_id} user={user} topic={topic}/>
            ))}
          
        </div>
        <Rightbar user={user}/>
      </div>
    </>
  )
}
