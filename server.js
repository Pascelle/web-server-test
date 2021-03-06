// if you want to serve up jut a static page, node and express are ideal because all you need is four lines of code (const express, var app, app get, and app listen)

//a templating engine lets you render html but in a dynamic way, where you can inject values inside of the template.  You can also create reusable markup for things like headers that are the same on a lot of pages.

//npm install --save, the --save adds module to package.json

//"views" is the default folder where express holds its files

//dynamic means passed in and not manually entered in the file

//handlebar helpers are a way to register functions to run to dynamically create output ex/the date

//SSH keys allow our computer to communicate with another server (our local machine and github, for example).  you check with command ls -al ~/.ssh in your root directory.  if there is no ssh key then use command ssh-keygen -t rsa -b 4096 -C '' to create one

//a script is a command (like node server.js, deploying the server file) that we run from the terminal

//In github, the origin is the default remote so no need to specify a remote unless you want to change that.  The origin remote points to the github repository. When you use heroku another remote is created for heroku.  When we deploy to the heroku git repository heroku sees that then takes the changes and deploys them to the web....when we run "heroku create" in bash it does all of that.  "git push heroku" "heroku open"

const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
	//this is an obj that stores all of our environment variables in key/value pairs
	//the heroku port env variable is not automatically set up so you need the or operator as a backup.  also allows app to run locally
var app = express();

hbs.registerPartials(__dirname + '/views/partials')
//this is letting handlebars know we want to include support for partials
app.set('view engine', 'hbs');
	//this programs express to work with the hbs module.  it sets in key/value pairs

//this logs the request to the server
app.use((req, res, next) => {
	var now = new Date().toString();
	var log = `${now}: ${req.method} ${req.url} `;

	console.log(log); 
	fs.appendFile('server.log', log + '\n', (err) => {
	//lets us do stuff with the file
	// \n is shorthand for next, it tells this piece of middleware to move on with the code so the other handlers can also fire.
		if(err) {
			console.log('Unable to append to server.log')
		}
	});
	next();
	//next param exists so you can tell express when the middleware fcn is done.  useful so you can have as much middleware as you want registered to a single express app.  so if we run some async code the middleware is not going to move on until next is called.  if your middleware doesnt call next your handlers for each request are never going to fire.
	//the req param is an object that contains all sorts of info from the requesting client.  can find a full list of things you have access to, go to api reference, on right hand side click request
	//sometimes you don't want to call next
});

/*/app.use((req, res, next) => {
	res.render('maintenance.hbs');
}); /*/

app.use(express.static(__dirname + '/public'));
	//this is how you call middleware
	//dirname is a var that stores the path to your project's directory

hbs.registerHelper('getCurrentYear', () => {
		return new Date().getFullYear()
});

hbs.registerHelper('screamIt', (text) => {
	return text.toUpperCase();
});


app.get('/', (req, res) => {

	//app.get lets us set up a handler for an http get request. it's called a route handler.  it sends stuff back like json data or an html page. you pass in a url and a fcn to run, tells express what to send back to the person who made the request
	//req stores info about a request coming in like the headers that were used, the body info, etc
	//res has a bunch of methods available so you can respond to the http request in whatever way you'd like (customize what data you send back, set http status codes, etc.)

	//render lets you render any of the templates you have set up with your current view engine
	//passing in data via res.render: specify a second argument, this takes an obj and on this obj you can specify whatever you'd like.  the purpose of this is to update the html dynamically

	res.render('home.hbs', {
		pageTitle: 'Home Page',
		welcomeMessage: 'Welcome to the page',
						//currentYear: new Date().getFullYear()
						//this is calling the getFullYear method on the Date object
						//corresponds to the actual year off of the date JS constructor
	});
		/*/res.send({
			name: 'Andy',
			likes: [
				'Moo',
				'Tyyh'
			]
			//res.send('<h1>hello express!</h1>');
			//res.send is the response for the http request so when someone views the website theyll see the string, they'll get this back as the body data if they make an http request
			//because we are now using res.render via handlebars, we no longer need res.send
		}); /*/
	});

app.get('/about', (req, res) => {
		
	res.render('about.hbs', {
		pageTitle: 'About Page',
		currentYear: new Date().getFullYear()
	});
});

app.get('/projects', (req, res) => {
		
	res.render('projects.hbs', {
		pageTitle: 'Projects Page',
		projectMessage: 'This is a project whoo hoo'
	});	
});

app.get('/bad', (req, res) => {
	res.send({
		errorMessage: 'You failed!',
	});
});

//app.listen binds the application to a port 
app.listen(port, () => {
	//this is an environment variable that allows the actual port to be a dynamic number.  When deployed to Heroku you don't have to worry about the fact that the port number changes every time
	console.log(`Server is up on port ${port}`); 	
});





