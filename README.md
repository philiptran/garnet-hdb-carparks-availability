# hdb-carpark-availability sample dataset for Garnet framework integration

This repo contains few sub folders to provide a complete example of data producers and consumers for Garnet platform.

1. `register-carparks` - scripts to register the HDB carparks as entities into the Garnet platform
2. `hdb-carpark-availability` - Lambda function that can be scheduled to run after X minutes to retrieve the latest HDB carpark slot availability and ingest the data into the Garnet platform
3. `hdb-carpark-receiver-api` - an API for posting manual updates of slot availability for a specific carpark

Refer to the `README` file in the respective folders for detailed instructions.

Here's the content converted to markdown format:

# Deployment Instructions

## A. Register the carpark entities into your Garnet platform

### Step 1 – Register carpark entities

Navigate to the "register-carparks" subfolder and run:

```bash
export GARNET_URL="<YOUR-GARNET-API-ENDPOINT>"
npm install
node carpark-provisioning-script.js
```

### Step 2 – Deploy the "hdb-carpark-availability" Lambda function

1. Navigate to the "hdb-carpark-availability" subfolder

2. Edit the "template.yaml" file and update the environment variables:

```yaml
Environment:
  Variables:
    GARNET_IOT_SQS_URL: <YOUR-GARNET-SQS-URL-ENDPOINT>
    THING_PREFIX: Singapore-Parking
    URL_API: https://api.data.gov.sg/v1/transport/carpark-availability
```

3. Install Prerequisites:
   - Install AWS CLI: Follow instructions at https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
   - Install AWS SAM CLI: Follow instructions at https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html

4. Verify installations:
```bash
aws sts get-caller-identity
sam -h
```

5. Build and deploy the Lambda function:
```bash
cd hdb-carpark-availability
npm install
sam build
sam deploy
```

6. Confirm deployment when prompted

7. Check AWS Management Console > Lambda service for "hdb-carpark-availability-XXX" function

8. Run a test to verify function operation. The default schedule is every 15 minutes, adjustable via EventBridge rule under "Triggers" configuration.

## B. Consuming the HDB carpark data

```bash
# Set environment variables
export GarnetEndpoint="<YOUR-GARNET-API-ENDPOINT>"
export Entity="ParkingGroup"

# Query all entities
curl --location "${GarnetEndpoint}/ngsi-ld/v1/entities" \
--header 'Content-Type: application/ld+json' \
--data-raw '${Entity}'

# Query specific parking group
curl --location ${GarnetEndpoint}/ngsi-ld/v1/entities/urn:ngsi-ld:ParkingGroup:Singapore-Parking-SB46 \
--header 'Content-Type: application/ld+json'

# Concise query (header required)
curl --location "${GarnetEndpoint}/ngsi-ld/v1/entities?type=ParkingGroup&options=concise" \
--header 'Link: <https://raw.githubusercontent.com/awslabs/garnet-framework/main/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"' \
> test.json

# Geospatial query - carparks near Orchard (within 1000m)
curl --location --globoff "${GarnetEndpoint}/ngsi-ld/v1/entities?type=ParkingGroup&georel=near%3BmaxDistance%3D%3D2000&geometry=Point&coordinates=[103.831833%2C1.304833]" \
--header 'Link: <https://raw.githubusercontent.com/awslabs/garnet-framework/main/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"' \
> test-geoquery.json
```
