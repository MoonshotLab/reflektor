## What is this thing?
A face detection application which identifies a passerby by name and creates a personalized message. It's made of several parts, all of which are currently running on a raspberry pi.

### Barkley Partner Parser
Reaches out to Barkley's intranet (junk drawer) to look for updated user information. If new users are found, the app will update the local db with the additional users. Also handy to set up for the first time.

### Photo Collector
A motion detector which acts as a digital trip wire. Anytime the sensor is activated, the webcam takes a quick snap of the person. These photos act as a reference set for the real time face detection and new photos are added to the photo queue.

### Web Application
* Face Verifier - used to help a human train the computer to recognize faces.
* Talking Points - used to establish talking points with individual users.

### Reflektor
Recognizes users as they walk by and reads them a personalized message.


## Setting up and Installing Dependencies
I've used the standard [NOOBS](http://www.raspberrypi.org/downloads/) Raspbian installation to set up my Raspberry pi. Install the following:
* [OpenCV](http://mitchtech.net/raspberry-pi-opencv/)
* [Node](http://nodejs.org/)
* Node Dependencies - `npm install`
* [MongoDB](http://c-mobberley.com/wordpress/2013/10/14/raspberry-pi-mongodb-installation-the-working-guide/)
* [fswebcam] - `apt-get install fswebcam`


## Todo
* Create a shell interface to start each of these applications.


## Compiling the C++ application
```
  g++ face-recognizer.cpp -o face-recognizer `pkg-config --cflags --libs opencv`
```
