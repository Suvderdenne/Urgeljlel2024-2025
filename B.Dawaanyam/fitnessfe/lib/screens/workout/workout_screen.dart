import 'package:flutter/material.dart';
import 'chapter_one_screen.dart';
import '../../widgets/custom_back_button.dart';

class WorkoutScreen extends StatelessWidget {
  const WorkoutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const CustomBackButton(),
                  const SizedBox(height: 20),
                  Text(
                    'Workout Recommendations',
                    style: Theme.of(context).textTheme.headlineLarge,
                  ),
                ],
              ),
            ),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(16.0),
                children: [
                  InkWell(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const ChapterOneScreen(),
                        ),
                      );
                    },
                    child: _buildWorkoutCard(
                      'Beginner Full Body Workout',
                      'A great starting point for beginners',
                      [
                        'Warm-up: 5-10 minutes of light cardio',
                        'Bodyweight squats: 3 sets of 10-12 reps',
                        'Push-ups: 3 sets of 8-10 reps',
                        'Plank: 3 sets of 30 seconds',
                        'Lunges: 3 sets of 10 reps per leg',
                      ],
                      'easy',
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildWorkoutCard(
                    'Intermediate Strength Training',
                    'Build muscle and increase strength',
                    [
                      'Warm-up: 5-10 minutes of dynamic stretching',
                      'Barbell squats: 4 sets of 8-10 reps',
                      'Bench press: 4 sets of 8-10 reps',
                      'Deadlifts: 3 sets of 6-8 reps',
                      'Pull-ups: 3 sets of 8-10 reps',
                    ],
                    'medium',
                  ),
                  const SizedBox(height: 16),
                  _buildWorkoutCard(
                    'Advanced HIIT Workout',
                    'High-intensity interval training for fat loss',
                    [
                      'Warm-up: 5 minutes of dynamic stretching',
                      'Burpees: 4 sets of 15 reps',
                      'Mountain climbers: 4 sets of 30 seconds',
                      'Jump squats: 4 sets of 15 reps',
                      'High knees: 4 sets of 30 seconds',
                    ],
                    'hard',
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildWorkoutCard(
    String title,
    String description,
    List<String> exercises,
    String difficulty,
  ) {
    Color difficultyColor;
    switch (difficulty) {
      case 'easy':
        difficultyColor = Colors.green;
        break;
      case 'medium':
        difficultyColor = Colors.orange;
        break;
      case 'hard':
        difficultyColor = Colors.red;
        break;
      default:
        difficultyColor = Colors.grey;
    }

    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: difficultyColor.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    difficulty.toUpperCase(),
                    style: TextStyle(
                      color: difficultyColor,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              description,
              style: const TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 16),
            const Text(
              'Exercises:',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 8),
            ...exercises.map((exercise) => Padding(
                  padding: const EdgeInsets.only(left: 8.0, bottom: 4.0),
                  child: Row(
                    children: [
                      const Icon(Icons.fiber_manual_record, size: 8),
                      const SizedBox(width: 8),
                      Expanded(child: Text(exercise)),
                    ],
                  ),
                )),
          ],
        ),
      ),
    );
  }
}
