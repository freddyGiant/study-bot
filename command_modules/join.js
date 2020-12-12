const join = (client, msg, args) => {
    if(args.length > 0)
        joinChannelID(client, args[0]).then(s => console.log(s), console.log);
    else
        joinUser(client, msg).then(s => console.log(s), s => console.log(s));
};

// joins a channel based on a string channel ID
const joinChannelID = (client, channelID) => {
    return new Promise(resolve => {
        channel = client.channels.cache.get(channelID);

        const currentConnection = client.voice.connections.values().next().value;
        
        if(currentConnection !== undefined)
        {    console.log(currentConnection);
            if(channelID === currentConnection.toString())
                resolve(`I'm already in ${channel.name}!`);
        }
        
        // if the channel doesn't exist
        if(!channel) resolve(`${channelID} is not the ID of a channel that exists!`);
        else 
            // wait for authentication and resolve
            channel.join().then(connection => {
                connection.once('authenticated', () => resolve(`Successfully connected to ${channel.name}`));
            });
    });
};

const joinUser = (client, msg) => {
    return joinChannelID(client, findChannel(msg.author));
};

module.exports = {
    name: 'join',
    description: 'Shoves John Madden into your voice channel.',
    executeCommand(client, msg, args) { join(client, msg, args); },
    joinChannelID
};