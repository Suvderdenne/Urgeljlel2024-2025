import 'package:flutter/material.dart';
import 'package:app/start.dart';
import 'package:lottie/lottie.dart';
import 'tests/header_footer.dart';

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topRight,
              end: Alignment.bottomLeft,
              colors: [
                Color.fromARGB(255, 207, 74, 207),
                Color.fromARGB(255, 88, 207, 207),
                Color.fromARGB(255, 81, 255, 148),
              ],
            ),
          ),
          child: ListView(
            children: [
              Padding(
                padding: const EdgeInsets.all(0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: Image.asset(
                        '../assets/home/abc.png',
                        height: 40,
                      ),
                    ),
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        Column(
                          children: [
                            Icon(Icons.circle, color: Colors.blue),
                            Text('0', style: TextStyle(color: Colors.blue)),
                          ],
                        ),
                        SizedBox(width: 20),
                        Column(
                          children: [
                            Icon(Icons.local_fire_department,
                                color: Colors.orange),
                            Text('1', style: TextStyle(color: Colors.orange)),
                          ],
                        ),
                        SizedBox(width: 20),
                        Column(
                          children: [
                            Icon(Icons.diamond, color: Colors.red),
                            Text('822', style: TextStyle(color: Colors.red)),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              Container(
                width: double.infinity,
                height: 1,
                color: const Color.fromARGB(255, 104, 103, 103),
              ),
              const SizedBox(height: 50),
              SingleChildScrollView(
                child: Center(
                  child: Column(
                    children: [
                      Stack(
                        alignment: Alignment.center,
                        children: [
                          Container(
                            margin: EdgeInsets.only(
                                right: 45), // Add margin to the right
                            child: ClipRRect(
                              // borderRadius: BorderRadius.circular(100),
                              child: Lottie.asset(
                                '../assets/home/lot.json',
                                fit: BoxFit.cover,
                                alignment: Alignment.centerLeft,
                                width: 150,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 30),
                      const Text(
                        'Intro',
                        style: TextStyle(
                            fontSize: 24, fontWeight: FontWeight.bold),
                      ),
                      Card(
                        color: Colors.purple.shade100,
                        child: Padding(
                          padding: const EdgeInsets.all(20.0),
                          child: Column(
                            children: [
                              const Text(
                                'Level 0',
                                style: TextStyle(
                                    fontSize: 20, fontWeight: FontWeight.bold),
                              ),
                              const Text(
                                'Lesson 2 / 3',
                                style: TextStyle(fontSize: 16),
                              ),
                              const SizedBox(height: 10),
                              ElevatedButton(
                                onPressed: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                        builder: (context) => Start()),
                                  );
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.purple,
                                ),
                                child: const Text('Start',
                                    style: TextStyle(color: Colors.white)),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 30),
              SingleChildScrollView(
                // scrollDirection: Axis.horizontal,
                child: Center(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Container(
                        margin: const EdgeInsets.symmetric(vertical: 10),
                        width: 200,
                        height: 50,
                        decoration: BoxDecoration(
                          color: Colors.purple,
                          borderRadius: BorderRadius.circular(100),
                        ),
                        child: const Center(
                          child: Text(
                            'Сонсох',
                            style: TextStyle(color: Colors.white),
                          ),
                        ),
                      ),
                      Container(
                        margin: const EdgeInsets.symmetric(vertical: 10),
                        width: 200,
                        height: 50,
                        decoration: BoxDecoration(
                          color: Colors.purple,
                          borderRadius: BorderRadius.circular(100),
                        ),
                        child: const Center(
                          child: Text(
                            'Ярих',
                            style: TextStyle(color: Colors.white),
                          ),
                        ),
                      ),
                      Container(
                        margin: const EdgeInsets.symmetric(vertical: 10),
                        width: 200,
                        height: 50,
                        decoration: BoxDecoration(
                          color: Colors.purple,
                          borderRadius: BorderRadius.circular(100),
                        ),
                        child: const Center(
                          child: Text(
                            'Бичих',
                            style: TextStyle(color: Colors.white),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: Footer(),
    );
  }
}

class OverlayMessage {
  static void show(BuildContext context, String message) {
    OverlayEntry overlayEntry;
    overlayEntry = OverlayEntry(
      builder: (context) => Positioned(
        top: MediaQuery.of(context).size.height * 0.5,
        width: MediaQuery.of(context).size.width,
        child: Material(
          color: Colors.transparent,
          child: Container(
            alignment: Alignment.center,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color:
                  Colors.blue.withOpacity(0.8), // Semi-transparent blue color
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              message,
              style: const TextStyle(
                  color: Colors.white), // Change to white for better contrast
            ),
          ),
        ),
      ),
    );

    Overlay.of(context).insert(overlayEntry);

    Future.delayed(const Duration(seconds: 2), () {
      overlayEntry.remove();
    });
  }
}
