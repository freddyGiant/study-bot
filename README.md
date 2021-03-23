# study-bot
Studybot can read out your discord messages in the voice channels of your choosing!
Speak in Discord voice channels without your voice or a mic, and keep the convo in sync without having to keep glancing at your voice-text channel.
No more semi-verbal awkwardness! (Also, it sounds funny *[and it can sing]*)

```
*commands:*

;join <?channel-id>
  connects to the voice channel of your choice or the one you are in if no parameters are given
  
;say <message>
  will say the message prepended with "[nickname of user] says:", or "[username of user] says:" if the 
  user is not using a nickname on that server in DECTalk's default voice. Phoneme mode is on.
 -a - studybot will not say the nickname or username of the message author
 ```

Studybot is a Node.js app. It interacts with discord through [Discord.js](https://discord.js.org/#/) and uses [DECTalk](https://en.wikipedia.org/wiki/DECtalk) for its voice synthesis.

### Dependencies
[Discord.js](https://discord.js.org/#/)
  for interfacing with Discord's bot API
[get-audio-duration](https://www.npmjs.com/package/get-audio-duration)
  for... getting audio duration (helps with queueing up each speech request)
DECTalk *(built-in installation)*
  say.exe (command line app as a subprocess) is used for the speech synthesis

### *Roadmap:*
- [ ] better emoji support
- [ ] spam prevention
- [ ] commandSkip
- [ ] speakall mode
- [ ] disconnect timeout
- [ ] *heroku integration?*
- [ ] *implement commandHelp?*
- [x] implement ~~dectalk man~~john madden
- [x] ~~study for finals~~ I made it through finals.

*current version*
#### Version 0.0.1 ~
The bot does dectalk now ::. I suppose it's actually been a good few versions before this but this is a stable build with a hotfix. commandjoin, 
commanddisconnect, and commandsay all function as well as the class sayqueue. The current file separation protocol is 
- shove the stuff that makes the bot itself work in index.js
- everything else goes in helpers  

notes: *As of right now helpers.js is only 321 lines long and, with the help of vscode's table of contents, it hasn't been horrific to navigate; however, 
if at some point that is no longer the case, i plan to create separate modules for join related, disconnect related, speech related, etc. into separate 
folders. Those specifics will be worked out later but the plan is to keep the helpers module and require in other modules as a single combined exports 
object, and to probably keep the good ol' commandMap is helpers as well. (maybe also sayqueue, or that might get its own file.) I'm pretty happy with 
where the bot is at right now. I didnt see much demand for a help command and theres only one command people actually use. In my eyes, this project is 
more or less completed. Thanks for reading, I think I'm done here for now.*

#### Version Negative 15 *(historical)* ~  
I tried implimenting a weather command and then realized that the FEDERAL WEATHER API SUCKS IT'S TERRIBLE.
