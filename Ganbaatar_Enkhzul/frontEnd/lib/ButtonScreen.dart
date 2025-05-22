import 'package:diplooajil/TypingScoreScreen.dart';
import 'package:diplooajil/UserHistoryScreen.dart';
import 'package:diplooajil/resultScreen.dart';
import 'package:flutter/material.dart';
import 'package:curved_navigation_bar/curved_navigation_bar.dart';

class ButtonScreen extends StatefulWidget {
  @override
  _ButtonScreenState createState() => _ButtonScreenState();
}

class _ButtonScreenState extends State<ButtonScreen> {
  int _selectedIndex = 0; // Default to ResultScreen

  final List<Widget> _screens = [
    ResultScreen(),
    TypingScoreScreen(),
    UserHistoryScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_selectedIndex],
      bottomNavigationBar: CurvedNavigationBar(
        index: _selectedIndex,
        onTap: (index) {
          setState(() {
            _selectedIndex = index;
          });
        },
        height: 60,
        items: <Widget>[
          Icon(Icons.sports_esports, size: 30),
          Icon(Icons.emoji_events, size: 30),
          Icon(Icons.person, size: 30),
        ],
        color: Colors.purple,
        backgroundColor: Colors.white,
        buttonBackgroundColor: Colors.white,
        animationCurve: Curves.easeInOut,
      ),
    );
  }
}
