import React from 'react'
import Topbar from '../../components/topbar/Topbar'
import Leftbar from '../../components/leftbar/Leftbar'
import Feed from '../../components/feed/Feed'
import Rightbar from '../../components/rightbar/Rightbar'
import "./home.css"

export default function Home(props) {
  // console.log(props);
  const userData = props.user;
  // console.log(userData);
  // console.log(userData.username);

  return (
    <>
      <Topbar user={userData}/>
      <div className="homeContainer">
        <Leftbar user={userData}/>
        <Feed user={userData}/>
        <Rightbar user={userData}/>
      </div>
    </>
  )
}
