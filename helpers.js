/* jshint -W083 */
const { exec } = require('child_process');
const fs = require('fs');
const { getAudioDurationInSeconds } = require('get-audio-duration');
const { promisify } = require('util');
const dectalkDir = './dectalk';
const dt_outDir = `${process.env.TMP}/dt_out`;

module.exports.getMSGArgs = (msg) => 
{
    const result = msg.content.trim().split(' ');
    result.shift();
    return result;
};

module.exports.getMSGContent = (msg) =>
{
    const args = this.getMSGArgs(msg);
    return args.filter(arg => !arg.startsWith('-')).join(' ');
};

module.exports.commandJoin = (msg) => 
{
    const args = this.getMSGArgs(msg);
    if(args.length > 0)
        this.joinChannelID(msg, args[0]);
    else
        this.joinUser(msg);
};

module.exports.commandDisconnect = (msg, doNotifyMember = true) =>
{
    let response = -1;
    const p = new Promise(resolve =>
    {
        const connection = this.findConnectionInGuild(msg.client, msg.channel.guild);
        if(connection)
        {
            const connectedChannel = connection.channel;
            // only disconnect if the message sender is actually in the channel
            if(!connectedChannel.members.has(msg.member.id))
            {
                console.log('Message author was not in the channel to disconnect from; aborting disconnect.');
                response = 'You must be in the channel you are trying to disconnect me from.';
                resolve();
            }
            else
            {
                connection.once('disconnect', () =>
                {
                    thisQueue = playQueueMap.get(msg.channel.guild.id);
                    if(thisQueue)
                        thisQueue.clearQueue();
                    console.log(`Succesfully disconnected from channel ${connection.channel.name}.`);
                    response = `Disconnected from ${connection.channel.name}.`;
                    resolve();
                });
                connection.disconnect();
            } 
        }
        else
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

playQueue = class 
{
    constructor(client, guild)
    {
        this.client = client;
        this.guild = guild;
        this.queue = [];
        this.isSpeaking = false;
    }

    push(soundDir)
    {
        getAudioDurationInSeconds(soundDir).then((sec) =>
        {
            this.queue.push({path: soundDir, duration: sec*1000});
            if(this.queue.length === 1)
                this.playNext();
        });

        // this.queue.push(soundDir);
        // if(this.queue.length === 1)
        //     this.playNext();
    }

    playNext()
    {
        const next = this.queue[0];
        const connection = module.exports.findConnectionInGuild(this.client, this.guild);
        if(connection)
        {
            console.log(`\nStarting to play a new sound... (dur: ${next.duration})`);
            connection.play(next.path);   
            setTimeout(() => 
            {
                console.log(`\nFinished playing sound. Shifting out of queue.`);
                this.queue.shift();
                if(this.queue.length >= 1)
                {
                    console.log(`Queue still has ${this.queue.length} sounds to play. Recursing.`);
                    this.playNext();
                }
            }, next.duration);
        }
        else this.clearQueue();
    }

    clearQueue()
    {
        this.queue = [];
    }
};
const playQueueMap = new Map();

module.exports.commandSay = (msg) =>
{
    const soundDir = `${dt_outDir}/${msg.id}.wav`;
    const speech = this.getCleanSpeech(msg);
    const guild = msg.channel.guild;
    const guildID = guild.id;

    // adds this server's queue to the global map if it doesn't exist
    if(!playQueueMap.has(guildID))
        playQueueMap.set(guildID, new playQueue(msg.client, guild));

    Promise.all([
        promisify(fs.access)(dt_outDir)
        .then(Promise.resolve.bind(Promise), (err) =>
        {
            // creates the dt_out directory if it doesn't already exist
            if(err)
            {
                if(err.code === 'ENOENT')
                {
                    console.log(`\nCreating Directory ${dt_outDir}`);
                    return fs.mkdir(dt_outDir, Promise.resolve);
                }
                return Promise.reject(err);
            }
            else return Promise.resolve();
        })
        .then(() => new Promise((resolve, reject) =>
        {
            // synthesizes the voice file
            console.log(`\nSynthesizing speech at ${soundDir}: "${speech}"`);
            exec(`cd ${dectalkDir} & say.exe -w ${soundDir} -p [:phoneme on] "${speech}"`, (err) =>
            {
                if(err)
                    reject(err);

                else
                {
                    console.log('Completed synthesis.');
                    resolve();
                }
            });
        })),

        this.joinUser(msg, {doNotifyMember: false, doReject: true})
    ])
    .then(() => 
    {
        console.log(`Pushing sound file to playQueue of guild ${guildID}`);
        playQueueMap.get(guildID).push(soundDir);
    })
    .catch((err) =>
    {
        console.log(err);
    });
};

module.exports.getCleanSpeech = (msg) =>
{
    const anon = this.getMSGArgs(msg).includes('-a');
    const author = `${msg.member.nickname ? msg.member.nickname : msg.author.name} said: `;
    const content = this.getMSGContent(msg).split('').filter(char => !char.match(/\n/)).join('');

    return `${anon ? '' : author}${content}`;
};

module.exports.joinChannelID = (msg, channelID, {doNotifyMember, doReject} = {doNotifyMember: true, doReject: false}) =>
{
    let response = -1;
    const p = new Promise((resolve, reject) =>
    {
        const client = msg.client;
        const channel = client.channels.cache.get(channelID);
        const currentConnection = this.findConnectionInGuild(client, msg.channel.guild);

        console.log(`\nAttempting to join channel with ID ${channelID}...`);

        // if we're already in the channel
        if(currentConnection && channelID === currentConnection.channel.id)
        {
            console.log('StudyBot was already in the channel. Aborting channel connection.');
            response = `I'm already in ${channel.name}!`;
            resolve(currentConnection);
        }
        // if the channel doesn't exist
        else if(!channel || channel.guild.id !== msg.guild.id) 
        {
            console.log(`Channel ${channelID} is either in a different guild or does not exist.`);
            response = 'That channel is either non-existent or in a different server.';
            (doReject ? reject : resolve)();
        }
        else 
        {
            // otherwise, attempt to join
            channel.join().then(connection => 
            {
                console.log(`Connected to ${channel.name} with ID ${channelID}.`);
                response = `Joined ${channel.name}!`;
                resolve(connection);
            },
            error => 
            {
                console.log(`Failed to connect to ${channelID}: ${error}`);
                (doReject ? reject : resolve)(error);
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

module.exports.joinUser = (msg, {doNotifyMember, doReject} = {doNotifyMember: true, doReject: false}) => 
{
    const userChannel = this.findUserChannel(msg);
    if(userChannel)
        return this.joinChannelID(msg, userChannel.id, {doNotifyMember: doNotifyMember, doReject: doReject});
    else
    {
        return (doReject ? Promise.reject.bind(Promise) : Promise.resolve.bind(Promise))(`User ${msg.author} is not in a voice channel in this guild (${msg.channel.guild}).`);
    }
};

module.exports.joinChannel = (channel) =>
{
    return this.joinChannelID(channel.id);
};

module.exports.findUserChannel = (msg) => 
{
    const userID = msg.author.id;
    const voiceChannels = msg.channel.guild.channels.cache.filter((channel) => channel.type === 'voice');
    const channelIterator = voiceChannels.values();
    let thisChannel;
    let found = false;
    let i = 0;
    while(i < voiceChannels.size && !found)
    {
        thisChannel = channelIterator.next().value;

        if(thisChannel.members.has(userID))
            found = true;

        i++;
    }
    return found ? thisChannel : found;
};

module.exports.findConnectionInGuild = (client, guild) =>
{
    const currentConnections = client.voice.connections;
    const connectionIterator = currentConnections.values();
    let thisConnection;
    let found = false;
    let i = 0;
    while(i < currentConnections.size && found === false)
    {
        thisConnection = connectionIterator.next().value;
        if(thisConnection.channel.guild.id === guild.id)
            found = true;
        i++;
    }
    return found ? thisConnection : found;
};

module.exports.disconnectAll = (client) =>
{
    const currentConnections = client.voice.connections;
    const connectionIterator = currentConnections.values();
    const disconnectPromises = new Set();
    for(let i = 0; i < currentConnections.size; i++)
    {
        const thisConnection = connectionIterator.next().value;
        disconnectPromises.add(new Promise(resolve => 
            thisConnection.once('disconnect', resolve)));
        thisConnection.disconnect();
    }
    return Promise.all(disconnectPromises);
};

const commands = new Map();
commands.set('join', this.commandJoin);
commands.set('disconnect', this.commandDisconnect);
commands.set('say', this.commandSay);
module.exports.commands = commands;