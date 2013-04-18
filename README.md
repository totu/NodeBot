NodeBot - a Node.js based IRC bot
=================================

> NodeBot is IRC bot written with Node.js it uses Node.js' `IRC`, `Request` and `jsdom` modules.

Project spawned from my and my college buddies need for bot to handle simple stuff
on our IRC channel.

---------------------------------


##Installation & configuration:

1. You need node.js (http://nodejs.org).  For node.js installation instructions prefer to their own documentation.

   
2. JSDOM requires Python 2.7 (NOT 3.2). So install Python (http://python.org).
 
 
3. Run npm install.
`npm install`

	
4. Configure bot's basic information:
	- From `app.js` change server, channel and bot's nick to what you want.
	- From `\node_modules\irc\lib\irc.js` you can change username, port and all the rest.
	- Add your operators names in `ops.bot` file (you need at least one name here to use `addop` command)

	
5. Start the program.
`node app.js`

---------------------------------
##Commands
Commands include, but may not be limited to:
Hello, search, wiki, calculate & mail
---------------------------------

##That other section...

Need to submit bugs? Feature requests? Just want to comment?
topi.tuulensuu@student.hamk.fi

You can also keep tabs on me through my website:
http://robots-and-dinosaurs.org/

Copyright (c) Topi Tuulensuu 2012

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.