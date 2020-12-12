/*jshint esversion: 6*/ 

const fs = require('fs');
const commdir = './command_modules';
const Discord = require('discord.js');

const client = new Discord.Client();
client.commands = new Discord.Collection(); // makes a discord.collection for all the command objs to be put into

const secret = require('./secret.json');
const prefix = 's!';


// checks to see if the user entered 'q'. if so, end the process.
const checkQuit = () => 
{ 
    process.stdin.once('data', (n) => 
    { 
        if(n.toString().trim() === 'q') 
        {
            console.log("uiting...\n");
            process.exit(0);
        }
        else checkQuit(); 
    }); 
};

// requires in all the cool stuff in the ./commands folder (WARNING: very cool)
const loadCommands = () => { return new Promise((resolve, reject) =>
    // gets list of filenames from ./commands
    fs.readdir(commdir, (err, files) => 
    {
        if(err !== null) reject(`There was a FileSystemError loading commands: ${err}`);

        // culls it down to js files, and iterates through them
        files.filter(file => file.endsWith('.js')).every(
            // requiring them in and then adding them to the Discord.collection.
        file => (command => client.commands.set(command.name, command))(require(`${commdir}/${file}`)));
        
        resolve(`Loaded commands:\n${files}\n`);
    })
);};

// handles the messages
const handleMessage = (msg) =>
{
    if(msg.content.startsWith(prefix) && msg.content !== prefix && !msg.author.bot)
    {
        // split message into each argument
        const args = msg.content.substring(2).trim().split(/\s+/);
        const command = args.shift();

        // if we have that command, get it from the collection and run its execute() with args
        if(client.commands.has(command)) client.commands.get(command).execute(args);
    }
};

const main = () => 
{
    checkQuit();
    console.log('Loading Commands...');
    console.log(`Logging in with token ${secret}...\n`);
    Promise.all( // awaits both loading the commands, and logging in and warming up thebot
    [ 
        loadCommands()
        .then(n => console.log(n)), 

        client.login(secret)
        .then(n => 
            {
                console.log(`Logged in with token ${n}\n`);
                return new Promise(resolve => 
                    client.once('ready', () => 
                {
                    console.log('Ready to go!');
                    resolve();
                }));
            })
    ])
    .then(() => 
    {
        client.on('message', handleMessage);
    })
    .catch(e => console.log(e));
};

main();