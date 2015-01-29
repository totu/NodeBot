irc = require 'irc'
sys = require 'util'
req = require 'request'
cheerio = require 'cheerio'
wolfclient = require 'node-wolfram'
wolfram = new wolfclient '39KJT4-G79L2V2RP5'
weather = require 'weather-js'

name = 'Kujis'
channel = '#kujalla'
websites = ['www.youtube.com', 'www.riemurasia.net', 'www.reddit.com', 'news.ycombinator.com']
cmd = null

Jeeves = new irc.Client 'irc.quakenet.org', name, {channels: [channel]}
console.log sys.format '%s connecting to %s...', name, channel

Jeeves.get = (str, msg) ->
  str = str.split ' '
  for s in str
    if msg.search(new RegExp('!'+s, 'i')) != -1
      cmd = '!'+s
      return true
  return false

Jeeves.talk = (str) ->
  Jeeves.say channel, irc.colors.wrap 'cyan', str

Jeeves.find = (pic) ->
  req {uri: 'http://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=' + pic.split(' ').join('+')}, (err, res, body) ->
    if !err
      obj = JSON.parse body
      Jeeves.talk obj.responseData.results[0].url if obj.responseData.results.length > 0

Jeeves.title_please = (vid) ->
  for site in websites
    if vid.search(new RegExp(site, 'i')) != -1
      v = sys.format 'http://%s', vid.substring(vid.search(new RegExp(site, 'i')))
      req {uri: v}, (err, res, body) ->
        if err
          Jeeves.talk 'You done goof\'d!'
        else
          $ = cheerio.load(body)
          console.log $('title').text()
          Jeeves.talk $('title').text()

Jeeves.calc = (query) ->
  wolfram.query query, (err, result) ->
    if(err)
      console.log err
    else
      for subpod in result.queryresult.pod[1].subpod
        for text in subpod.plaintext
          Jeeves.talk text

Jeeves.weather = (locale) ->
  weather.find {search: locale, degreeType: 'C'}, (err, result) ->
    if err
      console.log err
    else
      data = result[0]
      if data.current.feelslike
        Jeeves.talk "Weather at location " + data.location.name + ": " + data.current.temperature + "C (feels like " + data.current.feelslike + "C). Observed at " + data.current.observationtime + ". Forecast: " + data.forecast[1].day + " " + data.forecast[1].low + " - " + data.forecast[1].high + " " + data.forecast[1].skytextday
      else
        Jeeves.talk "Weather at location " + data.location.name + ": " + data.current.temperature + "C. Observed at " + data.current.observationtime + ". Forecast: " + data.forecast[1].day + " " + data.forecast[1].low + " - " + data.forecast[1].high + " " + data.forecast[1].skytextday

Jeeves.addListener 'message', (from, to, msg) ->
  Jeeves.talk sys.format 'Hello, %s, my good chum', from if Jeeves.get 'hi hello', msg
  Jeeves.find msg.replace cmd, '' if Jeeves.get 'search find etsi kuva picture pic image img', msg
  Jeeves.title_please msg
  Jeeves.calc msg.replace cmd, '' if Jeeves.get 'calc laske wolf wolfram', msg
  Jeeves.weather msg.replace cmd, '' if Jeeves.get 'sää weather', msg
