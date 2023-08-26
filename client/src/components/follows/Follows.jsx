import React from 'react'
import './follows.css'
import { Link } from 'react-router-dom';

export default function Follows({user}) {

  return (
    <div>
      <Link className='linkItem' to={`http://localhost:3000/profile/${user.username}`} style={{textDecoration: "none"}}>
        <li key={user.user_id} className="leftbarFriend">
            <img src={user.profilepicture} alt="" className="leftbarFriendImg" />
            <span className="leftbarFriendName">{user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.username}</span>
        </li>
      </Link>
    </div>
  )
}
