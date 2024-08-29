const GARNET_IOT_SQS_URL = process.env.GARNET_IOT_SQS_URL
const THING_PREFIX = process.env.THING_PREFIX
const URL_API = process.env.URL_API // https://api.data.gov.sg/v1/transport/carpark-availability
const axios = require('axios')
const { SQSClient, SendMessageBatchCommand } = require("@aws-sdk/client-sqs")
const sqs = new SQSClient({})
const type = "ParkingGroup"
const carparks = require('./carparks.json')

exports.handler = async (event) => {
    try { 

        let entries = []
        let sgt = new Date().toLocaleString("en-GB", {timeZone: "Asia/Singapore"}).split(/\D/)
        let sgtime = sgt[2] + '-' + sgt[1] + '-' + sgt[0] + 'T' + sgt[4] + ':' + sgt[5] + ':' + sgt[6]
        let {data, data: {items}} = await axios.get(`${URL_API}?date_time=${sgtime}`)
        items.forEach(({carpark_data, timestamp}) => {
        carpark_data.forEach(carpark => {
            let cpi = carparks.find((cp) => cp.car_park_no == carpark.carpark_number)
            if(cpi){
                let entity = {
                    id: `urn:ngsi-ld:${type}:${THING_PREFIX}-${cpi.car_park_no}`,
                    type: type,
                    location: {
                        value: {
                            type: "Point",
                            coordinates: [cpi.long, cpi.lat]
                        }
                    },
                    name: {
                        value: `${THING_PREFIX}-${cpi.car_park_no}`
                    }, 
                    alternateName: {
                        value: `${cpi.car_park_no}`
                    }, 
                    dataProvider: {
                        value: `Singapore Land Transport Authority`
                    },
                    parkingMode: {
                        value: [`${cpi.car_park_type}`]
                    },
                    reservationType: {
                        value: [`${cpi.type_of_parking_system}`]
                    },
                    totalSpotNumber: {
                        value: parseInt(carpark.carpark_info[0].total_lots),
                        observedAt: (new Date(timestamp)).toISOString()
                    },
                    availableSpotNumber: {
                        value: parseInt(carpark.carpark_info[0].lots_available),
                        observedAt: (new Date(timestamp)).toISOString()
                    },
                    scope: `/Singapore/${type}/${THING_PREFIX}-${cpi.car_park_no}`,
                    refThing: {
                        object: `urn:ngsi-ld:Thing:${THING_PREFIX}-${cpi.car_park_no}`
                    }
                }
                entries.push(entity)
            }
        })
    })
    
        let chuncks = entries.reduce((acc, curr, i) => {
            const index = Math.floor(i/10)
            if(!acc[index]) { acc[index] = []}
            acc[index].push({
                Id: `${Math.floor(Math.random() * 1e10)}`,
                MessageBody: JSON.stringify(curr)
            })
            return acc
        }, [])

        for await (let chunck of chuncks){ 
            try {
                console.log(chunck)
                await sqs.send(
                    new SendMessageBatchCommand({
                        QueueUrl: GARNET_IOT_SQS_URL, 
                        Entries: chunck
                    })
                ) 
    
            } catch (e) {
                console.log(e)       
            }
        }

    } catch(e){
        console.log(e)
    }
}