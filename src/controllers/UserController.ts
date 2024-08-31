import {Request, Response} from "express";
import {validationResult} from "express-validator";
import UserModel from "../models/User";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import secretJWTCode from "../jwtCode";
import ArticleModel from "../models/Article";
import User from "../models/User";

export const register = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                ...errors.array()
            });
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: passwordHash,
        });

        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id
        }, secretJWTCode, {
            expiresIn: '30d',
        });

        const {hash, ...userData} = user._doc;

        res.json({
            ...userData,
            token,
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
        })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                success: false
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(404).json({
                success: false
            });
        }

        const token = jwt.sign({
            _id: user._id
        }, 'secret', {
            expiresIn: '30d',
        });

        const {hash, ...userData} = user._doc;

        res.json({
            ...userData,
            token,
            success: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false
        })
    }
}

export const getMe = async (req: Request, res: Response) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false
            });
        }
        return res.json({
            ...user._doc,
            success: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false
        })
    }
}

export const changeData = async (req: Request, res: Response) => {
    try {
        let updatedObj = req.body;
        if ("password" in updatedObj) {
            const password = updatedObj.password;
            delete updatedObj.password;
            const salt = await bcrypt.genSalt(10);
            updatedObj.passwordHash = await bcrypt.hash(password, salt);
        }
        const result = await UserModel.findByIdAndUpdate(
            { _id: req.userId },
            updatedObj
        );
        return res.json({
            success: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false
        })
    }
}

export const getAll = async (req: Request, res: Response) => {
    try {
        const users = await UserModel.find().select("-passwordHash");
        res.json({
            users: users,
            success: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
        })
    }
}

export const getOne = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const user = await UserModel.findById(userId).select("-passwordHash");
        res.json({
            user: user,
            success: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
        })
    }
}