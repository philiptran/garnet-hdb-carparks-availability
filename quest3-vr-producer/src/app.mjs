import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs"

const GARNET_IOT_SQS_URL = process.env.GARNET_IOT_SQS_URL
const THING_PREFIX = "VR-Headset"
const sqs = new SQSClient({})
const type = "VR-Headsets"

export const lambdaHandler = async (event, context) => {
    console.log("Received event: ", event);
    let payload = event;
    
    try {
        // TODO validate payload
        
        // TODO to extract the device id from the event payload
        const DEVICE_ID = "Quest3-02"
        let entity = {
            id: `urn:ngsi-ld:${type}:${THING_PREFIX}-${DEVICE_ID}`,
            type: type,
            name: {
                value: `${THING_PREFIX}-${DEVICE_ID}`
            },
            payload: payload,
            dataProvider: {
                value: `MANUAL`
            },
            scope: `/Singapore/${type}/${THING_PREFIX}-${DEVICE_ID}`,
            refThing: {
                object: `urn:ngsi-ld:Thing:${THING_PREFIX}-${DEVICE_ID}`
            }
        }
        console.log("Updated entity: ", entity);
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
