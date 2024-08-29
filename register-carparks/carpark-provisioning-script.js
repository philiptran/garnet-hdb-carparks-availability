require('util').inspect.defaultOptions.depth = null

const axios = require('axios')
const fs = require('fs')
const THING_PREFIX = `Singapore-Parking`
const GARNET_URL = process.env.GARNET_URL
console.log(GARNET_URL)

const headers = { headers: {
    'Content-Type': 'application/json',
    'Link': `<https://raw.githubusercontent.com/awslabs/garnet-framework/main/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"`
}}

handler = async() => {    
    let csv = fs.readFileSync('./carpark.csv')
    const proj4 = require('proj4')

    let source = "+proj=tmerc +lat_0=1.366666666666667 +lon_0=103.8333333333333 +k=1 +x_0=28001.642 +y_0=38744.572 +ellps=WGS84 +units=m +no_defs "
    let dest = "EPSG:4326"



    const array = csv.toString().split("\n")

    let [header, ...body] = array

    header = header.split(',')
    body = body.map((bd) => bd.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/))


    //console.log(body)

    let carparks = []
    body.forEach(bd => {
        let carpark = header.reduce((prev, curr, index, arr) => {
            if(bd?.[index]){
                return {...prev, [curr]: bd[index]}  
            }
        }, {})
        
        if(carpark?.x_coord != undefined && carpark?.y_coord != undefined){
            
            let [long, lat] = proj4( source , dest, [Number(carpark.x_coord), Number(carpark.y_coord)])
            carpark.lat = lat
            carpark.long = long
            carparks.push(carpark)
        }
        
    })

    let things = []

    carparks.forEach(carpark => {   
        let thing = {
            id: `urn:ngsi-ld:Thing:${THING_PREFIX}-${carpark.car_park_no}`,
            type: 'Thing',
            location: {
                value: {
                    type: "Point",
                    coordinates: [carpark.long, carpark.lat]
                }
            }, 
            thingGroups: {
                value: ["Parking", "Singapore"]
            },
           scope: `/Singapore/Thing/${THING_PREFIX}-${carpark.car_park_no}` 
            
        }
        
        things.push(thing)
    })

   // fs.writeFileSync('carparks.json', JSON.stringify(carparks))

   console.log(things.length)

    for await (let thing of things){
        try {
            console.log(thing)
            let {data: dt} = await axios.post(`${GARNET_URL}/iot/things`, thing, headers)
           console.log(dt)
        } catch (e) {
            console.log(e)
        }
    }

}

handler()