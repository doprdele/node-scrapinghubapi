var assert = require('assert');
var sinon = require('sinon');
var proxyquire = require('proxyquire');

describe('ScrapingHubApi', function() {
    describe('global request object', function() {
        const shub = require('../index')('xyz', '123');
        it('should have user set', function() {
            assert.equal('xyz', shub._options.auth.user);
        });
        it('should have password set to an empty string', function() {
            assert.equal('', shub._options.auth.pass);
        });
        it('should have query string set to project name', function() {
            assert.equal('123', shub._options.qs.project);
        });
        it('should have json set to true', function() {
            assert.equal(true, shub._options.json);
        });
    });

    describe('_get', function() {
        const req = sinon.stub();
        const shub = proxyquire('../index', { 'request': req })('xyz', '123');
        it('should return error when request returns error', function() {
            req.withArgs(sinon.match.any, sinon.match.any).yields(
                new Error('An error from request'),
                null,
                null
            );

            shub._get('https://test.com', function(error, response, data) {
                assert.equal(null, response);
                assert.equal(null, data);
                assert(error instanceof Error);
            });
        });

        it('should return error when ScrapingHub JSON response includes an error', function() {
            req
                .withArgs(sinon.match.any, sinon.match.any)
                .yields(null, null, { 'status': 'error', 'message': 'error' });

            shub._get('https://test.com', function(error, response, data) {
                assert.equal(null, response);
                assert.equal(null, data);
                assert(error instanceof Error);
                assert.equal('error', error.message);
            });
        });

        it('should return error when ScrapingHub response != 200', function() {
            req
                .withArgs(sinon.match.any, sinon.match.any)
                .yields(null, { 'statusCode': 300 }, null);

            shub._get('https://test.com', function(error, response, data) {
                assert.equal(null, response);
                assert.equal(null, data);
                assert(error instanceof Error);
                assert.equal('GET https://test.com returned status code 300', error.message);
            });
        });

        it('should return data on success', function() {
            req
                .withArgs(sinon.match.any, sinon.match.any)
                .yields(null, { 'statusCode': 200 }, { 'status': 'successful', 'jobs': [] });

            shub._get('https://test.com', function(error, data) {
                assert.equal(null, error);
                assert.equal('successful', data.status);
            });
        });
    });
    describe('listJobs', function() {
        const req = sinon.stub();
        const shub = proxyquire('../index', { 'request': req })('xyz', '123');
        const s = sinon.spy(shub, '_get');

        it('should be called with the proper API URL', function() {
            req
                .withArgs(sinon.match.any, sinon.match.any)
                .yields(null, { 'statusCode': 200 }, { 'status': 'successful', 'jobs': [] });

            shub.jobs.list((e, d) => {
                assert(s.calledWith('https://app.scrapinghub.com/api/jobs/list.json', sinon.match.any, sinon.match.any));
            });
        });
    });
    describe('listPeriodicJobs', function() {
        const req = sinon.stub();
        const shub = proxyquire('../index', { 'request': req })('xyz', '123');
        const s = sinon.spy(shub, '_get');

        it('should be called with the proper API URL', function() {
            req
                .withArgs(sinon.match.any, sinon.match.any)
                .yields(null, { 'statusCode': 200 }, { 'status': 'successful', 'jobs': [] });

            shub.periodicjobs.list((e, d) => {
                assert(s.calledWith('https://app.scrapinghub.com/api/v2/projects/123/periodicjobs', sinon.match.any, sinon.match.any));
            });
        });
    });
});