const users = [];

function checkExistsUserAccount(req, res, next) {
    const { username } = req.headers;
    const user = users.find(user => user.username === username);

    if (!user) {
        return res.status(404).json({ error: 'User not exists' });
    }

    req.user = user;
    return next();
}

module.exports = {
    checkExistsUserAccount,
    users
};
