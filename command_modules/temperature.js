const http2 = require('http2');

const temperature = (args) =>
{
    const hostname = 'https://api.weather.gov:443';
    const headers = {
        'User-Agent': 'vincyfboling@gmail.com',
        'accept': 'application/geo+json',
        ':path': '/points/37.4419%2C122.143'
    };

    console.log('making request to api.weather.gov...');
    const session = http2.connect(hostname, () => 
    {
        const req = session.request(headers);

        req.on('response', (inHeaders, flags) =>
        {
            console.log(inHeaders);
        });

        req.setEncoding('utf8');
        let data = '';
        req.on('data', (chunk) => { data += chunk; });
        req.on('end', () => 
        {
            console.log(`\n${data}`);
            session.close();
        });
        req.end();
    });
};

temperature();

module.exports = {
    name: 'temperature',
    description: 'I will break into the weatherman\'s house and ask him what the temperature will be and then I will tell you what the temperature will be.',
    execute(args) { temperature(args); },
};