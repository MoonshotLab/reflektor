#include "opencv2/core/core.hpp"
#include "opencv2/contrib/contrib.hpp"
#include "opencv2/highgui/highgui.hpp"

#include <iostream>
#include <fstream>

cv::CascadeClassifier face_cascade;

static void read_csv(std::string filename, std::vector<cv::Mat>& images, std::vector<int>& labels){
  std::ifstream file(filename, std::ifstream::in);
  std::string line, path, class_label;

  while(getline(file, line)){
    std::stringstream liness(line);
    getline(liness, path, ';');
    getline(liness, class_label);
    if(!path.empty() && !class_label.empty()){
      images.push_back(cv::imread(path, 0));
      labels.push_back(atoi(class_label.c_str()));
    }
  }
}

int main(int arc, char **argv){
  std::vector <cv::Mat> images;
  std::vector <int> labels;

  face_cascade.load("haarcascade_frontalface_alt.xml");
  read_csv("faces.csv", images, labels);
}
