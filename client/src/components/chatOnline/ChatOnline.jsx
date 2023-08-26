import axios from "axios";
import { useEffect, useState } from "react";
import "./chatOnline.css";

export default function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const res = await axios.get("/api/users/followings/" + currentId);
        setFriends(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getFriends();
  }, [currentId]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers?.includes(f.user_id)));
  }, [friends, onlineUsers]);

  const handleClick = async (user) => {
    try {
      const res = await axios.get(
        `/api/conversations//find/${currentId}/${user.user_id}`
      );
      setCurrentChat(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chatOnline">
      {onlineFriends.map((onlUser) => (
        <div className="chatOnlineFriend" onClick={() => handleClick()}>
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src={onlUser?.profilepicture}
              alt=""
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{onlUser?.firstname && onlUser?.lastname ? `${onlUser?.firstname} ${onlUser?.lastname}` : onlUser?.username}</span>
        </div>
      ))}
    </div>
  );
}
