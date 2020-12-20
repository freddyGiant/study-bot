const fs = require('fs');
const Discord = require('discord.js');
const helpers = require('./helpers.js');

const client = new Discord.Client();
client.commands = new Discord.Collection(); // makes a discord.collection for all the command objs to be put into

const secret = require('./secret.json');
const prefix = ';';

// get test message with client.channels.cache.get('744430283482333315').messages.fetch('788965435496333342')

const main = () => 
{
    checkQuit();
    console.log(`Logging in with token ${secret}...\n`)
    client.login(secret)
    .then(n => 
    {
        console.log(`Logged in with token ${n}\n`);
        return new Promise(resolve => 
            // await client readying and log it.
            client.once('ready', () => 
            {
                console.log('Ready to go!');
                resolve();
            }));
    })
    .then(() => 
    {
        client.on('message', (msg) =>
        {
            if(msg.content.startsWith(prefix) && msg.content !== prefix && !msg.author.bot)
            {
                // split message into each argument
                const args = msg.content.substring(1).trim().split(/\s+/);
                const command = args.shift();
        
                // if we have that command, get it from the collection and run its execute() with args
                if(helpers.commands.has(command)) helpers.commands.get(command)(client, msg, args);
            }
        }); 
    })
    .catch(e => console.log(e));
};

// checks to see if the user entered 'q'. if so, end the process.
const checkQuit = () => 
{ 
    process.stdin.once('data', (n) => 
    { 
        if(n.toString().trim() === 'q') 
        {
            console.log("uiting...\n");
            helpers.disconnectAll(client).then(() => process.exit(0));
        }
        else checkQuit(); 
    }); 
};

main();