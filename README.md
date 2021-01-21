# study-bot
a bot for my got d*mn discord server. that is all.
### *todo:*
- [ ] commandSkip
- [ ] speakall mode
- [ ] disconnect timeout
- [ ] *heroku integration?*
- [ ] *implement commandHelp?*
- [x] expect two hotfixes. no more because by that time i will have moved on to another project.
- [x] implement ~~dectalk man~~john madden
- [ ]~~names if kyle lets me~~
- [x] study for finals

#### version 1.0.1 ~
the bot does dectalk now. i suppose it's actually been a good few versions before this but this is a stable build with a hotfix. commandjoin, commanddisconnect, and commandsay all function as well as the class sayqueue. the current file separation protocol is 
- shove the stuff that makes the bot itself work in index.js
- everything else goes in helpers  

as of right now helpers.js is only 321 lines long and with the help of vscode's table of contents it hasn't been horrific to navigate, however if at some point that is no longer the case i plan to create separate modules for join related, disconnect related, speech related, etc into separate folders. those specifics will be worked out later but the plan is to keep the helpers module and require in other modules as a single combined exports object, and to probably keep the good ol' commandMap is helpers as well. (maybe also sayqueue, or that might get its own file.) i'm pretty happy with where the bot is at right now. i didnt see much demand for a help command and theres only one command people actually use. in my eyes, this project is more or less completed. thanks for reading, i think i'm done here.

#### version negative 15 *(before i made the dang repo)* ~  
i tried implimenting a weather command and then realized that the FEDERAL WEATHER API SUCKS IT'S TERRIBLE. ok im deleting that.
