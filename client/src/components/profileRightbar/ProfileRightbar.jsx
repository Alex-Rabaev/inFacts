import { useEffect, useState } from 'react';
import './profileRightbar.css'
import axios from 'axios';
import { Link } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

export default function ProfileRightbar(props) {
  const [friends, setFriends] = useState([]);
  const currentUser = props.user;
  const [followed, setFollowed] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  
  // checking profile page owner
  const visitedUser = props.visitedUser ? props.visitedUser : currentUser;
  const checkProfileOwner = currentUser.user_id === visitedUser.user_id;
  
  // chosing user for showing info
  const user = checkProfileOwner ? currentUser : visitedUser;
  
  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendsList = await axios.get(`${BASE_URL}/api/users/follows/${user.user_id}`);
        setFriends(friendsList.data)
      } catch (error) {
        console.log(error);
      }
    }
    getFriends();
  }, [user.user_id]);

  
  useEffect(() => {
      if (!checkProfileOwner) {
          const isFollowedCheck = currentUser.followers.includes(user.user_id);
          if (isFollowedCheck !== followed) {
              setFollowed(isFollowedCheck);
          }
      }
  }, [currentUser, user.user_id]);
  const followHandler = async () => {
    try {
      if (followed) {
        await axios.put(`${BASE_URL}/api/users/${currentUser.user_id}/unfollow`, {user_id: user.user_id});
      } else {
        await axios.put(`${BASE_URL}/api/users/${currentUser.user_id}/follow`, {user_id: user.user_id});
      }
      setFollowed(!followed)
    } catch (error) {
      
    }
  }

  return (
    <>
      <div className="rightbar">
        {!checkProfileOwner && (
          <button className="rightbarFollowButton" onClick={followHandler}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <PersonRemoveIcon/> : <PersonAddIcon/>}
          </button>
        )}
        <div className="rightbarWrapper">
          <h4 className='profileRightbarTitle'>User information</h4>
          <div className="profileRightbarInfo">
            <div className="profileRightbarInfoItem">
              <span className="profileRightbarInfoKey">Country:</span>
              <span className="profileRightbarInfoValue">{user.country ? user.country : "-"}</span>
            </div>
            <div className="profileRightbarInfoItem">
              <span className="profileRightbarInfoKey">City:</span>
              <span className="profileRightbarInfoValue">{user.city ? user.city : "-"}</span>
            </div>
            <div className="profileRightbarInfoItem">
              <span className="profileRightbarInfoKey">Gender:</span>
              <span className="profileRightbarInfoValue">{user.gender ? user.gender : "-"}</span>
            </div>
          </div>
          <h4 className='profileRightbarTitle'>User friends</h4>
          <div className="profileRightbarFriends">
            {friends.map((friend) => (
              <Link className='linkItem' key={friend.user_id} to={`/profile/${friend.username}`} style={{textDecoration: "none"}}>
                <div className="profileRightbarFriend">
                  <img 
                    src={friend.profilepicture} 
                    alt="" 
                    className="profileRightbarFriendImg" 
                    />
                  <span className="profileRightbarFriendName">{friend.firstname && friend.lastname ? `${friend.firstname} ${friend.lastname}` : friend.username}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
