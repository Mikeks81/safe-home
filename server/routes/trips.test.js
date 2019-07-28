// Import the dependencies for testing
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import db from '../controllers/helpers/DatabaseHelper'
// Configure chai
chai.use(chaiHttp);
chai.should();

const tripQuery = `SELECT (id) FROM users LIMIT 1;`
const tripsQuery = `SELECT (id) FROM trips WHERE user_id=$1;`

describe("Trips", () => {
  let userId  = null
  let tripId = null

  before(async () => {
    try {
      const { rows: usersRows } = await db.query(tripQuery)
      userId = usersRows[0].id
      const { rows: tripsRows } = await db.query(tripsQuery, [userId])
      tripId = tripsRows[0].id
    } catch (error) {
      console.log({ error })
      process.exit(1)
    }
  })

  describe("GET /trips", () => {
    // Test to get all Trips record
    it("should get all Trips records", (done) => {
      chai.request(app)
        .get(`/users/${userId}/trips`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
    // Test to get single trip record
    it("should get a single trip record", (done) => {
      chai.request(app)
        .get(`/users/${userId}/trips/${tripId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test to get single trip record
    it("should not get a single trips record", (done) => {
      const id = 'fakeid';
      chai.request(app)
        .get(`/users/${userId}/trips/${id}`)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    // Test trip creation
    it('should create a new db record', (done) => {
      chai.request(app)
        .post(`/users/${userId}/trips`)
        .send({
          'start': new Date() / 1000,
          'finish': null,
          'name': null
        })
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    }); 
  });
});