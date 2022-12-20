import path from "path";

const fileExtLimiter = (allowedExtArray) => {
    return (req, res, next) => {
        const { files } = req;
        const fileExtensions = [];

        if (files) {
            Object.keys(files).forEach((key) => {
                fileExtensions.push(path.extname(files[key].name));
            });

            const allowed = fileExtensions.every((ext) => allowedExtArray.includes(ext.toLowerCase()));

            if (!allowed) {
                const message = `Image upload failed. Only ${allowedExtArray} are allowed`.replaceAll(",", ", ");

                return res.status(422).json({ message });
            }
        }

        next();
    };
};

export default fileExtLimiter;
