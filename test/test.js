const {assert} = require('chai');
const supertest = require('supertest');

let url = "http://localhost:3000/";

const jwtAdmin = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiUmVpbGx5IiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNTc0OTc5NDI4fQ.77UknmxqXC6X0U-sNNHkTK4CiX6Df2jXCNCJ2OiBoJg";
const jwtNoAdmin = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiUmVpbGx5IiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU3NDk3NzI4MH0.egm5L7tdgB3BvphqPyFJryP8awOuGc5Mmk4W8iv-Pwk";

describe('Array', function() {
    describe('Basic API tests', function() {
      it('should fail when not logged in', function(done) {
        supertest(url)
        .get('')
        .expect(401)
        .expect(hasErrorCode("LoginFailure"))
        .end(done);
      });
      it('should fail when logged in without admin rights', function(done) {
        supertest(url)
        .get('')
        .set('Authorization', `Bearer ${jwtNoAdmin}`)
        .expect(401)
        .expect(hasErrorCode("NotAdmin"))
        .end(done);
      });
    });
  });

function hasErrorCode(errorCode) {
  return (res) => assert.equal(res.body.error.code, errorCode);
}