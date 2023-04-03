// Description: This is a simple test to check if the server is up and running
// use `npx mocha health_check.js` to run the test

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

// const url = 'events-api.rke.acm.illinois.edu'
const url = 'http://localhost:8080';

/**
 * Test the health check endpoint
 * @param {string} url - The url of the server
 * Tests if the server is up and running
 * @returns {string} - Up.
 * @throws {Error} - If the server returns a status code 4XX-5XX (server is down)
 */
describe('Health Check', () => {
    it('should return Up', (done) => {
        chai.request(url)
        .get('/healthz')
        .end((err, res) => {
            chai.expect(res).to.have.status(200);
            chai.expect(res.text).to.equal('Up.');
            done();
        });
    });
});


