var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

//Any requests to this controller must pass through this 'use' function
//Copy and pasted from method-override
router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))

//build the REST operations at the base for blobs
//this will be accessible from http://127.0.0.1:3000/blobs if the default route for / is left unchanged
router.route('/')
    //GET all blobs
    .get(function(req, res, next) {
        //retrieve all blobs from Monogo
        mongoose.model('School').find({}, function (err, schools) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                      //HTML response will render the index.jade file in the views/blobs folder. We are also setting "blobs" to be an accessible variable in our jade view
                    html: function(){
                        res.render('schools/index', {
                              title: 'Список Автошкол',
                              "schools" : schools
                          });
                    },
                    //JSON response will show all blobs in JSON format
                    json: function(){
                        res.json(schools);
                    }
                });
              }
        });
    })
// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('School').findById(id, function (err, school) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(blob);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next();
        }
    });
});

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('School').findById(req.id, function (err, school) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID:');
        res.format({
          html: function(){
              res.render('schools/show', {
                title: 'Автошкола ' + school.name,
                "school" : school,
                user: req.user
              });
          },
          json: function(){
              res.json(school);
          }
        });
      }
    });
  })
  //PUT to update a blob by ID
	.put(function (req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var schoolId = req.body.schoolId;
    var schoolName = req.body.schoolName;
    var date = req.body.date;
    var avatar = req.body.avatar;
    var userId = req.body.userId;
    var userName = req.body.userName;
    var comment = req.body.comment;
    var rating = req.body.rating;
    //find the document by ID
    mongoose.model('School').findById(req.id, function (err, school) {
        //update it
        school.update({
            $push: {
                reviews: {
                    schoolId: schoolId,
                    schoolName: schoolName,
                    date: date,
                    avatar: avatar,
                    userId: userId,
                    userName: userName,
                    comment: comment,
                    rating: rating
                }
            }    
        }, function (err, schoolID) {
            if (err) {
                res.send("There was a problem updating the information to the database: " + err);
            }
            else {
                //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                res.format({
                    html: function () {
                        res.redirect("/school/" + school._id);
                    },
                    //JSON responds showing the updated values
                    json: function () {
                        res.json(school);
                    }
                });
            }
        })
    });
})

module.exports = router;
