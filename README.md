NodeBot - a Node.js based IRC bot
=================================

> NodeBot is IRC bot written with Node.js it uses Node.js' `IRC`, `Request` and `jsdom` modules.

Project spawned from my and my college buddies need for bot to handle simple stuff
on our IRC channel.

---------------------------------

Version 1.1:

* Added title grabbing for Riemurasia
* Added few experimental functions.



Main functions as of version 1.0 are:

* Grabbing video titles from YouTube links and displaying them on the channel.

* Giving us a simple place to store homework answers, so people can easily check
the collective opinnion once it's formed, even if they can't get hold of anyone.

---------------------------------

Installation & configuration:

1. You need node.js (http://nodejs.org) for this, for node.js installation prefer
   to their own documentation.

2. JSDOM requires Python 2.7 (NOT 3.2), so you need to install it from http://www.python.org.   
 
3. Install IRC, Request and jsdom via npm:
	`npm install irc request url jsdom`
	
4. Copy `app.js` desired folder.

5. Configure bot's basic information
	* From `app.js` change server, channel and botsnick to what you want.
	* From `\node_modules\irc\lib\irc.js` you can change username, port and all the rest.

5. Start the program.
	`node app.js`

---------------------------------

Need to submit bugs? Feature requests? Just want to comment?
topi.tuulensuu@student.hamk.fi

You can also keep tabs on me through my website:
http://morphling.dotgeek.org/

Copyright (c) Topi Tuulensuu 2012

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.