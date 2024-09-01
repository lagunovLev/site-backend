import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import {loginValidator, registerValidator, createArticleValidator} from './validation';
import checkAuthentication from "./checkAuth";
import * as UserController from "./controllers/UserController";
import * as ArticleController from "./controllers/ArticleController";
import cors from 'cors';
import {changeData} from "./controllers/UserController";


mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("DB ok"))
    .catch((err) => console.log("DB error", err));

const app: express.Application = express();
app.use(express.json());
app.use(cors());

app.post('/auth/login', loginValidator, UserController.login);
app.post("/auth/register", registerValidator, UserController.register);
app.get("/auth/me", checkAuthentication, UserController.getMe);
app.put("/auth/update", checkAuthentication, UserController.changeData);
app.get("/auth/posts", checkAuthentication, ArticleController.getMine);
app.delete("/auth/posts/:id", checkAuthentication, ArticleController.deleteOne);

app.post("/posts", checkAuthentication, createArticleValidator, ArticleController.create);
app.get("/posts", ArticleController.getAll);
app.get("/posts/:id", ArticleController.getOne);
app.put("/posts/:id", checkAuthentication, ArticleController.updateOne);

app.get("/users", UserController.getAll);
app.get("/users/:id", UserController.getOne);

app.listen(process.env.PORT || 5000, () => {
    console.log("Server ok");
});