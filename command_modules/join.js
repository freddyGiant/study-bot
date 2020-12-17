const helpers = require('./../helpers.js');

const join = (client, msg, args) => 
{
    if(args.length > 0)
        helpers.joinChannelID(client, msg, args[0], true);
    else
        helpers.joinUser(client, msg);
};

module.exports = 
{
    name: 'join',
    description: 'Shoves John Madden into your voice channel.',
    executeCommand(client, msg, args) { join(client, msg, args); },
};