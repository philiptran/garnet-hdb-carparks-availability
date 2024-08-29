# hdb-carpark-availability sample dataset for Garnet framework integration

This repo contains few sub folders to provide a complete example of data producers and consumers for Garnet platform.

1. `register-carparks` - scripts to register the HDB carparks as entities into the Garnet platform
2. `hdb-carpark-availability` - Lambda function that can be scheduled to run after X minutes to retrieve the latest HDB carpark slot availability and ingest the data into the Garnet platform
3. `hdb-carpark-receiver-api` - an API for posting manual updates of slot availability for a specific carpark

Refer to the `README` file in the respective folders for detailed instructions.

