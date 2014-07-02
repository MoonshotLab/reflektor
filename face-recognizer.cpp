/*
 * Copyright (c) 2011. Philipp Wagner <bytefish[at]gmx[dot]de>.
 * Released to public domain under terms of the BSD Simplified license.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *   * Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *   * Neither the name of the organization nor the names of its contributors
 *     may be used to endorse or promote products derived from this software
 *     without specific prior written permission.
 *
 *   See <http://www.opensource.org/licenses/bsd-license>
 */

#include "opencv2/core/core.hpp"
#include "opencv2/contrib/contrib.hpp"
#include "opencv2/highgui/highgui.hpp"
#include "opencv2/imgproc/imgproc.hpp"
#include "opencv2/objdetect/objdetect.hpp"

#include <iostream>
#include <fstream>
#include <sstream>

using namespace cv;
using namespace std;

static void read_csv(const string& filename, vector<Mat>& images, vector<int>& labels, vector<string>& ids, vector<string>& names, char separator = ';') {
    std::ifstream file(filename.c_str(), ifstream::in);

    string line, path, classlabel, id, name;
    while (getline(file, line)) {
        stringstream liness(line);
        getline(liness, path, separator);
        getline(liness, classlabel, separator);
        getline(liness, id, separator);
        getline(liness, name);
        if(!path.empty() && !classlabel.empty()) {
            images.push_back(imread(path, 0));
            labels.push_back(atoi(classlabel.c_str()));
            names.push_back(name.c_str());
            ids.push_back(id.c_str());
        }
    }
}

int main(int argc, const char *argv[]) {

    // Get the path to your CSV:
    string fn_haar = string(argv[1]);
    string fn_csv = string(argv[2]);
    int deviceId = atoi(argv[3]);

    // These vectors hold the images and corresponding labels:
    vector<Mat> images;
    vector<int> labels;
    vector<string> ids;
    vector<string> names;

    // Read in the data (fails if no valid input filename is given, but you'll get an error message):
    try {
        read_csv(fn_csv, images, labels, ids, names);
    } catch (cv::Exception& e) {
        cerr << "Error opening file \"" << fn_csv << "\". Reason: " << e.msg << endl;
        exit(1);
    }

    // Get the height from the first image. We'll need this
    // later in code to reshape the images to their original
    // size AND we need to reshape incoming faces to this size:
    int im_width = images[0].cols;
    int im_height = images[0].rows;

    // Create a FaceRecognizer and train it on the given images:
    Ptr<FaceRecognizer> model = createFisherFaceRecognizer();
    model->train(images, labels);

    // Create the classifier
    CascadeClassifier haar_cascade;
    haar_cascade.load(fn_haar);

    // Get a handle to the Video device:
    VideoCapture cap(deviceId);
    if(!cap.isOpened()) {
        cerr << "Capture Device ID " << deviceId << "cannot be opened." << endl;
        return -1;
    }

    Mat frame;
    for(;;) {
        cap >> frame;
        Mat original = frame.clone();
        Mat gray;
        cvtColor(original, gray, CV_BGR2GRAY);
        vector< Rect_<int> > faces;
        haar_cascade.detectMultiScale(gray, faces);

        // At this point you have the position of the faces in
        // faces. Now we'll get the faces and make a prediction
        for(int i = 0; i < faces.size(); i++) {
            Rect face_i = faces[i];
            Mat face = gray(face_i);
            Mat face_resized;
            cv::resize(face, face_resized, Size(im_width, im_height), 1.0, 1.0, INTER_CUBIC);
            int prediction = model->predict(face_resized);

            // Log this to stdout so I can pick it up with another app
            cout << ids[prediction] << ":" << prediction << ":" << names[prediction] << endl;
        }
    }
    return 0;
}
