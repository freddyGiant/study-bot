const helpers = require('./../helpers.js');

const disconnect = (client, msg, args) => 
{
    console.log(msg.channel.guild.voiceConnection);
};

module.exports = 
{
    name: 'disconnect',
    description: 'Removes John Madden from existence.',
    executeCommand(client, msg, args) { disconnect(client, msg); },
};