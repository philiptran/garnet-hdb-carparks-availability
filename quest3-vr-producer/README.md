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

The first command will build the source of your application. The second command will package and deploy your application to AWS, with a series of prompts:

* **Stack Name**: The name of the stack to deploy to CloudFormation. This should be unique to your account and region, and a good starting point would be something matching your project name.
* **AWS Region**: The AWS region you want to deploy your app to.
* **Confirm changes before deploy**: If set to yes, any change sets will be shown to you before execution for manual review. If set to no, the AWS SAM CLI will automatically deploy application changes.
* **Allow SAM CLI IAM role creation**: Many AWS SAM templates, including this example, create AWS IAM roles required for the AWS Lambda function(s) included to access AWS services. By default, these are scoped down to minimum required permissions. To deploy an AWS CloudFormation stack which creates or modifies IAM roles, the `CAPABILITY_IAM` value for `capabilities` must be provided. If permission isn't provided through this prompt, to deploy this example you must explicitly pass `--capabilities CAPABILITY_IAM` to the `sam deploy` command.
* **Save arguments to samconfig.toml**: If set to yes, your choices will be saved to a configuration file inside the project, so that in the future you can just re-run `sam deploy` without parameters to deploy changes to your application.

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

## Quick Tests

After deployment, you can test the Lambda function by invoking it with sample VR headset data:

```bash
# Test the Lambda function with sample VR data
aws lambda invoke \
  --function-name quest3-vr-producer-GarnetProducerVREvents \
  --payload '{"headsetId": "Quest3-02", "position": {"x": 1.5, "y": 2.0, "z": 0.5}, "rotation": {"x": 0, "y": 45, "z": 0}, "timestamp": "2024-01-01T12:00:00Z"}' \
  response.json

# View the response
cat response.json
```

The function will process the VR headset data and send it to the configured Garnet SQS endpoint. You can monitor the SQS queue in the AWS console to verify messages are being sent successfully.

## Cleanup

To delete the sample application that you created, use the AWS CLI. Assuming you used your project name for the stack name, you can run the following:

```bash
sam delete --stack-name quest3-vr-producer
```

## Resources

See the [AWS SAM developer guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) for an introduction to SAM specification, the SAM CLI, and serverless application concepts.

Next, you can use AWS Serverless Application Repository to deploy ready to use Apps that go beyond hello world samples and learn how authors developed their applications: [AWS Serverless Application Repository main page](https://aws.amazon.com/serverless/serverlessrepo/)
