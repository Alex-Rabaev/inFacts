import jwt, { decode } from 'jsonwebtoken';
import { login } from '../models/usersModel.js';
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (req, res, next) => {
    const accessToken = req.cookies.token || req.headers['x-access-token'];
    // const refreshToken = req.cookies.refreshToken

    // console.log('my token =>', accessToken);

    if (!accessToken) return res.status(401).json({msg: 'unauthorized'})

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({msg: "verify token failed"});

        const username_or_email = decoded.username || decoded.email;
        login(username_or_email)
        .then(row => {
            if(row.length > 0) return next();
            return res.status(401).json({msg: 'unauthorized'});
        })
        .catch ((err) => {
            return res.status(401).json({msg: 'unauthorized'});
        })
    });
};