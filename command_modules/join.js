const helpers = require('./../helpers.js');

const join = (client, msg, args) => 
{
    if(args.length > 0)
        helpers.joinChannelID(client, msg, args[0]);
    else
        helpers.joinUser(client, msg).then(r => helpers.joinResolve(msg, r), helpers.joinReject);
};

module.exports = 
{
    name: 'join',
    description: 'Shoves John Madden into your voice channel.',
    executeCommand(client, msg, args) { join(client, msg, args); },
};