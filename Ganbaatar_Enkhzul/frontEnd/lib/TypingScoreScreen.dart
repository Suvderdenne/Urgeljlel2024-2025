import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'services/challenge_service.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: TypingScoreScreen(),
    );
  }
}

class TypingScoreScreen extends StatefulWidget {
  @override
  _TypingScoreScreenState createState() => _TypingScoreScreenState();
}

class _TypingScoreScreenState extends State<TypingScoreScreen> {
  final ChallengeService _challengeService = ChallengeService(); 
  bool _isLoading = true; 
  Map<String, dynamic>? _lastAttempt; 
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchLastAttempt(); 
  }
//suuliin soril tth
  Future<void> _fetchLastAttempt() async {
    try {
      final attempts = await _challengeService.getUserChallengeHistory();
      setState(() {
        _lastAttempt = attempts.isNotEmpty ? attempts.first : null;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }
  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }
    if (_error != null) {
      return Scaffold(
        body: Center(child: Text('Error: $_error')),
      );
    }
    if (_lastAttempt == null) {
      return Scaffold(
        body: Center(child: Text('No attempts found')),
      );
    }

    return Scaffold(
      body: Stack(
        children: [
          _background(),
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Colors.white, Colors.purple.shade50],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(25),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.purpleAccent.withOpacity(0.3),
                        spreadRadius: 4,
                        blurRadius: 10,
                        offset: Offset(0, 5),
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.star, color: Colors.amber, size: 24),
                      SizedBox(width: 8),
                      Text(
                        _lastAttempt!['challenge_difficulty'] ?? "MEDIUM",
                        style: GoogleFonts.pacifico(
                          fontWeight: FontWeight.bold,
                          fontSize: 20,
                          color: Colors.deepPurple,
                        ),
                      ),
                    ],
                  ),
                ),
                SizedBox(height: 20),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Colors.pinkAccent, Colors.purpleAccent],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(18),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.purple.withOpacity(0.3),
                        offset: Offset(0, 5),
                        blurRadius: 12,
                      ),
                    ],
                  ),
                  child: Text(
                    "${_lastAttempt!['correct_word_count']} WPM",
                    style: GoogleFonts.poppins(
                      fontSize: 48,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      shadows: [
                        Shadow(
                          color: Colors.black26,
                          offset: Offset(2, 2),
                          blurRadius: 10,
                        ),
                      ],
                    ),
                  ),
                ),
                SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.refresh,
                        color: Colors.deepPurpleAccent, size: 24),
                    SizedBox(width: 16),
                    Icon(Icons.emoji_events, color: Colors.amber, size: 24),
                  ],
                ),
                SizedBox(height: 20),
                ScoreCard(
                    "Correct Keystrokes",
                    "${(_lastAttempt!['correct_word_count'] * 5).round()}",
                    Colors.deepPurple),
                ScoreCard(
                    "Correct Words",
                    "${_lastAttempt!['correct_word_count']}",
                    Colors.pinkAccent),
                ScoreCard( 
                    "Accuracy",
                    "${_calculateAccuracy(_lastAttempt!).round()}%",
                    Colors.purpleAccent),
              ],
            ),
          ),
        ],
      ),
    );
  }
//accuracy = (зөв / нийт) × 100
  double _calculateAccuracy(Map<String, dynamic> attempt) {
    final correct = attempt['correct_word_count'] as int;
    final wrong = attempt['wrong_word_count'] as int;
    final total = correct + wrong;
    if (total == 0) return 0;
    return ((correct / total) * 100).roundToDouble();
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
        ...List.generate(8, (index) => _staticBubble(index)),
      ],
    );
  }

  Widget _staticBubble(int index) {
    final random = Random(index);
    double size = random.nextDouble() * 80 + 40;
    double top = random.nextDouble() * 500;
    double left = random.nextDouble() * 350;
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
              blurRadius: 8,
              spreadRadius: 4,
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
}
//  onoo hrulj bga hsgig
class ScoreCard extends StatelessWidget {
  final String title;
  final String value;
  final Color color;

  ScoreCard(this.title, this.value, this.color);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10.0, horizontal: 20),
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [color.withOpacity(0.35), color.withOpacity(0.15)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: color.withOpacity(0.4),
              blurRadius: 14,
              spreadRadius: 3,
              offset: Offset(0, 6),
            ),
          ],
        ),
        padding: EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Icon(Icons.check_circle_rounded,
                    color: color.withOpacity(0.9), size: 28),
                SizedBox(width: 12),
                Text(
                  title,
                  style: GoogleFonts.poppins(
                    fontSize: 18,
                    fontWeight: FontWeight.w600, 
                    color: Colors.deepPurple.shade800,
                  ),
                ),
              ],
            ),
            Container(
              padding: EdgeInsets.symmetric(horizontal: 18, vertical: 12),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [color.withOpacity(0.95), color],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: color.withOpacity(0.5),
                    blurRadius: 10,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              child: Text(
                value,
                style: GoogleFonts.poppins(
                  fontSize: 18,
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  shadows: [
                    Shadow(
                      blurRadius: 6,
                      color: Colors.black26,
                      offset: Offset(1, 2),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
