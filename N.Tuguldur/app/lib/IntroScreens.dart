import 'package:flutter/material.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:lottie/lottie.dart';

// Assuming MyApp is your main application widget
import 'CreateAccount.dart'; // Replace with your actual import

class IntroScreens extends StatefulWidget {
  @override
  _IntroScreensState createState() => _IntroScreensState();
}

class _IntroScreensState extends State<IntroScreens> {
  final List<String> lottieFiles = [
    'assets/Intro/start.json',
    'assets/Intro/start2.json',
    'assets/Intro/start3.json'
  ];

  final List<String> texts = [
    'Хэлний галаксид тавтай морил',
    'Үгсийн орчлонг судалцгаая',
    'Аяллаа бидэнтэй эхлүүлээрэй'
  ];

  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          CarouselSlider.builder(
            itemCount: lottieFiles.length,
            options: CarouselOptions(
              height: double.infinity,
              viewportFraction: 1.0,
              enableInfiniteScroll: false,
              onPageChanged: (index, reason) {
                setState(() {
                  _currentIndex = index;
                });
              },
            ),
            itemBuilder: (context, index, realIndex) {
              return Container(
                color: Colors.black,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.all(20.0),
                        child: Lottie.asset(
                          lottieFiles[index],
                          fit: BoxFit.contain, 
                          width: MediaQuery.of(context).size.width * 0.8, 
                          //height: MediaQuery.of(context).size.height * 0.5, 
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Text(
                        texts[index],
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          decoration: TextDecoration.none,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
          Positioned(
            top: 50,
            right: 20,
            child: TextButton(
              onPressed: () {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => MyApp()), 
                );
              },
              child: Text(
                'Skip',
                style: TextStyle(color: Colors.white, fontSize: 18),
              ),
            ),
          ),
          Positioned(
            bottom: 50,
            left: 20,
            right: 20,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: Icon(Icons.arrow_back, color: Colors.white),
                  onPressed: () {
                    if (_currentIndex > 0) {
                      setState(() {
                        _currentIndex--;
                      });
                    }
                  },
                ),
                Row(
                  children: List.generate(lottieFiles.length, (index) {
                    return Container(
                      margin: EdgeInsets.symmetric(horizontal: 4.0),
                      width: 10.0,
                      height: 10.0,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: _currentIndex == index ? Colors.white : Colors.grey,
                      ),
                    );
                  }),
                ),
                IconButton(
                  icon: Icon(Icons.arrow_forward, color: Colors.white),
                  onPressed: () {
                    if (_currentIndex < lottieFiles.length - 1) {
                      setState(() {
                        _currentIndex++;
                      });
                    } else {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(builder: (context) => MyApp()), // Replace with your main app widget
                      );
                    }
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}


void main() {
  runApp(MaterialApp(
    home: IntroScreens(), 
  ));
}
