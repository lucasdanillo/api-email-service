const fs = require('fs');

let stringEmails = fs.readFileSync('./data.txt');
let emails = JSON.parse(stringEmails);

const findAll = () => {
    return new Promise((resolve, reject) => {
        resolve(emails);
    });
};

const findAllByTo = (to) => {
    return new Promise((resolve, reject) => {
        if (!to) {
            reject({ status: 400, message: `You must provide a Recipient !` });
        }
        const emailsTo = emails.filter((email) => email.to.toLocaleLowerCase() === to);
        if (emailsTo) {
            resolve(emailsTo);
        }
        else {
            reject({ status: 404, message: `E-mails to ${to} not found !` });
        }
    });
};

const createEmail = (email) => {
    return new Promise((resolve, reject) => {
        let stringUsers = fs.readFileSync('./users.txt');
        let users = JSON.parse(stringUsers);
        if (!email) {
            reject({ status: 400, message: `You must provide an email !` });
        }
        const user = users.find((username) => username === email.to);
        if (!user) {
            reject({ status: 404, message: `User ${email.to} not found !` });
        }
        const newEmail = {
            id: Date.now().toString(),
            ...email
        };
        emails = [
            newEmail,
            ...emails
        ];
        fs.writeFileSync('./data.txt', JSON.stringify(emails));
        resolve(newEmail);
    });
};

const deleteById = (id) => {
    return new Promise((resolve, reject) => {
        if (!id) {
            reject({ status: 400, message: `You must provide an email id !` });
        }
        const newEmails = emails.filter((email) => email.id !== id);
        emails = [
            ...newEmails
        ];
        fs.writeFileSync('./data.txt', JSON.stringify(emails));
        resolve({ id: id });
    });
};

const findById = (id) => {
    return new Promise((resolve, reject) => {
        if (!id) {
            reject({ status: 400, message: `You must provide an  id !` });
        }
        const email = emails.find((email) => email.id === id);
        if (email) {
            resolve(email);
        }
        else {
            reject({ status: 404, message: `Email not found !` });
        }
    });
};

const forwardEmail = (id, to) => {
    let stringUsers = fs.readFileSync('./users.txt');
    let users = JSON.parse(stringUsers);
    return new Promise((resolve, reject) => {
        if (!id) {
            reject({ status: 400, message: `You must provide an id !` });
        }
        if (!to) {
            reject({ status: 400, message: `You must provide a Recipient !` });
        }
        const user = users.find((username) => username === to);
        if (!user) {
            reject({ status: 404, message: `User ${to} not found !` });
        }
        const email = emails.find((email) => email.id === id);
        if (email) {
            const newEmail = {
                ...email,
                ...{ id: Date.now().toString(), from: email.to, to: to, subject: 'Fwd: ' + email.subject },

            };
            emails = [
                newEmail,
                ...emails
            ];
            fs.writeFileSync('./data.txt', JSON.stringify(emails));
            resolve(newEmail);
        }
        else {
            reject({ status: 404, message: `E-mails to ${to} not found !` });
        }
    });
};

const replyEmail = (id, body) => {
    return new Promise((resolve, reject) => {
        if (!id) {
            reject({ status: 400, message: `You must provide an email to reply !` });
        }
        if (!body) {
            reject({ status: 400, message: `You must provide a reply !` });
        }
        const email = emails.find((email) => email.id === id);
        if (email) {
            const newEmail = {
                id: Date.now().toString(), from: email.to, to: email.from, subject: 'Re: ' + email.subject, body: body

            };
            emails = [
                newEmail,
                ...emails
            ];
            fs.writeFileSync('./data.txt', JSON.stringify(emails));
            resolve(newEmail);
        }
        else {
            reject({ status: 404, message: `E-mails to ${to} not found !` });
        }
    });
};

module.exports = {
    findAll,
    findAllByTo,
    deleteById,
    createEmail,
    findById,
    forwardEmail,
    replyEmail
};
