import React, { useEffect, useState } from 'react';
import "./profile.css";
import Topbar from '../../components/topbar/Topbar'
import Leftbar from '../../components/leftbar/Leftbar'
import Feed from '../../components/feed/Feed'
import ProfileRightbar from '../../components/profileRightbar/ProfileRightbar'
import { useParams } from 'react-router-dom';
import axios from 'axios';


export default function Profile({currentUser}) {

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const user = currentUser;
  const [visitedUser, setVisitedUser] = useState({});


  
  const username = useParams().username;
  
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/users?username=${username}`);
      setVisitedUser(res.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [username]);

  const checkProfileOwner = user.user_id === visitedUser.user_id;


  return (
    <>
      <Topbar user={user}/>
      <div className="profile">
        <Leftbar user={user} visitedUser={visitedUser}/>
        <div className="profileRight">
            <div className="profileRightTop">
                <div className="profileCover">
                    <img 
                      src={checkProfileOwner ? 
                        user.coverpicture :
                        visitedUser.coverpicture
                      } 
                      alt="" 
                      className="profileCoverImg" />
                    <img 
                      src={checkProfileOwner ? 
                        user.profilepicture :
                        visitedUser.profilepicture
                      } 
                      alt="" 
                      className="profileUserImg" />
                </div>
                <div className="profileInfo">
                    <h4 className='profileInfoName'>
                      {checkProfileOwner ? 
                       user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.username :
                       visitedUser.firstname && visitedUser.lastname ? `${visitedUser.firstname} ${visitedUser.lastname}` : visitedUser.username
                      }
                    </h4>
                    <p className='profileInfoDesc'>
                      {checkProfileOwner ?
                       user.description :
                       visitedUser.description}</p>
                </div>
            </div>
            <div className="profileRightBottom">
                <Feed user={user} visitedUser={visitedUser}/>
                <ProfileRightbar user={user} visitedUser={visitedUser}/>    
            </div>
        </div>
      </div>
    </>
  )
}
