const express = require('express'); 
const app = express();
const path = require('path');
const onoff = require('onoff');
const cors = require('cors');


app.use(cors());

const Gpio = onoff.Gpio,
  LED = new Gpio(17, 'out'), // Sala
  LED2 = new Gpio(18, 'out') // Quarto
  LED3 = new Gpio(16, 'out') // Cozinha

  BLIND = new Gpio(20, 'out'), // Estore Sala
  BLIND2 = new Gpio(21, 'out') // Estore Quarto
  BLIND3 = new Gpio(26, 'out') // Estore Cozinha

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
    if(req.query['place'] === 'cozinha'){
      console.log('PLACE: ', req.query['place']);
      let value3 = (LED3.readSync() + 1) % 2;        
      LED3.writeSync(value3);
    }
    
    console.log('RES: ', req.query['state'])

    res.send("Press Button To change Status of Led !!");
});

app.get('/blind', function(req, res){
      if(req.query['place'] === 'blind_livingroom'){
        console.log('PLACE: ', req.query['place']);
        if (req.query['state_blind'] === 1) {
          BLIND.writeSync(1);
        } else {
          BLIND.writeSync(0);
        }
      }
      if(req.query['place'] === 'blind_room'){
        console.log('PLACE: ', req.query['place']);
        if (req.query['state_blind'] === 1) {
          BLIND2.writeSync(1);
        } else {
          BLIND2.writeSync(0);
        }
      }
      if(req.query['place'] === 'blind_kitchen'){
        console.log('PLACE: ', req.query['place']);
        if (req.query['state_blind'] === 1) {
          BLIND3.writeSync(1);
        } else {
          BLIND3.writeSync(0);
        }
      }
      
    console.log('RES BLIND: ', req.query['state_blind'])

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
