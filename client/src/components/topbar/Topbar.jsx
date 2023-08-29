import './topbar.css'
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {Link, useNavigate} from 'react-router-dom'
import { useEffect, useState } from 'react';
import Follows from '../follows/Follows';


export default function Topbar(props) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate()
  const logoutHandler = async () => {
    localStorage.removeItem('token');
    navigate("/login")
    window.location.reload();
  }
  const profileHandler = async () => {
    navigate(`/profile/${username}`)
    window.location.reload();
  }
  const logoHandler = async () => {
    navigate("/")
    window.location.reload();
  }

  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchActive, setSearchActive] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      console.log(searchInput);
      if(searchInput.length===0){
        setSearchResults([]);
        return;
      }
      try {
        const res = await fetch(`${BASE_URL}/api/users/search?input=${encodeURIComponent(searchInput)}`);

        const searchData = await res.json();
        if (res.status === 200) {
          setSearchResults(searchData);
        } else {
          setSearchResults([]);
        }
        console.log(searchResults);
      } catch (error) {
        console.error('Error searching:', error);
      }
    }
    searchUsers();
  },[searchInput])
  // console.log(props);
  const userData = props.user;

  const username = userData.username ? userData.username : null;
  // console.log(username);
  return (
    <>
    <div className='topbarContainer'>
        <div className="topbarLeft">
          <span onClick={logoHandler} className="logo">inFacts</span>
        </div>
          
        <div className="topbarCenter">
          <div className="searchbar">
            <SearchIcon className='searchIcon'/>
            <input 
              onClick={() => setSearchActive(!searchActive)}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }} 
              placeholder='Search for friends or posts' 
              className="searchInput" />
          </div>
        </div>

        <div className="topbarRight">
          <div className="topbarLinks">
            <span onClick={profileHandler} className="topbarLink">Profile</span>
            <span onClick={logoutHandler} className="topbarLink">Logout</span>
          </div>
          <div className="topbarIcons">
            <div className="topbarIconItem">
              <PersonIcon />
              <span className="topbarIconBadge">1</span>
            </div>
            <div className="topbarIconItem">
              <ChatIcon />
              <span className="topbarIconBadge">2</span>
            </div>
            <div className="topbarIconItem">
              <NotificationsIcon />
              <span className="topbarIconBadge">3</span>
            </div>
          </div>
          <Link to={`/profile/${username}`} style={{textDecoration:'none'}}>
            <img src={userData.profilepicture} alt="" className="topbarProfileImage" />
          </Link>
        </div>
    </div>
    {searchActive && (
      <div className="searchResultContainer">
        {searchResults.length ? searchResults.map(user=>(
          <Follows key={user.user_id} user={user}/>
        )) : (<h4>The user does not exist</h4>)}
      </div>
      )}
    </>
  )
}
