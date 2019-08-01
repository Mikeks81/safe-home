// Import the dependencies for testing
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import db from '../helpers/DatabaseHelper'
// Configure chai
chai.use(chaiHttp);
chai.should();

const tripQuery = `SELECT (id) FROM trips ORDER BY id ASC LIMIT 1;`
const coordinatesQuery = `SELECT (id) FROM coordinates WHERE trip_id=$1;`

describe("Coordinates", () => {
  let tripId = null
  let coordinateId = null

  before(async () => {
    try {
      const { rows: tripsRow } = await db.query(tripQuery)
      tripId = tripsRow[0].id
      const { rows: coordinateRow } = await db.query(coordinatesQuery, [tripId])
      coordinateId = coordinateRow[0].id
    } catch (error) {
      console.log({ error })
      process.exit(1)
    }
  })

  describe("GET /trips", () => {
    // Test to get all Coordinates record
    it("should get all Coordinates records", (done) => {
      chai.request(app)
        .get(`/trip/${tripId}/coordinates`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
    // Test to get single Coordinate record
    it("should get a single Coordinate record", (done) => {
      chai.request(app)
        .get(`/trip/${tripId}/coordinate/${coordinateId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test to get single Coordinate record
    it("should not get a single Coordinate record", (done) => {
      const id = 'fakeid';
      chai.request(app)
        .get(`/trip/${tripId}/coordinate/${id}`)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  })
  describe('PUT: /trip/:trip_id/coordinate/:coordinate_id', () => {
    it('should not throw a 404', () => {
      const id = 1
      chai.request(app)
        .put(`/trip/${tripId}/coordinate/${coordinateId}`)
        .end((err, res) => {
          res.should.not.have.status(404)
        })
    });
  });
  describe('POST: /trip/:trip_id/coordinates', () => {

    // Test trip creation
    it('should create a new db record', (done) => {
      chai.request(app)
        .post(`/trip/${tripId}/coordinates`)
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