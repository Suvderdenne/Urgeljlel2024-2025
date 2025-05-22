import 'package:flutter/material.dart';
import 'dart:async';
import 'package:syncfusion_flutter_gauges/gauges.dart';
import 'package:google_fonts/google_fonts.dart';
import 'services/challenge_service.dart';

class SpeedTypingScreen extends StatefulWidget {
  final String langCode; 
  final String level; 
  final int minutes;  

  const SpeedTypingScreen({
    Key? key,
    required this.langCode,
    required this.level,
    required this.minutes,
  }) : super(key: key);

  @override
  _SpeedTypingScreenState createState() => _SpeedTypingScreenState();
}

class _SpeedTypingScreenState extends State<SpeedTypingScreen> {
  final TextEditingController _textController = TextEditingController();
  final ChallengeService _challengeService = ChallengeService();  // API service
  Timer? _timer;
  int _timeLeft = 0;
  String _challengeText = '';
  String _challengeId = '';
  bool _isTimerRunning = false;
  bool _isLoading = true;
  bool _isTypingEnabled = true;
  List<String> sampleWords = [];
  List<bool> correctness = [];
  String currentWord = '';
  int currentIndex = 0;
  int wpm = 0; 
  double errors = 0.0;
  double accuracy = 0.0;
  final TextEditingController _controller = TextEditingController();

  double get _progress => 1 - (_timeLeft / (widget.minutes * 60));

  @override
  void initState() {
    super.initState();
    _timeLeft = widget.minutes * 60; 
    _fetchChallenge();  
  }

  @override
  void dispose() {
    _timer?.cancel();
    _textController.dispose(); 
    super.dispose();
  }
// Сорилыг серверээс татах
  Future<void> _fetchChallenge() async {
    try {
      final challenge = await _challengeService.getChallenge(
          widget.langCode, widget.level, widget.minutes);
      setState(() {
        _challengeText = challenge['content'];
        _challengeId = challenge['challenge_id'].toString();
        // Split by whitespace and filter out empty strings
        sampleWords = _challengeText
            .split(RegExp(r'\s+'))
            .where((word) => word.isNotEmpty)
            .toList();
        correctness = List.filled(sampleWords.length, false);
        _isLoading = false;
      });
    } catch (e) {
      print('Error fetching challenge: $e');
    }
  }
// Timer ajilluulah
  void _startTimer() {
    if (!_isTimerRunning) {
      setState(() {
        _isTimerRunning = true;
      });

      _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
        setState(() {
          if (_timeLeft > 0) {
            _timeLeft--;
          } else {
            _timer?.cancel();
            _isTimerRunning = false;
            _saveAttempt();
          }
        });
      });
    }
  }
// Сорилын үр дүн хадгалах
  Future<void> _saveAttempt() async {
    try {
      print(
          'Saving attempt with: challengeId=${_challengeId}, wpm=$wpm, errors=${errors.toInt()}, duration=${widget.minutes * 60 - _timeLeft}');

      await _challengeService.saveAttempt(
        challengeId: int.parse(_challengeId),
        correctWordCount: wpm,
        wrongWordCount: errors.toInt(),
        durationSeconds: widget.minutes * 60 - _timeLeft,
      );

      if (!mounted) return;

      // Go back to previous screen (tab 2)
      Navigator.of(context).pop();
    } catch (e) {
      print('Error saving attempt: $e');
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to save attempt: ${e.toString()}'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }
// Бичсэн үгийг шалгах
  void _handleWordTyped(String value) {
    if (value.endsWith(' ')) {
      String typedWord = value.trim(); //jijig tom useg ylgana
      if (currentIndex < sampleWords.length) {
        bool isCorrect = typedWord == sampleWords[currentIndex];  //яг ижил бичсэн эсэхийг шалгана
        if (isCorrect) {
          wpm++;  // зөв бичсэн үг тоолно
        } else {
          errors++; //buruu bicsn ugiin toolno
          print('Expected: "${sampleWords[currentIndex]}", Got: "$typedWord"');
        }
        correctness[currentIndex] = isCorrect;
      }
      currentIndex++;
      currentWord = "";
      _controller.clear();
      setState(() {
        int totalTyped = currentIndex;
        int correctWords = wpm;
        //nariivchlal accuracy = (Зөв бичсэн үг / Нийт бичсэн үг) × 100
        accuracy = totalTyped > 0
            ? ((correctWords / totalTyped) * 100).toInt().toDouble()
            : 0.0;

        // Check if all words have been typed
        if (currentIndex >= sampleWords.length) {
          _timer?.cancel();
          _isTimerRunning = false;
          _isTypingEnabled = false;
          _saveAttempt();
        }
      });
    } else {
      setState(() {
        currentWord = value;
      });
    }
  }

  String formatTime(int seconds) {
    int minutes = seconds ~/ 60;
    int remainingSeconds = seconds % 60;
    return "${minutes.toString().padLeft(2, '0')}:${remainingSeconds.toString().padLeft(2, '0')}";
  }

  Widget buildCircularGauge(
      String label, double value, String displayValue, Color color) {  // ← 🟡 энэ өнгө параметрээр ирдэг
    return Column(
      children: [
        SizedBox(
          width: 100,
          height: 80,
          child: SfRadialGauge(
            axes: [
              RadialAxis(
                minimum: 0,
                maximum: 100,
                ranges: [
                  GaugeRange(startValue: 0, endValue: 50, color: Colors.red),
                  GaugeRange(
                      startValue: 50, endValue: 80, color: Colors.yellow),
                  GaugeRange(
                      startValue: 80, endValue: 100, color: Colors.green),
                ],
                pointers: [NeedlePointer(value: value)],
                annotations: [
                  GaugeAnnotation(
                    widget: Text(
                      displayValue,
                      style: GoogleFonts.pacifico(  
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: color,
                      ),
                    ),
                    angle: 90,
                    positionFactor: 0.7,
                  ),
                ],
              ),
            ],
          ),
        ),
        Text(
          label,
          style: GoogleFonts.pacifico(
            fontSize: 14,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
      ],
    );
  }
  Widget _buildWordView() {
  if (sampleWords.isEmpty) {
    return Center(
      child: Text(
        'No challenge text available',
        style: GoogleFonts.roboto(
          fontSize: 20,
          color: Colors.grey,
        ),
      ),
    );
  }

  List<Widget> words = [];

  for (int i = 0; i < sampleWords.length; i++) {
    Color bgColor = const Color(0xFFEFEFEF); 
    Color textColor = Colors.grey.shade700;
    FontWeight fontWeight = FontWeight.bold;  
    double fontSize = 15;

    if (i == currentIndex) {
      bgColor = const Color(0xFFCCE4F7); 
      textColor = Colors.black;
      fontWeight = FontWeight.w900;
      fontSize = 17;
    } else if (i < currentIndex) {
      bool isCorrect = correctness[i];
      bgColor = isCorrect ? Colors.green.shade200 : Colors.red.shade200;
      textColor = Colors.black;
      fontWeight = FontWeight.w600;
      fontSize = 16;
    }

    words.add(Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
      margin: const EdgeInsets.symmetric(horizontal: 3, vertical: 4),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        sampleWords[i],
        style: GoogleFonts.roboto(
          fontSize: fontSize,
          fontWeight: fontWeight,
          color: textColor,
          letterSpacing: 0.2,
        ),
      ),
    ));
  }

  return Wrap(
    alignment: WrapAlignment.start,
    spacing: 4,
    runSpacing: 6,
    children: words,
  );
}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Speed Typing Challenge',
          style: GoogleFonts.pacifico(),
        ),
      ),
      body: GestureDetector(
        onTap: () => FocusScope.of(context).unfocus(),
        child: SafeArea(
          child: SingleChildScrollView(
            keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
            child: Padding(
              padding: EdgeInsets.only(
                left: 16.0,
                right: 16.0,
                top: 16.0,
                bottom: MediaQuery.of(context).viewInsets.bottom + 16.0,
              ),
              child: Column(
                children: [
                  if (_isLoading)
                    Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const CircularProgressIndicator(),
                          const SizedBox(height: 16),
                          Text(
                            'Loading challenge...',
                            style: GoogleFonts.roboto(
                              fontSize: 16,
                              color: Colors.black87,
                            ),
                          ),
                        ],
                      ),
                    )
                  else
                    Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: [
                            buildCircularGauge("Accuracy", accuracy.toDouble(),  
                                "$accuracy%", Colors.orange),
                            buildCircularGauge(
                                "WPM", wpm.toDouble(), "$wpm", Colors.blue),
                            buildCircularGauge("Errors", errors.toDouble(),
                                "$errors", Colors.red),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Stack(
                          alignment: Alignment.center,
                          children: [
                            CircularProgressIndicator(
                              value: _progress,
                              strokeWidth: 5,
                              color: Colors.blue,
                            ),
                            Text(
                              formatTime(_timeLeft),
                              style: GoogleFonts.roboto(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Container(
                          height: 200,
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Colors.grey[100],
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: Colors.grey[300]!),
                          ),
                          child: SingleChildScrollView(
                            child: _buildWordView(),
                          ),
                        ),
                        const SizedBox(height: 20),
                        TextField(
                          controller: _controller,
                          enabled: _isTypingEnabled && !_isLoading,
                          onChanged: (value) {
                            _startTimer();
                            _handleWordTyped(value);
                          },
                          style: GoogleFonts.notoSans(
                            fontSize: 14,
                            height: 1.5,
                            fontWeight: FontWeight.w500, 
                          ),
                          decoration: InputDecoration(
                            hintText: 'Start typing here...',
                            hintStyle: GoogleFonts.roboto(
                              color: Colors.grey[400],
                              fontSize: 14,
                              
                            ),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            contentPadding: EdgeInsets.symmetric(
                                horizontal: 12, vertical: 8),
                            filled: true,
                            fillColor: Colors.white,
                          ),
                          textInputAction: TextInputAction.done,
                          onEditingComplete: () =>
                              FocusScope.of(context).unfocus(),
                        ),
                      ],
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
      resizeToAvoidBottomInset: true,
    );
  }
}
