NodeBot - a Node.js based IRC bot
=================================

> NodeBot is IRC bot written with Node.js it uses Node.js' `IRC`, `Request` and `jsdom` modules.

Project spawned from my and my college buddies need for bot to handle simple stuff
on our IRC channel.

---------------------------------

**Version 1.2:**

* Added quotes function [!quote, !quote(<number>)]
* Implimented WolframAlpha properly [!wolf, !math or !calc]
* Mode +o via PM [/msg NodeBot opme]



Version 1.1:

* Added title grabbing for Riemurasia
* Added few experimental functions.



Main functions as of version 1.0 are:

* Grabbing video titles from YouTube links and displaying them on the channel.

* Giving us a simple place to store homework answers, so people can easily check
the collective opinnion once it's formed, even if they can't get hold of anyone.

---------------------------------

##Installation & configuration:

1. You need node.js (http://nodejs.org).  For node.js installation instructions prefer to their own documentation.

   
2. JSDOM requires Python 2.7 (NOT 3.2). So install Python (http://python.org).
 
 
3. Run npm install.
`npm install`

	
5. Configure bot's basic information.
	* From `app.js` change server, channel and bot's nick to what you want.
	* From `\node_modules\irc\lib\irc.js` you can change username, port and all the rest.
	* Add your operators names in `ops.bot` file (you need at least one name here to use `addop` command)

	
5. Start the program.
`node app.js`

---------------------------------

##How to use commands? e.g. the RTFM section:

* `!help`, `!h` or `!?`
	* Shows all channel commands.
* `!hello`
	* Responds with "Hello, <sender>".
* `!save <message>`
	* Pushes message to save array.
* `!open`
	* Responds with content of save array.
* `!vastaukset`
	* Respods with vastaukset variable.
* `!vastaukset <message>`
	* Saves message to vastaukset variable.
* `!quote`
	* Responds with a random entry from quotes array.
* `!quote <message>`
	* Saves message to quotes array.
* `!quote(<number>)`
	* Reponds with a specific entry from quotes array.
* `!math <message>`, `!calc <message>` or `!wolf <message>`
	* Sends message to WolframAlpha API and responds with either *Result*, 
	*Decimal approximation* or *Exact result* entries.

	
**PM commands:**

* `opme`
	* If senders nickname is in `ops.bot` file, bot will grant the sender channel +o mode.

* `addop *name*`
	* If senders nickname is in `ops.bot` file, name will be added to `ops.bot` file.

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