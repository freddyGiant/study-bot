// joins a channel based on a string channel ID
module.exports.joinChannelID = (client, msg, channelID, doNotifyMember = false) =>
{
    let response = -1;

    const p = new Promise((resolve, reject) =>
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
            response = 'I can\'t access that channel! Either it is non-existent or in a different server.';
            resolve();
        }
        else 
        {
            // otherwise, attempt to join
            channel.join().then( 
                () => 
                {
                    console.log(`Connected to ${channel.name} with ID ${channelID}.`);
                    response = `Joined ${channel.name}!`;
                    resolve();
                },
                error => 
                {
                    console.log(`Failed to connect to ${channelID}: ${error}`);
                    if(error === 'Error [VOICE_JOIN_CHANNEL]: You do not have permission to join this voice channel.')
                        response = 'I can\'t join that channel. If this is unintended and you happen to be able, change my roles/perms to fix this';
                    resolve();
                });
        }  
    });

    p.finally(
        () => 
        {
            if(doNotifyMember && response !== -1)
                msg.channel.send(response);
            return p;
        });
};

module.exports.joinUser = (client, msg) => 
{
    return this.joinChannelID(client, msg,this.findUserChannelID(msg));
};

module.exports.findUserChannelID = (msg) => 
{
    const userID = msg.author.id;
    const voiceChannels = msg.channel.guild.channels.cache.filter((channel) => channel.type === 'voice');
    const channelIterator = voiceChannels.values();
    let thisChannel;
    let i = 0;
    while(i < voiceChannels.size)
    {
        thisChannel = channelIterator.next().value;

        if(thisChannel.members.has(userID))
            return thisChannel.id;

        i++;
    }
};