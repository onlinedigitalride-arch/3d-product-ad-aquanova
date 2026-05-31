// Theatre.js keyframe state for Aqua Nova Ad
// 8-second cinematic sequence: rise → rotate → reveal → hold
export const aquaState = {
  "sheetsById": {
    "AquaNovaAd": {
      "staticOverrides": { "byObject": {} },
      "sequence": {
        "subUnitsPerUnit": 30,
        "length": 8,
        "type": "PositionalSequence",
        "tracksByObject": {
          "Bottle": {
            "trackData": {
              "position.y": {
                "type": "BasicKeyframedTrack",
                "__debugName": "Bottle:position.y",
                "keyframes": [
                  {"id":"b0","position":0,"connectedRight":true,"handles":[0.5,0,0.5,1],"value":-6,"type":"bezier"},
                  {"id":"b1","position":1.5,"connectedRight":true,"handles":[0.3,0,0.7,1],"value":0.2,"type":"bezier"},
                  {"id":"b2","position":2.2,"connectedRight":true,"handles":[0.5,0,0.5,1],"value":-0.1,"type":"bezier"},
                  {"id":"b3","position":3.0,"connectedRight":true,"handles":[0.5,0,0.5,1],"value":0,"type":"bezier"}
                ]
              },
              "rotation.y": {
                "type": "BasicKeyframedTrack",
                "__debugName": "Bottle:rotation.y",
                "keyframes": [
                  {"id":"r0","position":0,"connectedRight":true,"handles":[0.5,0,0.5,1],"value":0,"type":"bezier"},
                  {"id":"r1","position":3,"connectedRight":true,"handles":[0.5,0,0.5,1],"value":3.14,"type":"bezier"},
                  {"id":"r2","position":6,"connectedRight":true,"handles":[0.5,0,0.5,1],"value":6.28,"type":"bezier"},
                  {"id":"r3","position":8,"connectedRight":true,"handles":[0.5,0,0.5,1],"value":9.0,"type":"bezier"}
                ]
              },
              "scale": {
                "type": "BasicKeyframedTrack",
                "__debugName": "Bottle:scale",
                "keyframes": [
                  {"id":"s0","position":0,"connectedRight":true,"handles":[0.5,0,0.5,1],"value":0.2,"type":"bezier"},
                  {"id":"s1","position":1.5,"connectedRight":true,"handles":[0.3,0,0.7,1],"value":1.1,"type":"bezier"},
                  {"id":"s2","position":2.2,"connectedRight":true,"handles":[0.5,0,0.5,1],"value":0.95,"type":"bezier"},
                  {"id":"s3","position":3.0,"connectedRight":true,"handles":[0.5,0,0.5,1],"value":1.0,"type":"bezier"}
                ]
              }
            }
          },
          "KeyLight": {
            "trackData": {
              "intensity": {
                "type": "BasicKeyframedTrack",
                "__debugName": "KeyLight:intensity",
                "keyframes": [
                  {"id":"l0","position":0,"connectedRight":true,"handles":[0.5,0,0.5,1],"value":0,"type":"bezier"},
                  {"id":"l1","position":1.0,"connectedRight":true,"handles":[0.5,0,0.5,1],"value":6,"type":"bezier"},
                  {"id":"l2","position":3.0,"connectedRight":true,"handles":[0.5,0,0.5,1],"value":3,"type":"bezier"}
                ]
              }
            }
          },
          "Camera": {
            "trackData": {
              "position.z": {
                "type": "BasicKeyframedTrack",
                "__debugName": "Camera:position.z",
                "keyframes": [
                  {"id":"c0","position":0,"connectedRight":true,"handles":[0.5,0,0.5,1],"value":10,"type":"bezier"},
                  {"id":"c1","position":2.5,"connectedRight":true,"handles":[0.5,0,0.5,1],"value":6,"type":"bezier"},
                  {"id":"c2","position":5.0,"connectedRight":true,"handles":[0.5,0,0.5,1],"value":5.5,"type":"bezier"}
                ]
              }
            }
          }
        }
      }
    }
  }
}
