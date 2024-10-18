const mqtt = require('mqtt');
const express = require('express');
const app = express();
app.use(express.json());
const brokerUrl = 'mqtt://localhost';


const client = mqtt.connect(brokerUrl);

client.on('error', (error) => {
 console.log("Can't connect" + error);
 process.exit(1);
});
client.on('connect', () => {
    console.log("MQTT connected !!!!"); 
});
let currentScore = 0;
app.post('/update-score', (req, res) => {
    const {score} = req.body;
    currentScore = currentScore + score; 
    client.publish('/score', currentScore.toString(), {qos: 1});
    res.send('Message sent');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    }
);

