// Import the dependencies for testing
import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker'
import app from '../index';
import db from '../controllers/helpers/DatabaseHelper'
// Configure chai
chai.use(chaiHttp);
chai.should();

const tripQuery = `SELECT (id) FROM users LIMIT 1;`
const contactsQuery = `SELECT (id) FROM contacts WHERE user_id=$1;`

describe("Contacts", () => {
  let userId = null
  let contactId = null

  before(async () => {
    try {
      const { rows: usersRows } = await db.query(tripQuery)
      userId = usersRows[0].id
      const { rows: contactsRows } = await db.query(contactsQuery, [userId])
      contactId = contactsRows[0].id
    } catch (error) {
      console.log({ error })
      process.exit(1)
    }
  })

  describe("GET /contacts", () => {
    // Test to get all Trips record
    it("should get all Trips records", (done) => {
      chai.request(app)
        .get(`/users/${userId}/contacts`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          done()
        })
    })
    // Test to get single contact record
    it("should get a single contact record", (done) => {
      chai.request(app)
        .get(`/users/${userId}/contacts/${contactId}`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          done()
        })
    })

    // Test to get single contact record
    it("should not get a single contacts record", (done) => {
      const id = 'fakeid'
      chai.request(app)
        .get(`/users/${userId}/contacts/${id}`)
        .end((err, res) => {
          res.should.have.status(400)
          done()
        })
    })

    // Test contact creation
    it('should create a new db record', (done) => {
      chai.request(app)
        .post(`/users/${userId}/contacts`)
        .send({
          'fname': faker.name.firstName(),
          'lname': faker.name.lastName(),
          'phone': faker.phone.phoneNumberFormat(),
          'email': faker.internet.email(),
          user_id: userId
        })
        .end((err, res) => {
          res.should.have.status(201);
          done()
        })
    })
  })
})