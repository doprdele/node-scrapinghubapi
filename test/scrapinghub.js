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
});