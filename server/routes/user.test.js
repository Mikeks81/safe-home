// Import the dependencies for testing
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Users", () => {
  describe("GET /users", () => {
    // Test to get all Users record
    it("should get all Users record", (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
    // Test to get single user record
    it("should get a single user record", (done) => {
      const id = 1;
      chai.request(app)
        .get(`/users/${id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test to get single user record
    it("should not get a single user record", (done) => {
      const id = 5;
      chai.request(app)
        .get(`/users/${id}`)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});