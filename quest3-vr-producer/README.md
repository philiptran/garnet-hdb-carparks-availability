# hdb-carpark-receiver-api

This project contains sample code for HDB carpark receiver API to update the carpark slot availability in Garnet platform via API.

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

You can find your API Gateway Endpoint URL in the output values displayed after deployment.

## Quick Tests

Navigate to the API Gateway console and locate the API key for the HDB carpark receiver API, `API Gateway > APIs > API keys`. Also take note of the URL for the API endpoint to configure the environment variables below.

```
export APIKey=<YOUR_API_KEY>
export API_URL=<YOUR_API_ENDPOINT>
curl -H "x-api-key: ${APIKey}" --location ${API_URL} --data-raw '{"carparkNo": "SB46", "availableSlotNumber": "20"}'

# test echo API
export ECHO_API=<YOUR-TEST-ECHO-API>
curl -H "x-api-key: ${APIKey}" --location ${ECHO_API} --data-raw '{"carparkNo": "SB46", "availableSlotNumber": "20"}'
```

Verify that a notification is delivered to the IoT Core's MQTT topics using AWS IoT Core console's MQTT test client. Subscribe to a wildcard topic `garnet/subscriptions/#` to view all notifications for Garnet subscriptions.

## Cleanup

To delete the sample application that you created, use the AWS CLI. Assuming you used your project name for the stack name, you can run the following:

```bash
sam delete --stack-name hdb-carpark-receiver-api
```

## Resources

See the [AWS SAM developer guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) for an introduction to SAM specification, the SAM CLI, and serverless application concepts.

Next, you can use AWS Serverless Application Repository to deploy ready to use Apps that go beyond hello world samples and learn how authors developed their applications: [AWS Serverless Application Repository main page](https://aws.amazon.com/serverless/serverlessrepo/)
