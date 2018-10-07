// function resize(array, i, j) {
//     var gen = array.reduce((a, b) => a.concat(b))[Symbol.iterator]();
    
//     return Array.from({ length: i }, _ => Array.from({ length: j }, _ => gen.next().value));
// }

// console.log(resize([[0, 1, 2, 3, 4, 5]], 2, 3));

const names = [
    'Rosie Richards',
    'Olivia Brady',
    'Charles Morrison'
]