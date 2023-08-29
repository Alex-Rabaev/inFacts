import React, { useEffect, useState } from 'react';
import "./post.css";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios'
import { format } from 'timeago.js';
import {Link} from 'react-router-dom'
import FactCheckIcon from '@mui/icons-material/FactCheck';
import CommentBankIcon from '@mui/icons-material/CommentBank';

export default function Post({post, user_id, currentUser_id}) {
  
  const [like, setLike] = useState(post.likes.length)
  const [isLiked, setIsLiked] = useState(false)
  // console.log(currentUser_id);
  const [user, setUser] = useState({})
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser_id));
  }, [currentUser_id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`${BASE_URL}/api/users?user_id=${post.user_id}`);
      setUser(res.data[0]);
    }
    fetchUser();
  }, [BASE_URL, post.user_id])

  const likeHandler = async () =>{
    try {
      axios.put(`${BASE_URL}/api/posts/like/${post.post_id}`, {user_id: user_id})
    } catch (error) {
      console.log(error);
    }
    setLike(isLiked ? like-1: like+1)
    setIsLiked(!isLiked)
  }
  return (
    <div className='post'>
        <div className="postWrappr">
            <div className="postTop">
                <div className="postTopLeft">
                  {/* <Link to={`profile/${user.username}`}> didn't worked correctly for some reason */}
                    <Link to={`http://localhost:3000/profile/${user.username}`}>
                    <img src={user.profilepicture} alt="" className="postProfileImg" />
                    </Link>
                    <span className="postUsername">
                        {user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.username}
                    </span>
                    <span className="postDate">{format(post.created_at)}</span>
                </div>
                <div className="postTopRight">
                    <MoreVertIcon />
                </div>
            </div>
            <div className="postCenter">
                <span className="postText">{post?.description}</span>
                <img src={post.topic_img ? post.topic_img : post.img_location} alt="" className="postImg" />
            </div>
            
            <div className="proofLinksContainer">
              {post.isfact ? (<div>
                                <div className="iconContainer">
                                  <FactCheckIcon className='postTypeIcon'/>
                                  <span className="postTypeText">Fact</span>
                                </div>
                                <br />
                                {
                                    (post.prooflinks && post.prooflinks.length) ? 
                                    post.prooflinks.map((link, index) => (
                                      <div key={index}>
                                          <a href={link} className="proofLink" target="_blank" rel="noopener noreferrer">
                                              {"Proof link " + (index + 1)}
                                          </a>
                                      </div>
                                    )) : 
                                    "This fact doesn't have proof links"
                                }
                              </div>):
                              <div className="iconContainer">
                                <CommentBankIcon className='postTypeIcon'/>
                                <span className="postTypeText">Post</span>
                              </div>
            }
            </div>
            <div className="postBottom">
                <div className="postBottomLeft">
                  {isLiked ? (<FavoriteIcon className='likeIcon' alt="" onClick={likeHandler}/>) : 
                            (<FavoriteBorderIcon className='likeIcon' alt="" onClick={likeHandler}/>)}
                  <span className="postLikeCounter">{like} people like it</span>
                  <BookmarkAddIcon htmlColor='blue' className='addIcon'/>
                  <span className="postAddText">Add</span>
                </div>
                <div className="postBottomRight">
                    <span className="postCommentText">{post.comment} comments</span>
                </div>
            </div>
        </div>
    </div>
  )
}
