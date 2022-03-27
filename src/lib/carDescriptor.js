const descriptor = {
  "name": "Cars",
  "uri": "http://cars",
  "prefix": "car",
  "types": [
    {
      "name": "Base",
      "properties": [
        { "name": "id", "type": "String", "isAttr": true }
      ]
    },
    {
      "name": "Root",
      "superClass": [ "Base" ],
      "properties": [
        { "name": "cars", "type": "Car", "isMany": true }
      ]
    },
    {
      "name": "Car",
      "superClass": [ "Base" ],
      "properties": [
        { "name": "name", "type": "String", "isAttr": true, "default": "No Name" },
        { "name": "description", "type": "String", "isAttr": true, "default": "No Name" },
        { "name": "power", "type": "Integer", "isAttr": true },
        { "name": "similar", "type": "Car", "isMany": true, "isReference": true }
      ]
    }
  ]
}

export default descriptor;
