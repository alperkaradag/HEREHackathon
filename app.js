
const express = require('express');
const app = express();
app.set('view engine','ejs');
const multer = require('multer');
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var parseString = require('xml2js').parseString;


var ThyApiKey = "l7xx66ea9f7e7b044ec690c5423aa5eb5789";
var HereAppId = "XHKs8GRGYR0UbHLwZXM4";
var HereAppCode = "klJPvYxF8S0EbZtwvh5IOQ";

app.use(urlencodedParser);

const request = require("request");

function doRequest(url) {
    return new Promise(function (resolve, reject) {
    request(url, function (error, res, body) {
        if (!error && res.statusCode == 200) {
        resolve(body);
        } else {
        reject(error);
        }
    });
    });
}

async function getRouteTime(StartLocation, FinishLocation, DepartureTime){
    StartLocation = "geo!52.5,13.4";
    FinishLocation = "geo!52.5,13.45"; 
    var query = {};
    query.uri = "https://route.api.here.com/routing/7.2/calculateroute.xml"
    query.app_id = HereAppId;
    query.app_code = HereAppCode;
    query.waypoint0 = StartLocation;
    query.waypoint1 = FinishLocation;
    query.mode = "fastest;car;traffic:enabled";
    //TODO: departure time
    query.departure = "now";


    query = "https://route.api.here.com/routing/7.2/calculateroute.json?app_id="+query.app_id+"&app_code="+query.app_code+"&waypoint0="+query.waypoint0+"&waypoint1="+query.waypoint1+"&mode="+query.mode+"&departure="+query.departure;
    var parsedBody = await doRequest(query);
    parsedBody = JSON.parse(parsedBody);

    return parsedBody.response.route[0].summary.text;

}

app.get("/",async function(req,res){
    var asd = await getRouteTime("geo!52.5,13.4","geo!52.5,13.45","2018-07-04T17:00:00+02");
    //console.log(result);
    res.send(asd);

    // var	FlightDate = req.params.flightdate;
    // var FlightNumber = req.params.flightnumber;
    // var StartLocation = req.params.startlocation;
    // var AirportName = req.params.airportname;

    // //TODO: Get location of airport
    // var FinishLocation = 0;

    // //TODO: Get flight departure time
    // var DepartureTime = 0;

    // //TODO: Dynamic walking delay
    // var WalkingDelay = 30;

    // var AverageRouteTime = getRouteTime(StartLocation,FinishLocation,DepartureTime);

    // var PossibleAnswer = DepartureTime - AverageRouteTime - WalkingDelay;

    // var PossibleRouteTime = getRouteTime(StartLocation,FinishLocation,PossibleAnswer);    
    
    // while(PossibleAnswer + PossibleRouteTime + WalkingDelay > DepartureTime){
    //     PossibleAnswer -= 10;
    //     var PossibleRouteTime = getRouteTime(StartLocation,FinishLocation,PossibleAnswer);
    // }
    // res.send(PossibleAnswer);
});

app.listen(process.env.PORT || 3000, "0.0.0.0");
console.log("Connected.");
