require('util').inspect.defaultOptions.depth = null

const axios = require('axios')
const THING_PREFIX = `VR-Headset`
const DEVICE_ID = "Quest3-02"
const GARNET_URL = process.env.GARNET_URL
console.log(GARNET_URL)

const headers = { headers: {
    'Content-Type': 'application/json',
    'Link': `<https://raw.githubusercontent.com/awslabs/garnet-framework/main/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"`
}}

handler = async() => {    
    let thing = {
        id: `urn:ngsi-ld:Thing:${THING_PREFIX}-${DEVICE_ID}`,
        type: 'Thing',
        thingGroups: {
            value: ["VR-Headsets", "Singapore"]
        },
       scope: `/Singapore/VREvents/${THING_PREFIX}-${DEVICE_ID}` 
    }

   console.log(thing)

   try {
        let {data} = await axios.post(`${GARNET_URL}/iot/things`, thing, headers)
        console.log(data)
    } catch (e) {
        console.error(e)
    }
}

handler()