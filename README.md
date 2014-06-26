## What is this thing?
A face detection application which identifies a passerby by name and verbally states a personalized message. It's made of several parts, all of which are currently running on a raspberry pi.

### Barkley Partner Parser
Reaches out to Barkley's intranet (junk drawer) to look for updated user information. If new users are found, the app will update the local db with the additional users. Also handy to set up for the first time.

### Photo Collector
A motion detector which acts as a digital trip wire. Anytime the sensor is activated, the webcam takes a quick snap of the person. These photos act as a reference set for the real time face detection and new photos are added to the photo queue.

### Web Application
* Face Verifier - used to help a human train the computer to recognize faces.
* Talking Points - used to establish talking points with individual users.

### Reflektor
Recognizes users as they walk by and reads them a personalized message.

## Setting up the Pi and Installing Dependencies
I've used the standard [NOOBS](http://www.raspberrypi.org/downloads/) Raspbian installation to set up my Raspberry Pi. The README within the NOOBS package is a good place to get started.

After your pi is up an running, you'll need to get the following dependencies
* [Node](http://joshondesign.com/2013/10/23/noderpi)
* Node Dependencies - `npm install` [MongoDB](http://c-mobberley.com/wordpress/2013/10/14/raspberry-pi-mongodb-installation-the-working-guide/)
* [gphoto2](http://skowron.biz/artikel/gphoto-raspberry/) or the way I had to do it for my camera [Pi Forums](http://www.raspberrypi.org/forums/viewtopic.php?f=28&t=70049)
* [OpenCV](http://mitchtech.net/raspberry-pi-opencv/)

## Setting up the Camera
* Change the photo size to as small as possible

## Compiling the C++ application
```
  g++ face-recognizer.cpp -o face-recognizer `pkg-config --cflags --libs opencv`
```
