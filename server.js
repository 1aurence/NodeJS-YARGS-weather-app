
const axios = require('axios')
const yargs = require('yargs');
const fs = require('fs');

const argv = yargs
    .options({
        a: {
            demand:  false,
            alias: "address",
            describe: 'Address to fetch weather for',
            string: true
        },
          

    })
    .help()
    .alias('help', 'h')
    .argv;

let userAddress = encodeURIComponent(argv.address)
let geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${userAddress}&key=AIzaSyB5v0axbuyI58crL0_rKMdOKULm24-pxeo`

axios.get(geocodeUrl).then((res) => {
   
    if(res.data.status === 'ZERO_RESULTS'){
        throw new Error("Unable to find that address.") 
    }
    let lat = res.data.results[0].geometry.location.lat;
    let lng = res.data.results[0].geometry.location.lng;
    let weatherUrl = `https://api.darksky.net/forecast/928c8d9b26abdc20a2c1f74be139f687/${lat}, ${lng}`

    console.log(res.data.results[0].formatted_address)
    return axios.get(weatherUrl)
}).then((res) => {
    let temp = res.data.currently.temperature;
    let apparentTemp = res.data.currently.apparentTemperature;
    console.log(` it's currently ${temp} and it feels like ${apparentTemp}`)
}).catch((err) => {
    if(err.code === 'ENOTFOUND'){
        console.log('Unable to connect to API servers')
    }else {
        console.log(err.message)
    }
})
