# quest3-vr-producer

This project contains sample code for a Quest3 VR headset data producer that sends VR headset telemetry and event data to the Garnet platform via SQS messaging.

## Deploy the sample application

To use the SAM CLI, you need the following tools.

* SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* Node.js - [Install Node.js 18](https://nodejs.org/en/), including the NPM package management tool.

To build and deploy your application for the first time, run the following in your shell:

```bash
sam build
sam deploy --guided
```

The first command will build the source of your application. The second command will package and deploy your application to AWS.

The deployment will create a Lambda function that processes VR headset data and forwards it to your Garnet platform's SQS endpoint.

## Project Architecture

This serverless application consists of:

- **Lambda Function**: `GarnetProducerVREvents` - Processes VR headset telemetry data and formats it for the Garnet platform
- **SQS Integration**: Sends formatted NGSI-LD entities to the configured Garnet SQS endpoint
- **VR Data Processing**: Handles Quest3 headset position, rotation, and other telemetry data

## Configuration

The application requires the following parameter during deployment:

- `GarnetSQSEndpoint`: The SQS URL endpoint for your Garnet platform instance

The Lambda function creates NGSI-LD compliant entities with the following structure:
- Entity ID: `urn:ngsi-ld:VR-Headsets:VR-Headset-{DEVICE_ID}`
- Entity Type: `VR-Headsets`
- Scope: `/Singapore/VR-Headsets/VR-Headset-{DEVICE_ID}`

The function will process the VR headset data and send it to the configured Garnet SQS endpoint. You can monitor the SQS queue in the AWS console to verify messages are being sent successfully.

## Cleanup

To delete the sample application that you created, use the AWS CLI. Assuming you used your project name for the stack name, you can run the following:

```bash
sam delete --stack-name quest3-vr-producer
```

## Resources

See the [AWS SAM developer guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) for an introduction to SAM specification, the SAM CLI, and serverless application concepts.

Next, you can use AWS Serverless Application Repository to deploy ready to use Apps that go beyond hello world samples and learn how authors developed their applications: [AWS Serverless Application Repository main page](https://aws.amazon.com/serverless/serverlessrepo/)
