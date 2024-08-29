export const lambdaHandler = async (event, context) => {
    console.log("Received event: ", event);
    return {
        'statusCode': 200,
        'body': JSON.stringify({
            message: event
        })
    }
}
