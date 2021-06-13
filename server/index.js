const http = require('http');
const Email = require('./emailController');
const User = require('./userController');

function getPostData(req) {
    return new Promise((resolve, reject) => {
        try {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', () => {
                resolve(body);
            });
        } catch (error) {
            reject(error);
        }
    });
}

const server = http.createServer(async (request, response) => {
    if (request.url === '/api/emails' && request.method === 'GET') {
        try {
            const emails = await Email.findAll();
            response.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            response.end(JSON.stringify(emails));
        }
        catch (error) {
            response.writeHead(error.status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            response.end(JSON.stringify(error.message));
        }
    }
    else if (request.url.match(/\/api\/emails\/([a-z A-Z]+)/) && request.method === 'GET') {
        const to = request.url.split('/')[3];
        try {
            const emails = await Email.findAllByTo(to);
            response.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            response.end(JSON.stringify(emails));
        } catch (error) {
            response.writeHead(error.status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            response.end(JSON.stringify(error.message));
        }
    }
    else if (request.url === '/api/emails' && request.method === 'POST') {
        const email_data = await getPostData(request);
        const { from, to, subject, body } = JSON.parse(email_data);
        try {
            const newEmail = await Email.createEmail({ from, to, subject, body });
            response.writeHead(201, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            response.end(JSON.stringify(newEmail));

        }
        catch (error) {
            response.writeHead(error.status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            response.end(JSON.stringify(error.message));
        }
    }
    else if (request.url.match(/\/api\/emails\/([0-9]+)/) && request.method === 'DELETE') {
        const id = request.url.split('/')[3];
        try {
            await Email.deleteById(id);
            response.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            response.end(id);
        } catch (error) {
            response.writeHead(error.status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            response.end(JSON.stringify(error.message));
        }
    }
    else if (request.url.match(/\/api\/emails\/([0-9]+)/) && request.method === 'GET') {
        const id = request.url.split('/')[3];
        try {
            const email = await Email.findById(id);
            response.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            response.end(JSON.stringify(email));
        } catch (error) {
            response.writeHead(error.status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            response.end(JSON.stringify(error.message));
        }
    }
    else if (request.url === '/api/emails/fwd' && request.method === 'PUT') {
        const fwd_data = await getPostData(request);
        const { id, to } = JSON.parse(fwd_data);
        try {
            const fwdEmail = await Email.forwardEmail(id, to);
            response.writeHead(201, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            response.end(JSON.stringify(fwdEmail));
        }
        catch (error) {
            response.writeHead(error.status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            response.end(JSON.stringify(error.message));
        }
    }
    else if (request.url === '/api/emails/reply' && request.method === 'PUT') {
        const re_data = await getPostData(request);
        const { id, body } = JSON.parse(re_data);
        try {
            const reEmail = await Email.replyEmail(id, body);
            response.writeHead(201, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            response.end(JSON.stringify(reEmail));
        }
        catch (error) {
            response.writeHead(error.status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            response.end(JSON.stringify(error.message));
        }
    }
    else if (request.url.match(/\/api\/users\/([a-z A-Z]+)/) && request.method === 'GET') {
        const user = request.url.split('/')[3];
        try {
            const userName = await User.findUserByName(user);
            response.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            response.end(JSON.stringify(userName));
        } catch (error) {
            response.writeHead(error.status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            response.end(JSON.stringify(error.message));
        }
    }
    else if (request.url === '/api/users' && request.method === 'POST') {
        const userName = await getPostData(request);
        const { user } = JSON.parse(userName);
        try {
            const newUser = await User.createOrLoginUser(user);
            response.writeHead(201, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            response.end(JSON.stringify(newUser));
        }
        catch (error) {
            response.writeHead(error.status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            response.end(JSON.stringify(error.message));
        }
    }
    else if (request.method === 'OPTIONS') {
        response.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'PUT,DELETE' });
        response.end();
    }
    else {
        response.writeHead(error.status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        response.end(JSON.stringify(error.message));
    }
});

const PORT = 5000;

server.listen(PORT, () => console.log(`Server listening on port ${PORT}!!!`));