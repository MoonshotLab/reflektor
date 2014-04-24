## Compiling the C++ application
Get the most recent version of the haarcascade frontal face on [github](https://github.com/Itseez/opencv/blob/master/data/haarcascades/haarcascade_frontalface_alt.xml) and put it at the root of your project.

```
  g++ face-recognizer.cpp -o face-recognizer `pkg-config --cflags --libs opencv`
```
