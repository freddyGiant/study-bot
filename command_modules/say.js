const say = (args) => {};

module.exports = {
    name: 'say',
    description: 'Talk with DecTalk! literally just type stuff lol',
    executeCommand(msg, args) { say(msg, args); }
};