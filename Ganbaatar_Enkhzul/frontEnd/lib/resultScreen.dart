import 'package:diplooajil/SpeedTypingScreen.dart';
import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';
import 'dart:math';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'include.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        textTheme: GoogleFonts.poppinsTextTheme(Theme.of(context).textTheme),
      ),
      home: ResultScreen(),
    );
  }
}

class ResultScreen extends StatefulWidget {
  @override
  _ResultScreenState createState() => _ResultScreenState();
}

class _ResultScreenState extends State<ResultScreen> {
  String _selectedLanguage = "en";    
  String _selectedGameMode = "Easy"; 
  List<int> _availableMinutes = [];
  int? _selectedMinute;
  List<bool> _isSelectedGameMode = [true, false, false];
  List<dynamic> languageSummary = [];  

  @override
  void initState() {
    super.initState();
    fetchLanguageSummary(); 
  }
// helnii medeellig tatah api
  Future<void> fetchLanguageSummary() async {
    try {
      final response =
          await http.get(Uri.parse('${baseurl}text/languages-summary/'));

      if (response.statusCode == 200) {
        setState(() {
          languageSummary = json.decode(response.body);
        });
      } else {
        print('Failed to load language summary: ${response.statusCode}');
      }
    } catch (e) {
      print('Error fetching language summary: $e');
    }
  }
// Сонгогдсон хэлний минутуудыг шинэчлэх
  void _updateAvailableMinutes() {
    if (languageSummary.isEmpty) return;

    var selectedLangData = languageSummary.firstWhere(
      (lang) => lang['lang_code'] == _selectedLanguage,
      orElse: () => null,
    );

    if (selectedLangData != null) {
      var minutes = selectedLangData['minutes'][_selectedGameMode] ?? [];
      setState(() {
        _availableMinutes = List<int>.from(minutes);
        if (!_availableMinutes.contains(_selectedMinute)) {
          _selectedMinute =
              _availableMinutes.isNotEmpty ? _availableMinutes[0] : null;
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        automaticallyImplyLeading: false,
        title: Center(
          child: Lottie.asset(
            'assets/lottie/2.json',
            width: 200,
            height: 400,
          ),
        ),
      ),
      body: GestureDetector(
        onTap: () => FocusScope.of(context).unfocus(),
        child: Stack(
          children: [
            _background(),
            SafeArea(
              child: SingleChildScrollView(
                keyboardDismissBehavior:
                    ScrollViewKeyboardDismissBehavior.onDrag,
                child: Padding(
                  padding: EdgeInsets.only(
                    left: 16.0,
                    right: 16.0,
                    top: 16.0,
                    bottom: MediaQuery.of(context).viewInsets.bottom + 16.0,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      const SizedBox(height: 20),
                      Text(
                        'Speed Typing! 🎉',
                        style: GoogleFonts.pacifico(
                          fontSize: 30,
                          fontWeight: FontWeight.bold,
                          color: Colors.deepPurple,
                          shadows: [
                            Shadow(color: Colors.purpleAccent, blurRadius: 10),
                          ],
                        ),
                      ),
                      const SizedBox(height: 40),
                      Text(
                        'Next Game Mode',
                        style: GoogleFonts.merriweather(
                          fontWeight: FontWeight.bold,
                          fontSize: 22,
                          color: Colors.deepPurple,
                          shadows: [
                            Shadow(color: Colors.purpleAccent, blurRadius: 10),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                      _gameModeSelection(),
                      const SizedBox(height: 40),
                      _glassmorphicCard(languageSummary),
                      const SizedBox(height: 40),
                      _actionButtons(),
                      const SizedBox(height: 20),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
      resizeToAvoidBottomInset: true,
    );
  }

  Widget _background() {
    return Stack(
      children: [
        Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFFF3E5F5), Colors.white],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
        ),
        ...List.generate(10, (index) => _staticBubble(index)),
      ],
    );
  }

  Widget _staticBubble(int index) {
    final random = Random(index);
    double size = random.nextDouble() * 100 + 50;
    double top = random.nextDouble() * 600;
    double left = random.nextDouble() * 400;
    return Positioned(
      top: top,
      left: left,
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: Colors.purpleAccent.withOpacity(0.1),
              blurRadius: 10,
              spreadRadius: 5,
            ),
          ],
          gradient: RadialGradient(
            colors: [Colors.white.withOpacity(0.4), Colors.transparent],
            center: Alignment.center,
            radius: 1.0,
          ),
        ),
      ),
    );
  }

  Widget _glassmorphicCard(List<dynamic> languageSummary) {
    return Container(
      padding: EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.6),
        borderRadius: BorderRadius.circular(25),
        border: Border.all(color: Colors.purpleAccent.withOpacity(0.4)),
      ),
      child: Column(
        children: [
          ListTile(
            title: Text(
              "Хэл",
              style:
                  GoogleFonts.pacifico(fontSize: 22, color: Colors.deepPurple),
            ),
            trailing: DropdownButton<String>(
              value: _selectedLanguage,
              dropdownColor: Colors.white,
              style: TextStyle(color: Colors.deepPurple),
              items: languageSummary.map<DropdownMenuItem<String>>((lang) {
                return DropdownMenuItem<String>(
                  value: lang['lang_code'],
                  child: Text("${lang['lang_name']} (${lang['lang_code']})"),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  _selectedLanguage = value!;
                  _updateAvailableMinutes();
                });
              },
            ),
          ),
          ListTile(
            title: Text(
              "Сонгогдсон минут",
              style:
                  GoogleFonts.pacifico(fontSize: 22, color: Colors.deepPurple),
            ),
            trailing: DropdownButton<int>(
              value: _selectedMinute,
              dropdownColor: Colors.white,
              style: TextStyle(color: Colors.deepPurple),
              items: _availableMinutes.map((int minutes) {
                return DropdownMenuItem(
                  value: minutes,
                  child: Text("$minutes min"),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  _selectedMinute = value;
                });
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _gameModeSelection() {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.purple.shade100, Colors.purple.shade50],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(32),
      ),
      child: ToggleButtons(
        borderRadius: BorderRadius.circular(32),
        isSelected: _isSelectedGameMode,
        selectedColor: Colors.white,
        fillColor: Colors.purpleAccent,
        color: Colors.purple.shade800,
        renderBorder: false,
        children: [
          _gameModeButton('Easy'),
          _gameModeButton('Medium'),
          _gameModeButton('Hard'),
        ],
        onPressed: (int index) {
          setState(() {
            for (int i = 0; i < _isSelectedGameMode.length; i++) {
              _isSelectedGameMode[i] = i == index;
            }
            _selectedGameMode = ['Easy', 'Medium', 'Hard'][index];
            _updateAvailableMinutes();
          });
        },
      ),
    );
  }

  Widget _gameModeButton(String text) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      child: Text(
        text,
        style: GoogleFonts.pacifico(
          fontSize: 24,
          fontWeight: FontWeight.bold,
          color: Colors.deepPurple,
        ),
      ),
    );
  }

  Widget _actionButtons() {
    return Column(
      children: [
        ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.purpleAccent.shade100,
            minimumSize: Size(double.infinity, 60),
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
          onPressed: () {
            if (_selectedMinute != null) {
              Navigator.of(context).push(
                PageRouteBuilder(
                  pageBuilder: (context, animation, secondaryAnimation) =>
                      SpeedTypingScreen(
                    langCode: _selectedLanguage,
                    level: _selectedGameMode,
                    minutes: _selectedMinute!,
                  ),
                  transitionsBuilder:
                      (context, animation, secondaryAnimation, child) {
                    return FadeTransition(
                      opacity: animation,
                      child: child,
                    );
                  },
                  transitionDuration: Duration(milliseconds: 300),
                ),
              );
            } else {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Please select available minutes for the game'),
                  backgroundColor: Colors.pinkAccent.shade200,
                ),
              );
            }
          },
          child: Text(
            'Start Challenge',
            style: GoogleFonts.poppins(
              color: Colors.deepPurple,
              fontWeight: FontWeight.bold,
              fontSize: 18,
            ),
          ),
        )
      ],
    );
  }
}
