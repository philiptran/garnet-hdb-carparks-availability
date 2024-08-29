# Setup environment variables 

```
export GarnetEndpoint="<YOUR-GARNET-API-ENDPOINT>"
export Entity="ParkingGroup"
```

# Query all entities of "ParkingGroup" type

```
curl --location "${GarnetEndpoint}/ngsi-ld/v1/entities" \
--header 'Content-Type: application/ld+json' \
--data-raw '${Entity}'
```

# Query slot availability for a carpark

```
curl --location ${GarnetEndpoint}/ngsi-ld/v1/entities/urn:ngsi-ld:ParkingGroup:Singapore-Parking-SB46 \
--header 'Content-Type: application/ld+json'
```

# header is required - otherwise, return empty result

```
curl --location "${GarnetEndpoint}/ngsi-ld/v1/entities?type=ParkingGroup&options=concise" \
--header 'Link: <https://raw.githubusercontent.com/awslabs/garnet-framework/main/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"' \
> test.json
```

# Geospatial query - carparks near to Orchard (near 1000m)

```
curl --location --globoff "${GarnetEndpoint}/ngsi-ld/v1/entities?type=ParkingGroup&georel=near%3BmaxDistance%3D%3D2000&geometry=Point&coordinates=[103.831833%2C1.304833]" \
--header 'Link: <https://raw.githubusercontent.com/awslabs/garnet-framework/main/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"' \
> test-geoquery.json
```

# NGSI-LD subcriptions
See: https://garnet-framework.dev/docs/how/context-broker#ngsi-ld-subscriptions

Creating a basic subscription that will be triggered every time a carpark's slot availability is updated.

Edit the test-sub.json file to provide the URL for the Garnet Private Subscription Endpoint. You can get this value from the CloudFormation stack's outputs.

```
vi test-sub.json
# Replace <YOUR-GARNET-PRIVATE-SUBSCRIPTION-ENDPOINT> with the correct value and save the file

Create a subscription using Garnet API.

``` 
curl -v --location ${GarnetEndpoint}/ngsi-ld/v1/subscriptions \
--header 'Content-Type: application/ld+json' \
--data "@test-sub.json"
```

Verify that a notification is delivered to the IoT Core's MQTT topics using AWS IoT Core console's MQTT test client. Subscribe to a wildcard topic `garnet/subscriptions/#` to view all notifications for Garnet subscriptions.

Trigger the `hdb-carpark-availability-XXX` Lambda function to update the latest slot availability for the carparks. Verify that there is a new notification received in the MQTT test client that you set up above.

```
# Get all subscriptions
curl --location ${GarnetEndpoint}/ngsi-ld/v1/subscriptions/ \
--header 'Content-Type: application/ld+json' 

# Delete a subscription
curl --location --request DELETE ${GarnetEndpoint}/ngsi-ld/v1/subscriptions/urn:ngsi-ld:Subscription:Singapore-Parking-SB46
```
