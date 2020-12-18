module.exports = 
{
    name: 'join',
    description: 'Shoves John Madden into your voice channel.',
    executeCommand: (client, msg, args) => join(client, msg, args)
};

const join = (client, msg, args) => 
{
    if(args.length > 0)
        joinChannelID(client, msg, args[0]);
    else
        joinUser(client, msg);
};

// joins a channel based on a string channel ID
const joinChannelID = (client, msg, channelID, doNotifyMember = true) =>
{
    let response = -1;

    const p = new Promise(resolve =>
    {
        const channel = client.channels.cache.get(channelID);

        console.log(`Attempting to join channel with ID ${channelID}...`);

        const currentConnections = client.voice.connections;
        // if we're already in the channel
        if(currentConnections.size > 0 && channelID === currentConnections.values().next().value.channel.id)
        {
            console.log('StudyBot was already in the channel. Aborting channel connection.');
            response = `I'm already in ${channel.name}!`;
            resolve();
        }
        // if the channel doesn't exist
        else if(!channel || channel.guild.id !== msg.guild.id) 
        {
            console.log(`Channel ${channelID} is either in a different guild or does not exist.`);
            response = 'That channel is either non-existent or in a different server.';
            resolve();
        }
        else 
        {
            // otherwise, attempt to join
            channel.join().then(() => 
            {
                console.log(`Connected to ${channel.name} with ID ${channelID}.`);
                response = `Joined ${channel.name}!`;
                resolve();
            },
            error => 
            {
                console.log(`Failed to connect to ${channelID}: ${error}`);
                resolve();
            });
        }  
    });

    p.finally(() => 
    {
        if(doNotifyMember && response !== -1)
            msg.channel.send(response);
    });
    
    return p;
};
module.exports.joinChannelID = joinChannelID;

const joinUser = (client, msg) => 
{
    return joinChannelID(client, msg, findUserChannelID(msg));
};
module.exports.joinUser = joinUser;

const joinChannel = (client, channel) =>
{
    return this.joinChannelID(client, channel.id);
};
module.exports.joinChannel = joinChannel;

const findUserChannelID = (msg) => 
{
    const userID = msg.author.id;
    const voiceChannels = msg.channel.guild.channels.cache.filter((channel) => channel.type === 'voice');
    const channelIterator = voiceChannels.values();
    let thisChannel;
    for(let i = 0; i < voiceChannels.size; i++)
    {
        thisChannel = channelIterator.next().value;

        if(thisChannel.members.has(userID))
            return thisChannel.id;
    }
};
module.exports.findUserChannelID = findUserChannelID;