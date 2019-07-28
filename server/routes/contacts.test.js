// Import the dependencies for testing
import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker'
import app from '../index';
import db from '../controllers/helpers/DatabaseHelper'
// Configure chai
chai.use(chaiHttp);
chai.should();

const usersQuery = `SELECT (id) FROM users ORDER BY id ASC LIMIT 1;`
const contactsQuery = `SELECT (id) FROM contacts WHERE user_id=$1;`

describe("Contacts", () => {
  let userId = null
  let contactId = null

  before(async () => {
    try {
      const { rows: usersRows } = await db.query(usersQuery)
      userId = usersRows[0].id
      const { rows: contactRow } = await db.query(contactsQuery, [userId])
      contactId = contactRow[0].id
    } catch (error) {
      console.log({ error })
      process.exit(1)
    }
  })

  describe("GET /contacts", () => {
    // Test to get all Trips record
    it("should get all Trips records", (done) => {
      chai.request(app)
        .get(`/user/${userId}/contacts`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          done()
        })
    })
    // Test to get single contact record
    it("should get a single contact record", (done) => {
      chai.request(app)
        .get(`/user/${userId}/contact/${contactId}`)
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
        .get(`/user/${userId}/contact/${id}`)
        .end((err, res) => {
          res.should.have.status(400)
          done()
        })
    })
  })

  describe('PUT /user/:user_id/contact/:contact_id', () => {
    it('should not have status 404', () => {
      chai.request(app)
        .put(`/user/${userId}/contact/${contactId}`)
        .end((err, res) => {
          res.should.not.have.status(404)
        })
    })
  })
  

  describe('POST /user/:user_id/contacts', () => {
    // Test contact creation
    it('should create a new db record', (done) => {
      chai.request(app)
        .post(`/user/${userId}/contacts`)
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

  describe('DELETE /user/:user_id/contact/:contact_id', () => {
    it('should not have status 404', (done) => {
      chai.request(app)
        .delete(`/user/${userId}/contact/${contactId}`)
        .end((err, res) => {
          res.should.not.have.status(404)
          done()
        })
    });
  })
})