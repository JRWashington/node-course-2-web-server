const express = require('express');
const hbs = require('hbs');
const fs = require('fs')

const port = process.env.PORT || 3000;
const app = express();

// Middleware
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// App.use is how you register middleware
app.use((req, res, next) => {
  let now = new Date().toString();
  let log = `${now}: ${req.method} ${req.url}`
  console.log(log)
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log')
    }
  })
  next();
})

app.use((req, res, next) => {
  res.render('maintenance')
})

app.use(express.static(__dirname + '/public'));


//  Helpers are partial functions. 
// Better to add them like this than to individually add them to each render route
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
})

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase()
})



app.get('/', (req, res) => {
  // res.send('<h1>Hello Express!</h1>')
  res.render('home', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my website'
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    pageTitle: 'About Page',
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
