import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css";

export default function Conversation({ key, conversation, currentUser }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser.user_id);

    const getUser = async () => {
      try {
        const res = await axios("/api/users?user_id=" + friendId);
        setUser(res.data[0]);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  return (
    <div key={key} className="conversation">
      <img
        className="conversationImg"
        src={user?.profilepicture}
        alt=""
      />
      <span className="conversationName">{user?.firstname && user?.lastname ? `${user?.firstname} ${user?.lastname}` : user?.username}</span>
    </div>
  );
}
