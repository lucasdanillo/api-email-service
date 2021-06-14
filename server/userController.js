const fs = require('fs');

let stringUsers = fs.readFileSync('./users.txt');
let users = JSON.parse(stringUsers);

const createOrLoginUser = (userName) => {
    return new Promise((resolve, reject) => {
        if (!userName) {
            reject({ status: 400, message: `You must provide a Username !` });
        }
        if (userName.indexOf(' ') >= 0) {
            reject({ status: 400, message: `Username must not have white spaces !` });
        }
        const user = users.find((emailUser) => emailUser === userName);
        if (user) {
            resolve(user);
        }
        else {
            users = [
                userName,
                ...users
            ];
            fs.writeFileSync('./users.txt', JSON.stringify(users));
            resolve(userName);
        }
    });
};

module.exports = {
    createOrLoginUser,
    findUserByName
};
