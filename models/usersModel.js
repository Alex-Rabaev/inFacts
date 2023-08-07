import { db } from "../config/db.js";

// REGISTER 
export const register = (username, email, firstname, lastname, hash) => {
    return db('users')
    .insert({username, email, firstname, lastname, password: hash}) // Pass an object
    .returning('user_id', 'username', 'email')
}

// LOGIN
export const login = (username_or_email) => {
    return db('users')
    .select('user_id', 'username', 'email', 'password')
    .where(function () {
      this.where('email', username_or_email).orWhere('username', username_or_email)
    })
}

export const updateLastLogin = (userId) => {
    return db('users')
    .where({user_id: userId})
    .update({last_login: new Date()});
}

// GET ALL USERS
export const getAllUsers = () => {
    return db('users')
    .select('user_id', 'username', 'email', 'firstname', 'lastname', 'description', 'country', 'city', 'followers', 'followings')
    .orderBy('user_id')
}

// FIND BY ID
export const getUserById = (userId) => {
    return db('users')
    .select('user_id', 'username', 'email', 'firstname', 'lastname', 'description', 'country', 'city', 'followers', 'followings')
    .where({user_id: userId})
}

// UPDATE USER BY ID
export const updateUserById = (userId, updatedData) => {
    return db('users')
    .where({user_id: userId})
    .update(updatedData);
}

// DELETE USER BY ID
export const deleteUserById = (userId) => {
    return db('users')
    .where({user_id: userId})
    .del();
}