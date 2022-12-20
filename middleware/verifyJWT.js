import jwt from "jsonwebtoken";

const verifyJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith("Bearer")) return res.sendStatus(401); // unauthorized

    const accessToken = authHeader.split(" ")[1];

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
        if (error) return res.sendStatus(403); //forbidden

        req.id = decoded.id;

        next();
    });
};

export default verifyJWT;
