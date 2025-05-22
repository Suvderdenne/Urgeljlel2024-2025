import 'package:flutter/material.dart';
import 'package:app/timelapse.dart';
import 'package:lottie/lottie.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const Start(),
    );
  }
}

class Start extends StatefulWidget {
  const Start({super.key});

  @override
  State<Start> createState() => _StartState();
}

class _StartState extends State<Start> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Background image
          Positioned.fill(
            child: Image.asset(
              '../assets/start/back.png',
              fit: BoxFit.fill,
            ),
          ),
          Positioned(
            left: 20,
            bottom: 100,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(20.0), // Radius value
              child: Lottie.asset(
                '../assets/start/neg.json',
                width: 100,
              ),
            ),
          ),
          Positioned(
            top: 200,
            left: 200,
            child: LevelWidget(level: 5, stars: 0, isLocked: true),
          ),
          Positioned(
            top: 300,
            left: 150,
            child: LevelWidget(level: 4, stars: 0, isLocked: true),
          ),
          Positioned(
            top: 380,
            left: 220,
            child: LevelWidget(level: 3, stars: 0, isLocked: true),
          ),
          Positioned(
            top: 450,
            left: 120,
            child: LevelWidget(level: 2, stars: 0, isLocked: true),
          ),
          Positioned(
            top: 550,
            left: 180,
             child: InkWell(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => Duolingo()), 
                  );},
                  child: LevelWidget(level: 1, stars: 3, isLocked: false),
                  ),
            ),
        ],
      ),
    );
  }
}

class LevelWidget extends StatelessWidget {
  final int level;
  final int stars;
  final bool isLocked;

  const LevelWidget({
    required this.level,
    required this.stars,
    required this.isLocked,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: isLocked ? null : () => print("Level $level tapped"),
      child: Column(
        children: [
          Stack(
            alignment: Alignment.center,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(30.0),
                child:  
                Image.asset(
                '../assets/start/number1.png',
                width: 50,
                height: 50,
              ),
              ),
              if (!isLocked)
                Text(
                  level.toString(),
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.black
                  ),
                ),
              if (isLocked)
                const Icon(
                  Icons.lock,
                  size: 30,
                  color: Color.fromARGB(255, 14, 13, 13),
                ),
            ],
          ),
          if (!isLocked)
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                stars,
                (index) => const Icon(
                  Icons.star,
                  size: 18,
                  color: Color.fromARGB(255, 243, 220, 9),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
