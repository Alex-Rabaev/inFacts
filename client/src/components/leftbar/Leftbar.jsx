import React, { useEffect, useState } from 'react'
import "./leftbar.css"
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import CircularProgress from '@mui/material/CircularProgress';
import ChatIcon from '@mui/icons-material/Chat';
import PeopleIcon from '@mui/icons-material/People';
import HelpIcon from '@mui/icons-material/Help';
import Follows from '../follows/Follows';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';


export default function Leftbar({user}) {

  const navigate = useNavigate()
  const [friends, setFriends] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [isFetching, setIsFetching] = useState(false)
  const currentUserId = user?.user_id
  const BASE_URL = process.env.REACT_APP_BASE_URL;

const generateFactClickHandler = async () => {
  setIsFetching(!isFetching);
  try {
    await axios.post(`${BASE_URL}/api/facts/new_fact_post`, {user_id: user?.user_id});
    window.location.reload();
  } catch (error) {
    console.error(error);
  }
}

useEffect(() => { 
    const getAllFriends = async () => {
      if (!currentUserId) return;
      try {
        const friendsList = await axios.get(`${BASE_URL}/api/users/follows/${user?.user_id}`);
        const followingsList = await axios.get(`${BASE_URL}/api/users/followings/${user?.user_id}`);
        setFriends(friendsList.data)
        setFollowings(followingsList.data)
      } catch (error) {
        console.log(error);
      }
    }
    getAllFriends();
  }, [currentUserId]);

  const handleChat = async () => {
    navigate("/messenger");
  }
  const topicsClickHandler = async () => {
    navigate("/topics");
  }
  const FeedClickHandler = async () => {
    navigate("/");
  }
  
  return (
    <div className='leftbar'>
      <div className="leftbarWrapper">
        <ul className="leftbarList">
          <li className="leftbarListItem">
            <DynamicFeedIcon className='leftbarIcon'/>
            <span onClick={FeedClickHandler} className="leftbarListItemText">Feed</span>
          </li>
          <li className="leftbarListItem">
            <LocalLibraryIcon className='leftbarIcon'/>
            <span className="leftbarListItemText">My Library</span>
          </li>
          <li onClick={handleChat} className="leftbarListItem">
            <ChatIcon className='leftbarIcon'/>
            <span className="leftbarListItemText">Chat</span>
          </li>
          <li className="leftbarListItem">
            <PeopleIcon className='leftbarIcon'/>
            <span className="leftbarListItemText">Friends</span>
          </li>
          <li className="leftbarListItem">
            <BookmarksIcon className='leftbarIcon'/>
            <span onClick={topicsClickHandler} className="leftbarListItemText">Topics</span>
          </li>
          <li className="leftbarListItem">
            <HelpIcon className='leftbarIcon'/>
            <span className="leftbarListItemText">Help</span>
          </li>
        </ul>
        <button onClick={generateFactClickHandler} className="leftbarButton">
          {isFetching ? <CircularProgress color="success" size={'15px'}/> : "Generate a fact"}
        </button>
        <hr className="leftbarHr" />
        <div className="leftbarTitle">Your follows:</div>
        <ul className="leftbarFriendList">
            {friends.length ? friends.map(u=>(
              <Follows key={u.user_id} user={u}/>
            )) : (<li className="ifListEmptyMsg"> You don't follow anyone </li>)}
        </ul>
        <hr className="leftbarHr" />
        <div className="leftbarTitle">Who follows you:</div>
        <ul className="leftbarFriendList">
            {followings.length ? followings.map(u=>(
              <Follows key={u.user_id} user={u}/>
            )) : (<li className="ifListEmptyMsg"> No one follows you yet </li>)}
        </ul>
      </div>
    </div>
  )
}
