// joins a channel based on a string channel ID
module.exports.joinChannelID = (client, channelID) => 
{
    return new Promise((resolve, reject) => {
        channel = client.channels.cache.get(channelID);

        const currentConnections = client.voice.connections;

        // if we're already in the channel
        if(currentConnections.size > 0 && channelID === currentConnections.values().next().value.channel.id)
            resolve(`I'm already in ${channel.name}!`);
        // if the channel doesn't exist
        else if(!channel) 
            resolve(`${channelID} is not the ID of a channel that exists!`);
        else 
            // otherwise, attempt to join
            channel.join().then(
                resolve(`Successfully connected to ${channel.name}!`),
                error => reject(error));
    });
};

module.exports.joinChannelID = (client, channelID) =>
{
    channel = client.channels.cache.get(channelID);

    const currentConnections = client.voice.connections;

    // if we're already in the channel
    if(currentConnections.size > 0 && channelID === currentConnections.values().next().value.channel.id)
        resolve(`I'm already in ${channel.name}!`);
    // if the channel doesn't exist
    else if(!channel) 
        resolve(`${channelID} is not the ID of a channel that exists!`);
    else 
        // otherwise, attempt to join
        channel.join().then(
            resolve(`Successfully connected to ${channel.name}!`),
            error => reject(error));
}

module.exports.joinUser = (client, msg) => {
    return joinChannelID(client, findChannel(msg.author));
};

module.exports.joinPromiseHandler = (msg, prom) => {
    prom.then(
        r => {
            msg.channel.send(r);
            console.log(r);
        },
        r = console.log(r));
}
