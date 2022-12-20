const filePayloadExists = (req, res, next) => {
    if (!req.files) return res.status(400).json({ message: "File payload does not exist" });

    next();
};

export default filePayloadExists;
