// joins a channel based on a string channel ID
module.exports.joinChannelID = (client, msg, channelID, doNotify = true) =>
{
    let response = -1;

    const p = new Promise((resolve, reject) =>
    {
        channel = client.channels.cache.get(channelID);

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
                error => reject(`Failed to connect to ${channelID}: ${error}`));
        }  
    });

    p.finally(
        () => 
        {
            if(doNotify && response !== -1)
                msg.channel.send(response);
            return p;
        });
};

module.exports.joinUser = (client, msg) => {
    return joinChannelID(client, findChannel(msg.author));
};