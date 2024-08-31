import ArticleModel from "../models/Article";
import Article from "../models/Article";

export const create = async (req: Request, res: Response) => {
    try {
        const doc = new ArticleModel({
           title: req.body.title,
           text: req.body.text,
           author: req.userId
        });
        const article = await doc.save();
        res.json({
            ...article,
            success: true
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false
        })
    }
}

export const getMine = async (req: Request, res: Response) => {
    try {
        const user_id = req.userId;
        const posts = await ArticleModel.find({ author: user_id }).select("-author");
        res.json({
            posts: posts,
            success: true
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false
        })
    }
}

export const getAll = async (req: Request, res: Response) => {
    try {
        const posts = await ArticleModel.find().populate('author', '-passwordHash').exec();
        res.json({
            posts: posts,
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
        const postId = req.params.id;
        const post = await ArticleModel.findById(postId).populate('author', '-passwordHash').exec();
        res.json({
            post: post,
            success: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
        })
    }
}

export const deleteOne = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const postId = req.params.id;
        await ArticleModel.deleteOne({ author: userId, _id: postId });
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
        })
    }
}

export const updateOne = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const postId = req.params.id;
        console.log(req.body);
        await ArticleModel.updateOne({ author: userId, _id: postId }, req.body.post);
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
        })
    }
}