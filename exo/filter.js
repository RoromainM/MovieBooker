const users = [
    { firstname: 'John', lastname: 'Doe', age: 25 },
    { firstname: 'Ronald', lastname: 'McDonald', age: 24 },
    { firstname: 'Bruce', lastname: 'Wayne', age: 26 },
    { firstname: 'Julien', lastname: 'Lepers', age: 23 },
];

function filterArray(array, filter) {
    return array.filter(filter);
}

const filter = user => user.age > 24;
const filter2 = user => user.firstname.startsWith('J');

const filteredUsers = filterArray(users, filter);
const filteredUsers2 = filterArray(users, filter2);

console.log('Filtered Users:', filteredUsers);
console.log('Filtered Users 2:', filteredUsers2);