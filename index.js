/**
 * Expects data from Stackdriver notification, in order to create an incident in ServiceNow
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */

var https = require('https');

exports.createServiceNowIncident = function createServiceNowIncident(req, res) {

    // This is an error case, as "incident" is required.
    if (req.body.incident === undefined) {
        console.log(req.body);
        res.status(400).send('No incident defined!');
    } else {
        // Everything is okay.
        createIncident(req.body.incident);
        res.status(200).send('Success: ' + req.body.incident);
    }
};

/**
 * Calls servicenow
 * @param incident
 */
function createIncident(incident) {

    var username = 'admin';
    var passw = 'GMksrxk667xY';
    var host = 'dev12383.service-now.com';

    //var comment = 'Resource id = ' + incident.resource_id + ", url = " + incident.url;

    // Build the incident object
    var incident_data = {
        short_description: incident.summary,
        urgency: '2',
        impact: '2'
    };

    console.log("Summary = " + incident_data.short_description + ", urgency = " + incident_data.urgency,
        "impact = " + incident_data.impact);

    var post_data = JSON.stringify(incident_data);
    console.log("Post data = " + post_data);

    var options = {
        hostname: host,
        auth: username + ':' + passw,
        port: 443,
        path: '/api/now/table/incident',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(post_data),
            'Accept': 'application/json'
        }
    };

    var req = https.request(options, function (res) {
        console.log('response STATUS: ' + res.statusCode);
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('response BODY: ' + chunk);
        });
    });

    //post data
    req.write(post_data);
    req.end();
}