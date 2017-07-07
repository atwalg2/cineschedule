var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var request = require("request");
var date = require('date-and-time');
var sleep = require('sleep');

const options = {
    host: 'localhost',
    port: 5432,
    database: 'freshplaydb',
    user: 'freshplay',
    password: '1234',
};

const pg = require('pg');
 
// POSTGRES PROMISE

const pgp = require('pg-promise')();
const cn = {
    host: 'localhost',
    port: 5432,
    database: 'freshplaydb',
    user: 'freshplay',
    password: '1234',
    poolSize: 50, 
};
const db = pgp(cn);

var connect = "postsgres://freshplay:1234@localhost/freshplaydb";


// -- Use -------------------
app.use(bodyParser.json());
app.use(cors());


//  --------- ROUTES  -------------------------------
var api = express.Router();
var auth = express.Router();

//  --------- GETS -------------------------------

api.get('/myshows', checkAuthenticated, (req, res) => {

    db.any("SELECT poster_url, last_aired, days FROM tv_user_junction t1, tv t2 WHERE t1.uid='" + req.user + "' AND t1.tv_id = t2.tv_id AND t2.days >= 0 ORDER BY days;")
    .then(function(data) {
        var i;
        var then;
        // var now = new Date();
        // date.format(now, 'YYYY/MM/DD');
            // console.log(now);
            // var now  = date.format(new Date(), 'YYYY/MM/DD')
            var now = new Date();
            console.log(data)
            console.log(now);

        for(i = 0; i < data.length; i++){

            then = new Date(data[i].last_aired);
            console.log("DATE NOW AND THEN")
            console.log(now);
            console.log(then);
            console.log(date.subtract(then, now).toDays());

        }

        res.send(data);
        console.log(data);
        // success;
    })
    .catch(function(error) {
        res.status(500).send;
        // error;
    });

});


// Updates all the tv shows using the api (within time limit)
// Consider using PUT request instead of get

api.get('/update', checkAuthenticated, (req, res) => {

    var timeout = 0;
    var round = 0;

    db.any("SELECT tv_id FROM tv")
    .then(function(show_ids) {

        var i;
        var j = 0;

        for(i = 0; i<data.length; i++){

            if(j == 15){
                round++;
                j = 0;           
                // sleep.sleep(20); // sleep for 10 seconds
            }

            setTimeout(function(tv) {

                updateShows(tv)
            }, 10000 * round, data[i].tv_id); // Sleep necessary because of api requests limited based on time

            j++;

        }

        res.end();

    })
    .catch(function(error) {
        res.status(500).send;
    });

});


function updateShows(id) {
    var last;
    var latestSeasonID;
    var latestSeason;
    var nextAirDate = null;
    var daysToRelease = -1000;

        request.get("https://api.themoviedb.org/3/tv/" + id 
            + "?api_key=e26665feb476e9a86ff83ef4194e17ad&language=en-US", function(error, response, body) {

            var data = JSON.parse(body);

            numOfSeasons = data.seasons.length;
            latestSeason = data.seasons[numOfSeasons - 1].season_number;
            last = data.last_air_date;

            request.get('https://api.themoviedb.org/3/tv/' + id + '/season/' + latestSeason + '?language=en-US&api_key=e26665feb476e9a86ff83ef4194e17ad', function(error, response, body) {

                 
                        var seasonData = JSON.parse(body);
                        var seasonLength = seasonData.episodes.length;
                        

			var epi;
                        var then;
                        var now = new Date();

                        for(epi = 0; epi < seasonLength ; epi ++){

                            then = new Date(seasonData.episodes[epi].air_date)
                            daysToRelease = date.subtract(then, now).toDays()
                            nextAirDate = seasonData.episodes[epi].air_date;

                            if(daysToRelease >= 0){

                                nextAirDate = seasonData.episodes[epi].air_date;
                                console.log(nextAirDate)
                                console.log("----- AIR")
                                break
                            }  
                        }


                }).on('response', function(response) {
   
                        return db.task(function (t){
                            return t.query('UPDATE tv SET days = '+ daysToRelease +', last_aired = ' + nextAirDate + '  WHERE tv_id = ' + id +';');
                        })
                        .then(data=>{

                            console.log("done")
                            
                        })
                        .catch(error => {

                            console.log('ERROR:', error); // print error;
                        });

                });
        })
    }


api.get('/search/:searchTerm', checkAuthenticated, (req,res) => {

    request("https://api.themoviedb.org/3/search/tv?api_key=e26665feb476e9a86ff83ef4194e17ad&language=en-US&query=" 
        + req.params.searchTerm + "&page=1", function(error, response, body) {

      // console.log(body);
      res.json(body);
    });
})



//  --------- POSTS -------------------------------

api.post('/users/me', checkAuthenticated, (req, res) => {

    pg.connect(connect, function(err, client, done){
        if(err){

            return console.error('error fetching client from pool', err);
        }

        console.log(req.user);

        client.query("UPDATE users SET f_name='" + req.body.firstName + "', l_name='" + req.body.lastName + "'WHERE uid='" + req.user + "';", function(err, result){
            
            done();

            if(err) {
                return console.error('error running query', err);
            }

            user = result.rows[0];
            res.json(user);

        });
    });
})


// ERROR FIXED USING RES.END()
api.post('/search/add', checkAuthenticated, (req, res) => {

    var last;
    var latestSeasonID;
    var latestSeason;
    var nextAirDate = null;
    var daysToRelease;

        request.get("https://api.themoviedb.org/3/tv/" + req.body.tv_id 
            + "?api_key=e26665feb476e9a86ff83ef4194e17ad&language=en-US", function(error, response, body) {

            var data = JSON.parse(body);
            console.log(data);
            console.log("Newest Season ID:")
            numOfSeasons = data.seasons.length;
            latestSeason = data.seasons[numOfSeasons - 1].season_number;
            // latestSeason = data.seasons.
            // console.log(latestSeason);
            // console.log(data.seasons[totalSeasons - 1].id);
            // latestSeasonID = data.seasons[totalSeasons - 1].id;
            last = data.last_air_date;



            request.get('https://api.themoviedb.org/3/tv/' + req.body.tv_id + '/season/' + latestSeason + '?language=en-US&api_key=e26665feb476e9a86ff83ef4194e17ad', function(error, response, body) {

                    console.log("https://api.themoviedb.org/3/tv/" + req.body.tv_id + "/season/"+ latestSeason + "?language=en-US&api_key=e26665feb476e9a86ff83ef4194e17ad");
                                                

                        console.log("Season INFO:");
                        var seasonData = JSON.parse(body);
                        console.log(seasonData);
                        var seasonLength = seasonData.episodes.length;
                        var epi;

                        var then;
                        var now = new Date();


                        for(epi = 0; epi < seasonLength ; epi ++){
                            
                            then = new Date(seasonData.episodes[epi].air_date)
                            daysToRelease = date.subtract(then, now).toDays()
                            if(daysToRelease > 0){

                                nextAirDate = seasonData.episodes[epi].air_date;
                                break
                            }


                            
                        }

                }).on('response', function(response) {


                    return db.task(function (t){
                        return t.query('INSERT INTO tv_user_junction(uid, tv_id) VALUES( $1, $2 ) ON CONFLICT (uid, tv_id) DO NOTHING', [ req.user, req.body.tv_id ]);
                    })
                    .then(data => {
                        
                        return db.task(function (t){
                        
                            return t.query('INSERT INTO tv(tv_id, poster_url, show_name, first_aired, description, last_aired, days) VALUES( $1, $2, $3, $4, $5, $6, $7 ) ON CONFLICT (tv_id) DO NOTHING',
                                        [ req.body.tv_id, req.body.poster_url, req.body.show_name, req.body.first_aired, req.body.description, nextAirDate, daysToRelease ]);
                        })
                        .then(data=>{
                            console.log("done")
                            res.end();
                        })
                        .catch(error => {
                            console.log('ERROR:', error); // print error;
                        });
            
                    })
                    .catch(error => {
                        console.log('ERROR:', error); // print error;
                    });

                });

        })



auth.post('/login', (req, res) => {

    var user;

    pg.connect(connect, function(err, client, done){
        if(err){

            return console.error('error fetching client from pool', err);
        }

        client.query("SELECT * FROM users WHERE email='" + req.body.email + "';", function(err, result){
           
           done();

            if(err) {

                return console.error('error running query', err);
            }


            user = result.rows[0];

            if (!user)
                sendAuthError(res);

            if (user.password == req.body.password){
                sendToken(user, res);
                
            }
            else{
                sendAuthError(res);
                console.log("auth error");

            }

        });
    });
});



auth.post('/register', (req, res) => {

    pg.connect(connect, function(err, client, done){
        if(err){

            return console.error('error fetching client from pool', err);
        }

        client.query('INSERT INTO users(email, password, f_name, l_name) VALUES( $1, $2, $3, $4)',
            [ req.body.email, req.body.password, req.body.firstName, req.body.lastName]);

        done();
    });

});

//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

function sendToken(user, res) {
    var token = jwt.sign(user.uid, '123');
    res.json({ firstName: user.f_name, token, uid:user.uid });
}

function sendAuthError(res) {
    return res.json({ success: false, message: 'email or password incorrect' });
}

function checkAuthenticated(req, res, next) {
    if(!req.header('authorization'))
        return res.status(401).send({message: 'Unauthorized requested. Missing authentication header'});

    var token = req.header('authorization').split(' ')[1];

    var payload = jwt.decode(token, '123');

    if(!payload)
        return res.status(401).send({message: 'Unauthorized requested. Authentication header invalid'});

    req.user = payload;

    next();
}


app.use('/api', api);
app.use('/auth', auth);


//  --------- PORT -------------------------------
app.listen(8080);
console.log(" \n __________________ Nodejs server has started on port:8080 __________________ \n\nDebug:\n");