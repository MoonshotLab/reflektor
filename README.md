## Setup
* Install graphics magick
* Install opencv
* Install node
* `npm install`


## Jobs
Create Missing Partner Data:
```javascript
NODE_TLS_REJECT_UNAUTHORIZED=0 node
var jobs = require('./libs/jobs');
jobs.createMissingPartnerData();
```


## Todo

### Photo Collector
1. When a plane is broken
2. Take a picture using the usb webcam
3. Save the image to disk
4. Look for faces in the picture and determine certainty
5. If not x% certain, write a record in the photo queue collection
   stating location certainty, and best guess
6. If certain, drop photo in correct faces dir

### Barkley Partner Parser
x Visit JunkDrawer's Partner Info page
x Parse the page and look for all the names
x Store the name, id, and picture in a new mongo record
x Look for a face in the photo
x Crop it to face dimensions
x Store it in the faces dir with it's mongo record
x use crypto to generate hash

### Face Verifier
1. Get a record from the photoqueue
2. Display, the image with the computer's best guess (contained in queue record)
3. User can verify, say it's someone else, or say it's nobody that works here

### Display
1. On startup, generate the .csv
2. Camera detects people walking by
3. Compares the video stream to it's local photo db
4. If match is found, pull down user record
5. Read aloud and display...


## Compiling the C++ application
Get the most recent version of the haarcascade frontal face on [github](https://github.com/Itseez/opencv/blob/master/data/haarcascades/haarcascade_frontalface_alt.xml) and put it at the root of your project.

```
  g++ face-recognizer.cpp -o face-recognizer `pkg-config --cflags --libs opencv`
```
