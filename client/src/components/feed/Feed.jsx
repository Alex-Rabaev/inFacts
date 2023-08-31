import { useEffect, useState } from 'react'
import Post from '../post/Post'
import Share from '../share/Share'
import './feed.css'
import axios from 'axios';
// import axios from 'axios'

export default function Feed(props) {
  const [posts, setPosts] = useState([]);
  const currentUser = props.user;
  // console.log(props.visitedUser);
  
  // checking profile page owner
  const visitedUser = props.visitedUser ? props.visitedUser : currentUser;
  const checkProfileOwner = currentUser.user_id === visitedUser.user_id;
  // console.log(checkProfileOwner);
  
  // chosing user for showing info
  const user = checkProfileOwner ? currentUser : visitedUser;
  // console.log(user);
  const user_id = user.user_id;
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/posts/followers/${user_id}`)
        // const data = await res.json();
        if (res.status === 200) {
          setPosts(res.data);
          // setPosts(data.sort((p1, p2) => {
          //   return new Date(p2.created_at) - new Date(p1.created_at);
          // }));       
        } 
      } catch (error) {
        console.log(error);
      }
    }
    fetchPosts();
    // console.log(user_id);
  }, [user_id, BASE_URL])

  return (
    <div className='feed'>
        <div className="feedWrapper">
          {checkProfileOwner && <Share user={user}/>}
          {posts && posts.map(post=>(
              <Post key={post.post_id} post={post} user_id={user_id} currentUser_id = {currentUser.user_id}/>
          )
          )}
        </div>
    </div>
  )
}
