import jwt from 'jsonwebtoken';
import secretJWTCode from "./jwtCode";

export default (req: Request, res: Response, next: Function) => {
  const token = (req.get("Authorization") || '');
  console.log(token);

  try {
      const decoded = jwt.verify(token, secretJWTCode);
      req.userId = decoded._id;
      next();
  } catch (err) {
      console.log(err);
      console.log(token);
    return res.status(403).json({
        success: false
    });
  }
};