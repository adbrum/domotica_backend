const express = require('express'); 
const app = express();
const path = require('path');
const onoff = require('onoff');
const cors = require('cors');


app.use(cors());

const Gpio = onoff.Gpio,
  LED = new Gpio(17, 'out'), //#B
  LED2 = new Gpio(18, 'out')

app.use(express.static(path.join(__dirname, 'public')));

console.log(path.join(__dirname, 'public'));

app.get('/', function(req, res){
    if(req.query['place'] === 'sala'){
        console.log('PLACE: ', req.query['place']);
        let value = (LED.readSync() + 1) % 2;        
        LED.writeSync(value);
    }
    if(req.query['place'] === 'quarto'){
        console.log('PLACE: ', req.query['place']);
        let value2 = (LED2.readSync() + 1) % 2;        
        LED2.writeSync(value2);
    }
    
    console.log('RES: ', req.query['state'])

    res.send("Press Button To change Status of Led !!");
});


function unexportOnClose() { //function to run when exiting program
  LED.writeSync(0); // Turn LED off
  LED.unexport(); // Unexport LED GPIO to free resources
  LED2.writeSync(0); // Turn LED2 off
  LED2.unexport(); // Unexport LED2 GPIO to free resources
};

process.on('SIGINT', unexportOnClose); //function to run when user closes using ctrl+c


app.listen(3000, function () {
  console.log('Simple LED Control Server Started on Port: 3000!')
})
