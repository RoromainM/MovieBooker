function auth(user) {
    const userString = JSON.stringify(user);
    const token = btoa(userString);
    return token;
}

function verifyToken(token) {
    const userString = atob(token);
    const user = JSON.parse(userString);
    return user;
}

const user = { username: 'testUser', password: 'testPass' };

const token = auth(user);
console.log('Generated Token:', token);

const decodedUser = verifyToken(token);
console.log('Decoded User:', decodedUser);