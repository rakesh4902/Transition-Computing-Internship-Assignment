// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const server = require('../index'); // Assuming your server file is named index.js
// const should = chai.should();

// chai.use(chaiHttp);

// describe('User Management API', () => {
//     // Test the POST /users route
//     describe('POST /users', () => {
//         it('it should create a new user', (done) => {
//             const newUser = {
//                 username: 'testuser',
//                 email: 'test@example.com',
//                 password: 'testpassword'
//             };
//             chai.request(server)
//                 .post('/users')
//                 .send(newUser)
//                 .end((err, res) => {
//                     res.should.have.status(201);
//                     res.body.should.be.a('object');
//                     res.body.should.have.property('username').eql('testuser');
//                     res.body.should.have.property('email').eql('test@example.com');
//                     done();
//                 });
//         });
//     });

    
// });
