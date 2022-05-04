const axios = require('axios');

const API_URL = "https://60c8ed887dafc90017ffbd56.mockapi.io/robots";

const BACKUP_API_URL = "https://svtrobotics.free.beeceptor.com/robots";

function calculateDistance(x1, x2, y1, y2) {
    return Math.sqrt((Math.pow((x2-x1), 2)) + (Math.pow((y2-y1), 2)));
}

function fetchData(callback) {
    axios.get(API_URL)
    .then(res => {
        return callback(null, res.data);
    })
    .catch(error => {
        console.log(error);
        console.log("Trying Backup URL");
        axios.get(BACKUP_API_URL)
        .then(res => {
            return callback(null, res.data);
        })
        .catch(error => {
            return callback(error, null);
        });
    });
}

function getClosestRobot(loadId, x, y, callback) {
    fetchData(function (err, res) {
        if (err) {
            console.log("There was an error processing the API request. Please try again");
        }
        
        let currentClosestDist = Infinity;
        let currentClosestRobot = null;
        let closeRobots = [];
        
        // Test data point (uncomment to test the under 10 distance units robots feature)
        //closeRobots.push( { robotId : '101', batteryLevel: 40, y: 6, x: 2, distanceToGoal: 6.07 } );
        for (let i = 0; i < res.length; i++) {
            let distanceToGoal = calculateDistance(x, res[i].x, y, res[i].y);

            // If the current robot has no battery, move onto the next one
            if (res[i].batteryLevel == 0) continue;

            // Add the robots within 10 units to an array
            if (distanceToGoal <= 10) {
                res[i].distanceToGoal = distanceToGoal;
                closeRobots.push(res[i]);
            }

            // Check if the current robot is closer than the current closest
            if (distanceToGoal < currentClosestDist) {
                currentClosestDist = distanceToGoal;
                res[i].distanceToGoal = distanceToGoal;
                currentClosestRobot = res[i];
            }
        }

        // If there are multiple robots within 10 distance units, we must
        // pick the robot with the highest battery level
        if (closeRobots.length > 1) {
            let highestBatteryLevel = 0;
            for (let i = 0; i < closeRobots.length; i++) {
                if (closeRobots[i].batteryLevel > highestBatteryLevel) {
                    highestBatteryLevel = closeRobots[i].batteryLevel;
                    currentClosestRobot = closeRobots[i];
                }
            }
        }

        // Return the best robot for the load
        return callback(null, { robotId: currentClosestRobot.robotId, distanceToGoal: currentClosestRobot.distanceToGoal, batteryLevel: currentClosestRobot.batteryLevel });
    });
}

// Change variables for testing
let loadId = 1;
let x = 1;
let y = 1;

getClosestRobot(loadId, x, y, function (err, res) {
    if (err) {
        console.log(err);
    }
    // Print out the response from the function
    console.log(res);
});