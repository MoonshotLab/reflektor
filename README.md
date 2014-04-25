## Jobs you can run
* Fetch Barkley partner data from Junk Drawer. `junkDrawer.updatePartnerRecords`
* Fetch Barkley partner photos `junkDrawer.fetchUserPhotos`. This will put them in a temp directory on your machine.


## Todo

### Camera App
1. A plane is broken
2. Take a picture
3. Look for faces in the picture
4. If a face is detected, save to a temp dir

### Barkley Partner Parser
x Visit JunkDrawer's Partner Info page
x Parse the page and look for all the names
x Store the name, id, and picture in a new mongo record

### Web App
1. Serve a random pic from the temp directory
2. Make a best guess as to who the person is and make a user verify it
3. User can verify, say it's someone else, or say it's nobody that works here
4. Rewrite the csv every time a new one is saved


## Compiling the C++ application
Get the most recent version of the haarcascade frontal face on [github](https://github.com/Itseez/opencv/blob/master/data/haarcascades/haarcascade_frontalface_alt.xml) and put it at the root of your project.

```
  g++ face-recognizer.cpp -o face-recognizer `pkg-config --cflags --libs opencv`
```
