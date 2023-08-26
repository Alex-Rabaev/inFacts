import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import './topic.css'
import axios from 'axios';

export default function Topic({topic, user}) {
  const [isAdded, setIisAdded] = useState(false)

  useEffect(() => {
    setIisAdded(topic.added_by_users_arr.includes(user.user_id));
  }, [user.user_id, topic.added_by_users_arr]);

  const addOrRemoveHandler = async () =>{
    if (isAdded) {      
      try {
        await axios.put(`http://localhost:3030/api/topics/remove/${topic.topic_id}`, {user_id: user.user_id})
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await axios.put(`http://localhost:3030/api/topics/add/${topic.topic_id}`, {user_id: user.user_id})
      } catch (error) {
        console.log(error);
      }
      
    }
    setIisAdded(!isAdded);
  }

  return (
    <div className='topicButtonDiv'>
    <button className="addRemoveTopicButton" onClick={addOrRemoveHandler}>
        {isAdded ? `${topic.topic_name} ` : `${topic.topic_name} `}
        {isAdded ? <RemoveIcon/> : <AddIcon/>}
    </button>
    <span className="topicDescription">{topic.description}</span>
    </div>
  )
}

// onClick={topicHandler}