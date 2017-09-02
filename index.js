/*jshint esversion: 6 */

function ScrapingHub(apiKey, projectName) {

    let defaultOptions = {
        auth: {
            user: apiKey,
            pass: '',
        },
        qs: {
            project: projectName,
        },
        json: true,
    };

    let request = require('request').defaults(defaultOptions);

    const baseUrl = 'https://app.scrapinghub.com/api';
    const listJobsUrl = `${baseUrl}/jobs/list.json`;
    const listPeriodicJobsUrl = `${baseUrl}/v2/projects/${projectName}/periodicjobs`;

    function _get(url, callback, attributes = {}) {
        let options = {
            url: url,
            qs: attributes
        };

        request(options, function listScheduleCallback(error, response, data) {
            if (error) {
                callback(error);
                return;
            }

            if (data.status == 'error') {
                callback(new Error(data.message));
                return;
            }

            if (response.statusCode < 200 || response.statusCode > 200) {
                callback(new Error(`GET ${options.url} returned status code ${response.statusCode}`));
                return;
            }

            callback(null, data);
        });
    }

    function listJobs(callback, attributes = {}) {
        return _get(listJobsUrl, callback, attributes);
    }

    function listPeriodicJobs(callback, attributes = {}) {
        return _get(listPeriodicJobsUrl, callback, attributes);
    }

    let api = {
        jobs: {
            list: listJobs,
        },
        periodicjobs: {
            list: listPeriodicJobs,
        }
    };

    /* test-code */
    api._get = _get;
    api._request = request;
    api._options = defaultOptions;
    /* end-test-code */


    return api;
}

module.exports = ScrapingHub;