/* jshint -W083 */

const helpers = require('./../helpers.js');

const disconnect = (client, msg, doNotifyMember = false) => 
{
    let response = -1;
    const p = new Promise(resolve => 
        {
            const currentConnections = client.voice.connections;
            const connectionIterator = currentConnections.values();
            let foundConnectionInGuild = false;
            let i = 0;
            while(i < currentConnections.size && foundConnectionInGuild === false)
            {
                const thisConnection = connectionIterator.next().value;
                if(thisConnection.channel.guild.id === msg.channel.guild.id)
                {
                    thisConnection.disconnect();
                    thisConnection.once('disconnect', 
                        () =>
                        {
                            console.log(`Succesfully disconnected from channel ${thisConnection.channel.name}`);
                            response = `Disconnected from ${thisConnection.channel.name}`;
                            foundConnectionInGuild = true;
                            resolve();
                        });
                }
                i++;
            }
            if(!foundConnectionInGuild)
            {
                console.log(`Could not find voiceChannel in the connection within this guild (${msg.channel.guild.name})`);
                response = 'I\'m not connected to a voice channel! idiot';
                resolve();
            }
        });
    
    p.finally(
        () => 
        {
            if(doNotifyMember && response !== -1)
            {
                msg.channel.send(response);
            }
        });

    return p;
};

module.exports = 
{
    name: 'disconnect',
    description: 'Removes John Madden from existence.',
    executeCommand(client, msg, args) { disconnect(client, msg); },
};