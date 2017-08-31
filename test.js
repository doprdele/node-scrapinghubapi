const process = require('process');
const scrapingHubApi = require('./build/node-scrapinghubapi');

const scrapingHubProject = scrapingHubApi(process.env.SHUB_API_KEY, process.env.SHUB_PROJECT_ID);
scrapingHubProject.jobs.list(function printRunningJobs(error, data) {
    console.log(data);
}, { state: 'running' });
scrapingHubProject.periodicjobs.list(function printScheduleJobs(error, data) {
    console.log(data);
});