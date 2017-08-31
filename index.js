function ScrapingHub(apiKey, projectName) {

    var request = require('request').defaults({
        auth: {
            user: apiKey,
            pass: '',
        },
        qs: {
            project: projectName,
        },
        json: true,
    });

    const baseUrl = 'https://app.scrapinghub.com/api';
    const listJobsUrl = `${baseUrl}/jobs/list.json`;
    const listScheduleUrl = `${baseUrl}/v2/projects/${projectName}/periodicjobs`;

    // Attributes can be any of the following
    // { 
    //   'job': JobId,
    //   'spider': SpiderName
    //   'state': ending || running || finished || deleted.
    //   'has_tag': Tag
    //   'lacks_tag': Tag  
    // }

    function _get(attributes = {}, url, callback) {
        let options = {
            url: url,
            qs: attributes
        };

        request(options, function listScheduleCallback(error, response, data) {
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
    };

    function listJobs(attributes = {}, callback) {
        return _get(attributes, listJobsUrl, callback);
    };

    function listSchedule(attributes, callback) {
        return _get(attributes, listScheduleUrl, callback);
    };

    let api = {
        jobs: {
            list: listJobs,
        },
        schedule: {
            list: listSchedule,
        }
    };

    /* test-code */
    api._get = _get;
    api._request = _request;
    /* end-test-code */

    return api;
};

module.exports = ScrapingHub;