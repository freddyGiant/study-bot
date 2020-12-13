const stuff = require('./../useful-stuff.js');

const join = (client, msg, args) => 
{
    if(args.length > 0)
        stuff.joinChannelID(client, args[0]).then(r => stuff.joinResolve(msg, r), stuff.joinReject);
    else
        stuff.joinUser(client, msg).then(r => stuff.joinResolve(msg, r), stuff.joinReject);
};

module.exports = 
{
    name: 'join',
    description: 'Shoves John Madden into your voice channel.',
    executeCommand(client, msg, args) { join(client, msg, args); },
};