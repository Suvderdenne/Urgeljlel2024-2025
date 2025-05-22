import 'package:flutter/material.dart';

import 'package:app/tests/home.dart';

void main() async {
  runApp(const MainApp());
  
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData.from(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Color.fromARGB(255, 145, 255, 142),
        ),
      ),
      home: HomePage(),
    );
  }
}