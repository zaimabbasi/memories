const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validateUsername = (username) => {
    return /^[a-z0-9_.]+$/.test(username);
};

export { validateEmail, validateUsername };
