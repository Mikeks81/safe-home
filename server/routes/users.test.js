import chai from 'chai'
import chaiHttp from 'chai-http'
import faker from 'faker'
import db from '../controllers/helpers/DatabaseHelper'
import app from '../index'
// Configure chai
chai.use(chaiHttp)
chai.should()

describe("Users", () => {
  describe("GET /users", () => {
    // Test to get all Users record
    it("should get all Users record", (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          done()
        })
    })
    // Test to get single user record
    it("should get a single user record", (done) => {
      const id = 1
      chai.request(app)
        .get(`/user/${id}`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          done()
        })
    })

    // Test to get single user record
    it("should not get a single user record", (done) => {
      const id = 'fakeid'
      chai.request(app)
        .get(`/user/${id}`)
        .end((err, res) => {
          res.should.have.status(400)
          done()
        })
    })

  })

  describe('PUT/PATCH /users/:user_id', () => {
    it('should not have status 404', () => {
      const id = 1
      chai.request(app)
        .put(`/user/${id}`)
        .end((err, res) => {
          res.should.not.have.status(404)
        })
    });
  })
  

  describe('POST /users', () => {
    // Test user creation
    it('should create a new db record', (done) => {
      chai.request(app)
        .post(`/users`)
        .send({
          'fname': faker.name.firstName(),
          'lname': faker.name.lastName(),
          'phone': faker.phone.phoneNumberFormat(),
          'email': faker.internet.email(),
          'password': faker.internet.password()
        })
        .end((err, res) => {
          res.should.have.status(201);
          done()
        })
    })
  })
  
  describe('DELETE /user/:user_id', () => {
    it('should delete a user record', async () => {
      const values = [
        faker.name.firstName(),
        faker.name.lastName(),
        faker.internet.email(),
        faker.internet.password(),
        faker.phone.phoneNumberFormat()
      ]
      const { rows } = await db.query(
        `INSERT INTO
          users(fname, lname, email, password, phone)
          VALUES($1, $2, $3, $4, $5)
          returning *`,
          values
      )

      const user = rows[0]
      try {
        const res = await chai
                    .request(app)
                    .delete(`/user/${user.id}`)
        res.should.have.status(204);
      } catch (err) {
        throw err
      }
    })
    
  })
})