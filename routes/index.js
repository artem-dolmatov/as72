var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

//Any requests to this controller must pass through this 'use' function
//Copy and pasted from method-override
router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Автошколы Екатеринбурга' });
// });

//build the REST operations at the base for blobs
//this will be accessible from http://127.0.0.1:3000/blobs if the default route for / is left unchanged
router.route('/')
  //GET all blobs
  .get(function (req, res, next) {
    //retrieve all blobs from Monogo
    mongoose.model('School').find({}, function (err, schools) {
      if (err) {
        return console.error(err);
      } else {
        //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
        res.format({
          //HTML response will render the index.jade file in the views/blobs folder. We are also setting "blobs" to be an accessible variable in our jade view
          html: function () {
            res.render('index', {
              title: 'Автошколы Тюмени',
              "schools": schools
            });
          },
          //JSON response will show all blobs in JSON format
          json: function () {
            res.json(schools);
          }
        });
      }
    });
  })

router.get('/pdd/exam/', function(req, res) {
  res.render('components/pdd/index', { user: req.user }, { title: 'Экзамен ПДД Онлайн'});
});

module.exports = router;
