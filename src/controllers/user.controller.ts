import { Request, Response } from 'express';
import User from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signUp= async(req: Request, res: Response)=>{
    try {
        const {name, email, password}= req.body;

        if(!name || !email || !password){
            return res.status(400).json({message: 'All fields are required'});
        }

        const userExist= await User.findOne({email});
        if(userExist){
            return  res.status(409).json({message: 'User already exists.'});
        }

        const hashedPassword= await bcrypt.hash(password, 10);

        const newUser= new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({message: 'User sign up successfully', user:newUser});

    } catch (error) {
        return res.status(500).json({message: 'Internal server error'});
    }
};

export const login= async(req: Request, res: Response)=>{
    try {
        const {email, password}= req.body;

        if(!email || !password){
            return res.status(400).json({message: 'Email and Password are required'});
        }

        const userExist= await User.findOne({email});
        if(!userExist){
            return res.status(401).json({message: 'Invalid credentials'});
        }

        const isMatch= await bcrypt.compare(password, userExist.password);
        if(!isMatch){
            return res.status(401).json({message: 'Invalid credentials'});
        }

        const token= jwt.sign({id: userExist._id}, process.env.JWT_SECRET || 'jwt_secret', {expiresIn: '1h'});
        res.status(200).json({message: 'User login successfully', token});
        
    } catch (error) {
        return res.status(500).json({message: 'Internal server error'});
    }
};

export const getAllUsers= async(req: Request, res: Response)=>{
    try {
        const users= await User.find().select('-password');

        if(users.length == 0){
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json({message: 'User fetched successfully', users:users});
        
    } catch (error) {
        return res.status(500).json({message: 'Internal server error'});
    }
};