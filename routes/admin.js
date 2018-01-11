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
                        res.render('admin/index', {
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
    //POST a new blob
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var _id = req.body._id;
        var name = req.body.name;
        var number = req.body.number;
        var category = req.body.category;
        var description = req.body.description;
        var comment = req.body.comment;        
        var theory = req.body.theory;
        var avtodrom = req.body.avtodrom;
        var city = req.body.city;
        var adress1 = req.body.adress1;
        var adress2 = req.body.adress2;
        var adress3 = req.body.adress3;
        var adress4 = req.body.adress4;
        var adress5 = req.body.adress5;
        var adress6 = req.body.adress6;
        var adress7 = req.body.adress7;
        var adress8 = req.body.adress8;
        var adress9 = req.body.adress9;
        var adress10 = req.body.adress10;
        var adress11 = req.body.adress11;
        var adress12 = req.body.adress12;
        var adress13 = req.body.adress13;
        var adress14 = req.body.adress14;
        var adress15 = req.body.adress15;
        var adress16 = req.body.adress16;
        var phone1 = req.body.phone1;
        var phone2 = req.body.phone2;
        var phone3 = req.body.phone3;
        var phone4 = req.body.phone4;
        var phone5 = req.body.phone5;
        var phone6 = req.body.phone6;
        var phone7 = req.body.phone7;
        var phone8 = req.body.phone8;
        var phone9 = req.body.phone9;
        var phone10 = req.body.phone10;
        var phone11 = req.body.phone11;
        var phone12 = req.body.phone12;
        var phone13 = req.body.phone13;
        var phone14 = req.body.phone14;
        var phone15 = req.body.phone15;
        var phone16 = req.body.phone16;
        //call the create function for our database
        mongoose.model('School').create({
          _id : _id,
          name: name,
          number: number,
          category: category,
          description: description,
          reviews: [{
            comment: comment
          }],
          theory: theory,
          avtodrom: avtodrom,
          city: city,
          adress1: adress1,
          adress2: adress2,
          adress3: adress3,
          adress4: adress4,
          adress5: adress5,
          adress6: adress6,
          adress7: adress7,
          adress8: adress8,
          adress9: adress9,
          adress10: adress10,
          adress11: adress11,
          adress12: adress12,
          adress13: adress13,
          adress14: adress14,
          adress15: adress15,
          adress16: adress16,
          phone1: phone1,
          phone2: phone2,
          phone3: phone3,
          phone4: phone4,
          phone5: phone5,
          phone6: phone6,
          phone7: phone7,
          phone8: phone8,
          phone9: phone9,
          phone10: phone10,
          phone11: phone11,
          phone12: phone12,
          phone13: phone13,
          phone14: phone14,
          phone15: phone15,
          phone16: phone16
        }, function (err, school) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //School has been created
                  console.log('POST creating new blob: ' + school);
                  res.format({
                      //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("admin");
                        // And forward to success page
                        res.redirect("/admin");
                    },
                    //JSON response will show the newly created blob
                    json: function(){
                        res.json(school);
                    }
                });
              }
        })
    });

/* GET New School page. */
router.get('/new', function(req, res) {
    res.render('admin/new', { title: 'Добавить Автошколу' });
});

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
        console.log('GET Retrieving ID: ' + school._id);
        res.format({
          html: function(){
              res.render('admin/show', {
                "school" : school
              });
          },
          json: function(){
              res.json(school);
          }
        });
      }
    });
  });

router.route('/:id/edit')
	//GET the individual blob by Mongo ID
	.get(function(req, res) {
	    //search for the blob within Mongo
	    mongoose.model('School').findById(req.id, function (err, school) {
	        if (err) {
	            console.log('GET Error: There was a problem retrieving: ' + err);
	        } else {
	            //Return the blob
	            console.log('GET Retrieving ID: ' + school._id);
	            res.format({
	                //HTML response will render the 'edit.jade' template
	                html: function(){
	                       res.render('admin/edit', {
	                          title: 'Автошкола ' + school.name,
	                          "school" : school
	                      });
	                 },
	                 //JSON response will return the JSON output
	                json: function(){
	                       res.json(school);
	                 }
	            });
	        }
	    });
	})
	//PUT to update a blob by ID
	.put(function(req, res) {
	    // Get our REST or form values. These rely on the "name" attributes
      var name = req.body.name;
      var number = req.body.number;
      var category = req.body.category;
      var description = req.body.description;
      var schoolId = req.body.schoolId;
      var schoolName = req.body.schoolName;
      var date = req.body.date;
      var avatar = req.body.avatar;
      var userId = req.body.userId;
      var userName = req.body.userName;
      var comment = req.body.comment;  
      var rating = req.body.rating;  
      var theory = req.body.theory;
      var avtodrom = req.body.avtodrom;
      var city = req.body.city;
      var adress1 = req.body.adress1;
      var adress2 = req.body.adress2;
      var adress3 = req.body.adress3;
      var adress4 = req.body.adress4;
      var adress5 = req.body.adress5;
      var adress6 = req.body.adress6;
      var adress7 = req.body.adress7;
      var adress8 = req.body.adress8;
      var adress9 = req.body.adress9;
      var adress10 = req.body.adress10;
      var adress11 = req.body.adress11;
      var adress12 = req.body.adress12;
      var adress13 = req.body.adress13;
      var adress14 = req.body.adress14;
      var adress15 = req.body.adress15;
      var adress16 = req.body.adress16;
      var phone1 = req.body.phone1;
      var phone2 = req.body.phone2;
      var phone3 = req.body.phone3;
      var phone4 = req.body.phone4;
      var phone5 = req.body.phone5;
      var phone6 = req.body.phone6;
      var phone7 = req.body.phone7;
      var phone8 = req.body.phone8;
      var phone9 = req.body.phone9;
      var phone10 = req.body.phone10;
      var phone11 = req.body.phone11;
      var phone12 = req.body.phone12;
      var phone13 = req.body.phone13;
      var phone14 = req.body.phone14;
      var phone15 = req.body.phone15;
      var phone16 = req.body.phone16;
	    //find the document by ID
	    mongoose.model('School').findById(req.id, function (err, school) {
	        //update it
	        school.update({
            name: name,
            number: number,
            category: category,
            description: description,
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
            }, 
            theory: theory,
            avtodrom: avtodrom,
            city: city,
            adress1: adress1,
            adress2: adress2,
            adress3: adress3,
            adress4: adress4,
            adress5: adress5,
            adress6: adress6,
            adress7: adress7,
            adress8: adress8,
            adress9: adress9,
            adress10: adress10,
            adress11: adress11,
            adress12: adress12,
            adress13: adress13,
            adress14: adress14,
            adress15: adress15,
            adress16: adress16,
            phone1: phone1,
            phone2: phone2,
            phone3: phone3,
            phone4: phone4,
            phone5: phone5,
            phone6: phone6,
            phone7: phone7,
            phone8: phone8,
            phone9: phone9,
            phone10: phone10,
            phone11: phone11,
            phone12: phone12,
            phone13: phone13,
            phone14: phone14,
            phone15: phone15,
            phone16: phone16
	        }, function (err, schoolID) {
	          if (err) {
	              res.send("There was a problem updating the information to the database: " + err);
	          }
	          else {
	                  //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
	                  res.format({
	                      html: function(){
	                           res.redirect("/admin/" + school._id);
	                     },
	                     //JSON responds showing the updated values
	                    json: function(){
	                           res.json(school);
	                     }
	                  });
	           }
	        })
	    });
	})
	//DELETE a School by ID
	.delete(function (req, res){
	    //find blob by ID
	    mongoose.model('School').findById(req.id, function (err, school) {
	        if (err) {
	            return console.error(err);
	        } else {
	            //remove it from Mongo
	            school.remove(function (err, school) {
	                if (err) {
	                    return console.error(err);
	                } else {
	                    //Returning success messages saying it was deleted
	                    console.log('DELETE removing ID: ' + school._id);
	                    res.format({
	                        //HTML returns us back to the main page, or you can create a success page
	                          html: function(){
	                               res.redirect("/admin");
	                         },
	                         //JSON returns the item with the message that is has been deleted
	                        json: function(){
	                               res.json({message : 'deleted',
	                                   item : school
	                               });
	                         }
	                      });
	                }
	            });
	        }
	    });
	});

module.exports = router;
