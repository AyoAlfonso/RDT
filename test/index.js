const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const assert = chai.assert
const expect = chai.expect;
const should = chai.should();
const keys = require('../keys');
// const server = require('../server').server;
const appServer = require('../server').app;
const stopServer = require('../server').stop;
const WebSocketClient = require('websocket').client;

const client = new WebSocketClient();
const cache = require('memory-cache');
require('dotenv').config();

let httpServerAddr = {
    address: keys.config.HTTP_SERVER.Addr,
    port: keys.config.HTTP_SERVER.Port,
    socket: keys.config.HTTP_SERVER.socketPort
};

client.connect(`ws://${httpServerAddr.address}:${httpServerAddr.socket}/`, 'drone-protocol');

/*Testing
1. Test Cronjob function
    a. Test sendDroneData() for each drone data to send drone data objects
    b. Test sent connection data @ connection.sendUTF()
    c. Run Cronjob function droneCronJob()

2. Test Routes anonymous functions
    a. '/'
    b. 'admin/home'
    c. 'login'
    d. 'logout'

3. Test views
    a. (HOME) Functions | Recieving WebSocket func | generateTable | getDistanceFromLatLonInKm
    b. (HOME) data incoming
    c. (LOGIN) data
*/

function closeConnections(){
    stopServer()
}

describe('Initiating Socket Component...', () => {
        beforeEach((done) => {
            cache.put('test_data', true);
            let value = cache.del('test_data');
            value.should.be.eql(1);
            done(closeConnections());
        });

        client.on('connect', function (connection) {
            assert.equal(connection.connected, true);
        });
});

describe('Testing All express routes', () => {

    describe('/GET - Landing on the welcome page', () => {
        it('should respond with rendering data', function (done) {
            chai.request.agent(appServer)
              .get('/')
              .end(function (err, res) {
                res.should.have.status(200);
                assert.equal(res.header['content-type'], 'text/html; charset=utf-8');
                done(closeConnections());
              });
          });
    });


    describe('Requesting a protected admin route', () => {
        it('it should redirect (401) after checking for Authorization and also load the login page if there is no sessionID', (done) => {
            chai.request.agent(appServer)
                .get('/admin')
                .end((err, res) => {
                    expect(res.redirects).to.not.be.empty;
                    res.should.have.status(401);
                    done(closeConnections());
                });
        });
    });

    describe('Requesting the Admin Login route', () => {
        it('it should not login with an invalid password. And give a Unauthorized error (401)', (done) => {
            let data = {
                password: "WrongPassword",
            };

            chai.request.agent(appServer)
                .post('/admin/login')
                .send(data)
                .end((err, res) => {
                    res.should.have.status(401);
                });

                data = {
                    password: keys.config.ADMIN_PASS
                };
                chai.request.agent(appServer)
                    .post('/admin/login')
                    .send(data)
                    .end((err, res) => {
                        res.should.have.status(200);
                        done(closeConnections());
                    });
        });
    });

    describe('Logging out of the admin dashboard', () => {
        it('it should logout, redirect to login and give a 401 error (Unauthorized)', (done) => {
            chai.request.agent(appServer)
                .get('/admin/logout')
                .end((err, res) => {
                    expect(res.redirects).to.not.be.empty;
                    res.should.have.status(401);
                    done(closeConnections());
                });
        });
    });

    describe('Requesting landing page', () => {
        it('it should return Welcome message and a 200 status code', (done) => {
            chai.request(appServer)
                .get('/')
                .end((err, res) => {
                    assert.equal(res.header['content-type'], 'text/html; charset=utf-8');
                    res.should.have.status(200);
                    done(closeConnections());
                });
        });
    });


});
