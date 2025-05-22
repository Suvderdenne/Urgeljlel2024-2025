import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../widgets/custom_back_button.dart';
import 'dart:async';

class FastingScreen extends StatefulWidget {
  const FastingScreen({super.key});

  @override
  State<FastingScreen> createState() => _FastingScreenState();
}

class _FastingScreenState extends State<FastingScreen> {
  bool _isFasting = true;
  late Timer _timer;
  DateTime _endTime = DateTime.now().add(const Duration(hours: 16));

  final List<FastingPeriod> _fastingPeriods = [
    FastingPeriod(
      id: 1,
      startTime: "20:00",
      endTime: "12:00",
      days: "Mon - Tue",
    ),
    FastingPeriod(
      id: 2,
      startTime: "20:00",
      endTime: "12:00",
      days: "Tue - Wed",
    ),
    FastingPeriod(
      id: 3,
      startTime: "16:00",
      endTime: "12:00",
      days: "Fri - Sat",
    ),
    FastingPeriod(
      id: 4,
      startTime: "20:00",
      endTime: "12:00",
      days: "Sat - Sun",
    ),
  ];

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  void _startTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {});
    });
  }

  Duration _getRemainingTime() {
    return _endTime.difference(DateTime.now());
  }

  String _formatDuration(Duration duration) {
    String twoDigits(int n) => n.toString().padLeft(2, '0');
    String hours = twoDigits(duration.inHours);
    String minutes = twoDigits(duration.inMinutes.remainder(60));
    String seconds = twoDigits(duration.inSeconds.remainder(60));
    return "$hours:$minutes:$seconds";
  }

  @override
  Widget build(BuildContext context) {
    final remainingTime = _getRemainingTime();
    final progress =
        1 - (remainingTime.inSeconds / (16 * 3600)); // 16 hours fasting period

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const CustomBackButton(),
                  const SizedBox(height: 20),
                  Text(
                    'Now: ${_isFasting ? "Fasting" : "Eating"}',
                    style: GoogleFonts.poppins(
                      fontSize: 24,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20.0),
                  child: Column(
                    children: [
                      SizedBox(
                        height: 250,
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            SizedBox(
                              width: 250,
                              height: 250,
                              child: CircularProgressIndicator(
                                value: progress,
                                strokeWidth: 12,
                                backgroundColor: Colors.grey[200],
                                color: const Color(0xFF4CAF50),
                              ),
                            ),
                            Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  'Remaining',
                                  style: GoogleFonts.poppins(
                                    fontSize: 16,
                                    color: Colors.grey[600],
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  _formatDuration(remainingTime),
                                  style: GoogleFonts.poppins(
                                    fontSize: 32,
                                    fontWeight: FontWeight.w600,
                                    color: const Color(0xFF4CAF50),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),
                      Text(
                        'End of fasting period: ${DateFormat('E HH:mm').format(_endTime)}',
                        style: GoogleFonts.poppins(
                          fontSize: 16,
                          color: Colors.grey[600],
                        ),
                      ),
                      const SizedBox(height: 40),
                      Text(
                        'Your week plan',
                        style: GoogleFonts.poppins(
                          fontSize: 20,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 20),
                      _buildWeekPlanChart(),
                      const SizedBox(height: 20),
                      ..._fastingPeriods
                          .map((period) => _buildPeriodItem(period)),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildWeekPlanChart() {
    return Container(
      height: 200,
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey[300]!),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Expanded(
            child: Row(
              children: [
                SizedBox(
                  width: 40,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('0h',
                          style:
                              TextStyle(color: Colors.grey[600], fontSize: 12)),
                      Text('6h',
                          style:
                              TextStyle(color: Colors.grey[600], fontSize: 12)),
                      Text('12h',
                          style:
                              TextStyle(color: Colors.grey[600], fontSize: 12)),
                      Text('18h',
                          style:
                              TextStyle(color: Colors.grey[600], fontSize: 12)),
                      Text('24h',
                          style:
                              TextStyle(color: Colors.grey[600], fontSize: 12)),
                    ],
                  ),
                ),
                Expanded(
                  child: CustomPaint(
                    painter: FastingChartPainter(),
                    size: const Size(double.infinity, double.infinity),
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                Text('Mo', style: TextStyle(color: Colors.grey[600])),
                Text('Tu', style: TextStyle(color: Colors.grey[600])),
                Text('We', style: TextStyle(color: Colors.grey[600])),
                Text('Th', style: TextStyle(color: Colors.grey[600])),
                Text('Fr', style: TextStyle(color: Colors.grey[600])),
                Text('Sa', style: TextStyle(color: Colors.grey[600])),
                Text('Su', style: TextStyle(color: Colors.grey[600])),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPeriodItem(FastingPeriod period) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Text(
            'Period ${period.id}:',
            style: GoogleFonts.poppins(
              fontSize: 16,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(width: 8),
          Text(
            '${period.days} ${period.startTime} - ${period.endTime}',
            style: GoogleFonts.poppins(
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }
}

class FastingPeriod {
  final int id;
  final String startTime;
  final String endTime;
  final String days;

  FastingPeriod({
    required this.id,
    required this.startTime,
    required this.endTime,
    required this.days,
  });
}

class FastingChartPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF4CAF50)
      ..strokeWidth = 20
      ..strokeCap = StrokeCap.round;

    // Example fasting periods (you should replace these with actual data)
    _drawFastingPeriod(canvas, size, 0, 8, 16); // Monday
    _drawFastingPeriod(canvas, size, 1, 8, 16); // Tuesday
    _drawFastingPeriod(canvas, size, 2, 12, 20); // Wednesday
    _drawFastingPeriod(canvas, size, 3, 8, 16); // Thursday
    _drawFastingPeriod(canvas, size, 4, 8, 16); // Friday
    _drawFastingPeriod(canvas, size, 5, 8, 12); // Saturday
    _drawFastingPeriod(canvas, size, 6, 8, 12); // Sunday
  }

  void _drawFastingPeriod(Canvas canvas, Size size, int dayIndex,
      double startHour, double endHour) {
    final paint = Paint()
      ..color = const Color(0xFF4CAF50)
      ..strokeWidth = 20
      ..strokeCap = StrokeCap.round;

    final dayWidth = size.width / 7;
    final x = dayWidth * dayIndex + dayWidth / 2;
    final startY = (startHour / 24) * size.height;
    final endY = (endHour / 24) * size.height;

    canvas.drawLine(
      Offset(x, startY),
      Offset(x, endY),
      paint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
