import axios from 'axios';
import './rightbar.css'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Rightbar({user}) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [friends, setFriends] = useState([]);


  const getFriends = async (userId) => {
    if (!userId) return;
    
    const source = axios.CancelToken.source();

    try {
      const friendsList = await axios.get(`${BASE_URL}/api/users/follows/${userId}`, {
        cancelToken: source.token,
      });
      setFriends(friendsList.data);
      // console.log(friendsList.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Cancelled previous request");
      } else {
        console.log(error);
      }
    }

    return () => source.cancel();
  }

  useEffect(() => {
    getFriends(user?.user_id);

    return () => {
      // This will cancel the request if Rightbar is unmounted or if user changes before the request completes
      getFriends();
    }
  }, [user.user_id]);

  
  return (
    <>
      <div className="rightbar">
        <div className="rightbarWrapper">
          {/* <div className="birthdayContainer">
          <img className="birthdayImg" src="/images/gift.png" alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
          </span>
          </div> */}
          <img src="" alt="" className="rightbarAd" />
          <div className="rightbarTitle">Your friends</div>
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
