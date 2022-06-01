const http = require('http');
const app = require('./app.js');



app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on ${process.env.PORT || 3000}`);
});




// const server = http.createServer((req, res) => {
//     res.writeHead(200, {'content-type': 'text/plain'});
//     res.end('Hello, World !');
// });

// server.listen(3000, () => {
//     console.log('Server running on 3000');
// });



