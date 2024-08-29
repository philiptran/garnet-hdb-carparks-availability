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

```
curl -v --location ${GarnetEndpoint}/ngsi-ld/v1/subscriptions \
--header 'Content-Type: application/ld+json' \
--data "@test-sub.json"
```

Test subscription with external API that is protected with API key.
```
curl -v --location ${GarnetEndpoint}/ngsi-ld/v1/subscriptions \
--header 'Content-Type: application/ld+json' \
--data "@test-sub-ext-api.json"
```

```
# Get all subscriptions
curl --location ${GarnetEndpoint}/ngsi-ld/v1/subscriptions/ \
--header 'Content-Type: application/ld+json' 

# Delete a subscription
curl --location --request DELETE ${GarnetEndpoint}/ngsi-ld/v1/subscriptions/urn:ngsi-ld:Subscription:Singapore-Parking-SB46
```
