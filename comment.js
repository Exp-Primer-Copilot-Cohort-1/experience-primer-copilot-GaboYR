//Create web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

//Use body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Set up public folder
app.use(express.static(path.join(__dirname, 'public')));

//Set up port
const port = process.env.PORT || 3000;

//Set up database
const db = require('./config/database');
db.connect(err => {
    if (err) {
        console.log('Unable to connect to database');
        process.exit(1);
    } else {
        console.log('Connected to database');
    }
});

//Set up routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Comment' });
});

app.post('/submit', (req, res) => {
    const { name, email, comment } = req.body;
    const query = 'INSERT INTO comments (name, email, comment) VALUES (?, ?, ?)';
    db.execute(query, [name, email, comment], (err, result) => {
        if (err) {
            res.send('Unable to submit comment');
        } else {
            res.send('Comment submitted');
        }
    });
});

//Listen on port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});