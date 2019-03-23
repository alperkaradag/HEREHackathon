
const express = require('express');
const app = express();
app.set('view engine','ejs');
const multer = require('multer');
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var ThyApiKey = "l7xx66ea9f7e7b044ec690c5423aa5eb5789";
var HereAppId = "XHKs8GRGYR0UbHLwZXM4";
var HereAppCode = "klJPvYxF8S0EbZtwvh5IOQ";

app.use(urlencodedParser);

const request = require("request-promise");

function getRouteTime(StartLocation, FinishLocation, DepartureTime){
    var query;
    query.url = "https://route.api.here.com/routing/7.2/calculateroute.xml"
    query.app_id = HereAppId;
    query.app_code = HereAppCode;
    query.waypoint0 = StartLocation;
    query.waypoint1 = FinishLocation;
    query.mode = "fastest;car;traffic:enabled";
    query.departure = DepartureTime;

    // ?app_id={YOUR_APP_ID}
    // &app_code={YOUR_APP_CODE}
    // &waypoint0=geo!52.5,13.4
    // &waypoint1=geo!52.5,13.45
    // &mode=fastest;car;traffic:disabled

    

}

app.get("/",async function(req,res){

    var	FlightDate = req.params.flightdate;
    var FlightNumber = req.params.flightnumber;
    var StartLocation = req.params.startlocation;
    var AirportName = req.params.airportname;

    //TODO: Get location of airport
    var FinishLocation = 0;

    //TODO: Get flight departure time
    var DepartureTime = 0;

    //TODO: Dynamic walking delay
    var WalkingDelay = 30;

    var AverageRouteTime = getRouteTime(StartLocation,FinishLocation,DepartureTime);

    var PossibleAnswer = DepartureTime - AverageRouteTime - WalkingDelay;

    var PossibleRouteTime = getRouteTime(StartLocation,FinishLocation,PossibleAnswer);    
    
    while(PossibleAnswer + PossibleRouteTime + WalkingDelay > DepartureTime){
        PossibleAnswer -= 10;
        var PossibleRouteTime = getRouteTime(StartLocation,FinishLocation,PossibleAnswer);
    }
    res.send(PossibleAnswer);
});

app.listen(process.env.PORT || 3000, "0.0.0.0");
console.log("Connected.");
