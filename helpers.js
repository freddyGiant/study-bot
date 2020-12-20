const commands = new Map();
commands.set('join', (client, msg, args) => this.commandJoin(client, msg, args));
commands.set('disconnect', (client, msg, args) => this.commandDisconnect(client, msg));
module.exports.commands = commands;

module.exports.commandJoin = (client, msg, args) => 
{
    if(args.length > 0)
        this.joinChannelID(client, msg, args[0]);
    else
        this.joinUser(client, msg);
};

module.exports.joinChannelID = (client, msg, channelID, doNotifyMember = true) =>
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

module.exports.joinUser = (client, msg) => 
{
    return this.joinChannelID(client, msg, this.findUserChannelID(msg));
};

module.exports.joinChannel = (client, channel) =>
{
    return this.joinChannelID(client, channel.id);
};

module.exports.findUserChannelID = (msg) => 
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

module.exports.commandDisconnect = (client, msg, doNotifyMember = true) => 
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
                foundConnectionInGuild = true;
                thisConnection.once('disconnect', () =>
                {
                    console.log(`Succesfully disconnected from channel ${thisConnection.channel.name}`);
                    response = `Disconnected from ${thisConnection.channel.name}.`;
                    resolve();
                });
                thisConnection.disconnect();
            }
            i++;
        }
        if(!foundConnectionInGuild)
        {
            console.log(`Could not find voiceConnection within this guild (${msg.channel.guild.name})`);
            response = 'I\'m not connected to a voice channel! idiot';
            resolve();
        }
    });
    
    p.finally(() => 
    {
        if(doNotifyMember && response !== -1)
        {
            msg.channel.send(response);
        }
    });

    return p;
};

module.exports.disconnectAll = (client) =>
{
    const currentConnections = client.voice.connections;
    const connectionIterator = currentConnections.values();
    const disconnectPromises = new Set();
    for(let i = 0; i < currentConnections.size; i++)
    {
        const thisConnection = connectionIterator.next().value;
        disconnectPromises.add(new Promise(
            resolve => thisConnection.once('disconnect', resolve)));
        thisConnection.disconnect();
    }
    return Promise.all(disconnectPromises);
};