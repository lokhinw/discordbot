const request = require("request");

input = "directions from 7 revelstoke crescent richmond hill to markville mall markham";
input = input.toLowerCase();

if (input.indexOf("to ") > input.indexOf("from ")) {

destinationLocation = input.substring(input.indexOf("to ")+3);
departureLocation = input.substring(input.indexOf("from ")+5, input.indexOf("to ")-1);
console.log("Destination: " + destinationLocation + "\nDeparture: " + departureLocation);
} else {

departureLocation = input.substring(input.indexOf("from ")+5);
destinationLocation = input.substring(input.indexOf("to ")+3, input.indexOf("from ")-1);
console.log("Destination: " + destinationLocation + "\nDeparture: " + departureLocation);
}

function removeBrackets(input) {
  return input
    .replace(/{.*?}/g, "")
    .replace(/\[.*?\]/g, "")
    .replace(/<.*?>/g, "")
    .replace(/\(.*?\)/g, "");
}

const getDirections = (departureLocation, destinationLocation) => {
        let url = "https://maps.googleapis.com/maps/api/directions/json?origin=" 
        + departureLocation + "&destination=" + destinationLocation 
        + "&key=AIzaSyBjowTROtfYG8J7Ulwk4OUUemsGysQeWk4";
 /*
 let departureLocation = "";
        let destinationLocation = ""; */
  request(url, function (error, response, body) {
    try {
      let parsedData = JSON.parse(body);
      parsedData.routes[0].legs[0].steps.forEach(function (e) {
        console.log(removeBrackets(e.html_instructions));
        // console.log(removeBrackets(e.html_instructions).replace(/([a-z])([A-Z])/, '$1\n$2'));
      });
      console.log();
    } catch (err) {
      console.log(err);
    }
  });
}

getDirections(departureLocation, destinationLocation)