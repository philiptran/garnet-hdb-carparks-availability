const GARNET_IOT_SQS_URL = process.env.GARNET_IOT_SQS_URL
const THING_PREFIX = "Singapore-Parking"
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs"
const sqs = new SQSClient({})
const type = "ParkingGroup"
import carparks from './carparks.json' assert { type: 'json' }

export const lambdaHandler = async (event, context) => {
    let payload = JSON.parse(event.body);
    console.log("Request body: ", payload);
    try {
        // Basic validation
        if (payload["carparkNo"] === undefined || payload["availableSlotNumber"] === undefined) {
            throw Error('Invalid payload!')
        }
        let cpi = carparks.find((cp) => cp.car_park_no == payload["carparkNo"])
        if (cpi === undefined) {
            throw Error('Carpark not found!')
        }
        
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
                value: `MANUAL`
            },
            parkingMode: {
                value: [`${cpi.car_park_type}`]
            },
            reservationType: {
                value: [`${cpi.type_of_parking_system}`]
            },
            availableSpotNumber: {
                value: parseInt(payload["availableSlotNumber"]),
                observedAt: (new Date()).toISOString()
            },
            scope: `/Singapore/${type}/${THING_PREFIX}-${cpi.car_park_no}`,
            refThing: {
                object: `urn:ngsi-ld:Thing:${THING_PREFIX}-${cpi.car_park_no}`
            }
        }
        console.log("updated entity: ", entity);
        await sqs.send(
            new SendMessageCommand({
                QueueUrl: GARNET_IOT_SQS_URL, 
                MessageBody: JSON.stringify(entity)
            }
        ))

        return {
            'statusCode': 200,
            'body': JSON.stringify({
                message: entity
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }
};
