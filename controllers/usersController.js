import { 
    register, 
    login, 
    getAllUsers, 
    updateLastLogin, 
    getUserById, 
    getUserByUsername, 
    updateUserById, 
    deleteUserById,
    searchUsersByInput
 } from "../models/usersModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import cookieParser from "cookie-parser";


// get all users 
export const _getAllUsers = async (req, res) => {
    try {
        const rows = await getAllUsers();
        res.json(rows);
    } catch (err) {
        res.status(404).json({msg: "something went wrong"});
    }
}

// login
export const _login = async (req, res) => {
    try {
        const row = await login(req.body.username_or_email.toLowerCase());
        if (row.length === 0)
            return res.status(404).json({msg: "email or username not found"});

        const match = await bcrypt.compare(req.body.password + "", row[0].password);
        if (!match) return res.status(404).json({msg: "wrong password"});

        // successfull login
        const secret = process.env.ACCESS_TOKEN_SECRET;

        const userid = row[0].user_id;
        const username = row[0].username;
        const email = row[0].email;
        const firstname = row[0].firstname;
        const lastname = row[0].lastname;
        const accessToken = jwt.sign({userid, username, email, firstname, lastname}, secret, {expiresIn: "2 days"});

        await updateLastLogin(userid);

        res.cookie("token", accessToken, {
            httpOnly: true,
            maxAge: 48 * 60 * 60 * 1000
        })

        res.json({token: accessToken});
    } catch (error) {
        res.status(404).json({msg: "something went wrong", error});
    }
}

// register
export const _register = (req, res) => {
    const {username, email, firstname, lastname, password, gender} = req.body;

    const lower_email = email.toLowerCase();
    const lower_username = username.toLowerCase();

    const profilepicture = `https://robohash.org/${lower_username}/?set=set4`;
    const coverpicture = 'https://i.ibb.co/937FrCj/startingcoverpicture.png';
    

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password + "", salt);

    register(lower_username, lower_email, firstname, lastname, hash, gender, profilepicture, coverpicture)
    .then(row => {
        res.json(row)
    })
    .catch(err => {
        res.status(404).json({msg: "user allready exist!"})
    })
};

// logout
export const _logout = (req, res) => {
    // const accessToken = req.cookies.token;
    // if (!accessToken) return res.sendStatus(204);
    req.headers['x-access-token'] = null;
    res.clearCookie('token');
    return res.sendStatus(200);
}

// update user
export const _updateUserById = async (req, res) => {
    if (req.body.user_id === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password + "", salt);
            } catch (error) {
                console.log(error);
                return res.status(404).json({msg: "something went wrong"});
            }
        }
        try {
            const updatedUser = await updateUserById(req.params.id, req.body);
            res.status(200).json("Account has been updated")
        } catch (error) {
            return res.status(404).json({msg: "something went wrong"});
        }

    } else {
        return res.status(403).json({msg: "You can update only your account!"});
    }
}

// delete user
export const _deleteUserById = async (req, res) => {
    if (req.body.user_id === req.params.id || req.body.isAdmin) {
        try {
            await deleteUserById(req.body.user_id);
            res.status(200).json("Account has been deleted successfully");
        } catch (error) {
            return res.status(404).json({msg: "something went wrong"});
        }

    } else {
        return res.status(403).json({msg: "You can delete only your account!"});
    }
}

// get user by id or username
export const _getUserByIdOrUsername = async (req, res) => {
    const userId = req.query.user_id;
    const username = req.query.username;
    try {
        const user = userId ? await getUserById(userId) : await getUserByUsername(username);
        // console.log(user);
        if (!user.length) {
            return res.status(404).json({msg: "The user does not exist"});
        } else {
            return res.status(200).json(user);
        }
    } catch (error) {
        return res.status(404).json({msg: "something went wrong"});
    }
    
};

// Search users by input
export const _searchUsersByInput = async (req, res) => {
    const input = req.query.input;
    try {
        const searchResult = await searchUsersByInput(input)
        // console.log(searchResult);
        if (!searchResult.length) {
            return res.status(404).json("The user does not exist");
        } else {
            return res.status(200).json(searchResult);
        }
    } catch (error) {
        return res.status(404).json({msg: "something went wrong"});
    }
    
};

// get friends list
export const _getFriendsOfUser = async (req, res) =>{
    try {
        const _user = await getUserById(req.params.user_id);
        const user = _user[0];
        const friends = await Promise.all(
            user.followers.map(friendId => {
                return getUserById(friendId)
            })
        )
        let friendsList = [];
        friends.map(friend => {
            const {user_id, username, firstname, lastname, profilepicture} = friend[0];
            friendsList.push({user_id, username, firstname, lastname, profilepicture});
        });
        res.status(200).json(friendsList)
    } catch (error) {
        res.status(500).json(error)
    }
};

// get followings list
export const _getFollowingsOfUser = async (req, res) =>{
    try {
        const _user = await getUserById(req.params.user_id);
        const user = _user[0];
        const followings = await Promise.all(
            user.followings.map(followingId => {
                return getUserById(followingId)
            })
        )
        let followingsList = [];
        followings.map(following => {
            const {user_id, username, firstname, lastname, profilepicture} = following[0];
            followingsList.push({user_id, username, firstname, lastname, profilepicture});
        });
        res.status(200).json(followingsList)
    } catch (error) {
        res.status(500).json(error)
    }
};

// follow a user
export const _followUser = async (req, res) => {
    if (req.body.user_id !== req.params.id) {
        try {
            const _user = await getUserById(req.params.id);
            const _currentUser = await getUserById(req.body.user_id);

            const user = _user[0];
            const currentUser = _currentUser[0];

            if (!user.followers.includes(currentUser.user_id)) {
                const updatedFollowers = [...user.followers, currentUser.user_id];
                await updateUserById(req.params.id, {followers: updatedFollowers});
                const updatedFollowings = [...currentUser.followings, req.params.id];
                await updateUserById(req.body.user_id, {followings: updatedFollowings});
                res.status(200).json("User has been followed");
            } else {
                return res.status(403).json({msg: "You allready follow this user"});
            }
        } catch (error) {
            return res.status(404).json({msg: "something went wrong"});
        }
    } else {
        return res.status(403).json({msg: "You can't follow yourself"});
    }
}

// unfollow a user
export const _unfollowUser = async (req, res) => {
    if (req.body.user_id !== req.params.id) {
        try {
            const _user = await getUserById(req.params.id);
            const _currentUser = await getUserById(req.body.user_id);

            const user = _user[0];
            const currentUser = _currentUser[0];
            if (user.followers.includes(currentUser.user_id)) {
                const updatedFollowers = user.followers.filter(id => id !== currentUser.user_id);
                await updateUserById(req.params.id, {followers: updatedFollowers});
                const updatedFollowings = currentUser.followings.filter(id => id !== user.user_id);
                await updateUserById(req.body.user_id, {followings: updatedFollowings});
                res.status(200).json("User has been unfollowed");
            } else {
                return res.status(403).json({msg: "You don't follow this user"});
            }
        } catch (error) {
            return res.status(404).json({msg: "something went wrong"});
        }
    } else {
        return res.status(403).json({msg: "You can't unfollow yourself"});
    }
}