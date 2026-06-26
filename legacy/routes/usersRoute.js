import express from 'express';
import { 
        _register, 
        _login, _logout, 
        _getAllUsers, 
        _getUserByIdOrUsername, 
        _updateUserById, 
        _deleteUserById, 
        _followUser,
        _unfollowUser,
        _getFriendsOfUser,
        _getFollowingsOfUser,
        _searchUsersByInput
    } from '../controllers/usersController.js';
import { verifyToken } from '../middleware/VerifyToken.js';

// import { logger } from '../server.js';

const users_router = express.Router();

// register user
users_router.post('/register', _register);
// login user
users_router.post('/login', _login);
// logout user
users_router.delete('/logout', _logout);

users_router.get('/verify', verifyToken, (req, res) => {
    res.sendStatus(200);
});
users_router.get("/all", _getAllUsers);

// update user
users_router.put("/update/:id", _updateUserById);

// delete user
users_router.delete("/delete/:id", _deleteUserById);

// get a user by id
users_router.get("/", _getUserByIdOrUsername);

// Search users by input
users_router.get("/search", _searchUsersByInput);

// get friends
users_router.get("/follows/:user_id", _getFriendsOfUser);

// get followings
users_router.get("/followings/:user_id", _getFollowingsOfUser);

// follow a user
users_router.put("/:id/follow", _followUser);

// unfollow a user

users_router.put("/:id/unfollow", _unfollowUser);

export default users_router;