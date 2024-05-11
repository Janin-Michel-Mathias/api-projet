import { NextFunction, Response, Request } from "express";
import jwt from 'jsonwebtoken';

export const authAdmin = (req: Request, res: Response, next: NextFunction) => {
    const privateKey = process.env.JWT_SECRET_ADMIN ?? 'secretadmin';

    const authHeader = req.headers['authorization'];
    if(req.headers['authId']) return res.status(401).json({ error: 'Unauthorized' });
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, privateKey, (err, id) => {
        console.log(privateKey);
        if (err) return res.status(403).json({ error: 'Access Forbidden' });
        (req as any).user = id;
        next();
    });
};