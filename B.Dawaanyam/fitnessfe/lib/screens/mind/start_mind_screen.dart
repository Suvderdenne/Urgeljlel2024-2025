import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'meditation_screen.dart';

class StartMindScreen extends StatefulWidget {
  const StartMindScreen({super.key});

  @override
  State<StartMindScreen> createState() => _StartMindScreenState();
}

class _StartMindScreenState extends State<StartMindScreen> {
  final _reasonController = TextEditingController();
  final List<GoalItem> _weeklyGoals = [
    GoalItem(title: 'Exercise at least 3 times'),
    GoalItem(title: 'Go for a run'),
    GoalItem(title: 'Eat more vegetables'),
  ];

  @override
  void dispose() {
    _reasonController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1C1C1E),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Start with\nyour mind',
                  style: GoogleFonts.poppins(
                    fontSize: 40,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    height: 1.2,
                  ),
                ),
                const SizedBox(height: 40),
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: const Color(0xFF2C2C2E),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        '"The only bad workout\nis the one that didn\'t happen."',
                        style: TextStyle(
                          fontSize: 24,
                          color: Colors.white70,
                          height: 1.4,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        '- Unknown',
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.grey[400],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 40),
                Text(
                  'What\'s your \'why\'?',
                  style: GoogleFonts.poppins(
                    fontSize: 24,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _reasonController,
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    hintText: 'Enter your reason...',
                    hintStyle: TextStyle(color: Colors.grey[600]),
                    filled: true,
                    fillColor: const Color(0xFF2C2C2E),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                    contentPadding: const EdgeInsets.all(16),
                  ),
                ),
                const SizedBox(height: 40),
                Text(
                  'My goal for this week',
                  style: GoogleFonts.poppins(
                    fontSize: 24,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 16),
                ..._weeklyGoals.map((goal) => _buildGoalItem(goal)),
                const SizedBox(height: 40),
                _buildMeditationButton(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildGoalItem(GoalItem goal) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          InkWell(
            onTap: () {
              setState(() {
                goal.isCompleted = !goal.isCompleted;
              });
            },
            child: Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: goal.isCompleted
                    ? const Color(0xFF40C4FF)
                    : Colors.transparent,
                border: Border.all(
                  color:
                      goal.isCompleted ? const Color(0xFF40C4FF) : Colors.grey,
                  width: 2,
                ),
              ),
              child: goal.isCompleted
                  ? const Icon(Icons.check, size: 16, color: Colors.black)
                  : null,
            ),
          ),
          const SizedBox(width: 16),
          Text(
            goal.title,
            style: GoogleFonts.poppins(
              fontSize: 18,
              color: Colors.white70,
              decoration: goal.isCompleted ? TextDecoration.lineThrough : null,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMeditationButton() {
    return Container(
      width: double.infinity,
      height: 60,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF40C4FF), Color(0xFF0091EA)],
          begin: Alignment.centerLeft,
          end: Alignment.centerRight,
        ),
        borderRadius: BorderRadius.circular(30),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const MeditationScreen(),
              ),
            );
          },
          borderRadius: BorderRadius.circular(30),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.spa, color: Colors.white),
              const SizedBox(width: 12),
              Text(
                'Start a meditation',
                style: GoogleFonts.poppins(
                  fontSize: 18,
                  fontWeight: FontWeight.w500,
                  color: Colors.white,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class GoalItem {
  final String title;
  bool isCompleted;

  GoalItem({
    required this.title,
    this.isCompleted = false,
  });
}
