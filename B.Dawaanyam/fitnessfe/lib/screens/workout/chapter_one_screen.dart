import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../models/workout_activity.dart';
import 'exercise_video_screen.dart';

class ChapterOneScreen extends StatefulWidget {
  const ChapterOneScreen({super.key});

  @override
  State<ChapterOneScreen> createState() => _ChapterOneScreenState();
}

class _ChapterOneScreenState extends State<ChapterOneScreen> {
  final List<WorkoutActivity> activities = [
    WorkoutActivity(
      name: 'Squat',
      sets: '5 sets',
      imagePath: 'squats.png',
      videoPath: 'squat-video.mp4',
    ),
    WorkoutActivity(
      name: 'Bicep curl',
      sets: '3 sets',
      imagePath: 'bicep-curl.png',
      videoPath: 'bicep curl.mp4',
    ),
    WorkoutActivity(
      name: 'Running',
      sets: '10 min',
      imagePath: 'run.png',
      videoPath: 'running.mp4',
    ),
    WorkoutActivity(
      name: 'Sumo squat',
      sets: '5 sets',
      imagePath: 'gym.png',
      videoPath: 'sumo squat.mp4',
    ),
    WorkoutActivity(
      name: 'Chest fly',
      sets: '3 sets',
      imagePath: 'house.png',
      videoPath: 'chest fly.mp4',
    ),
    WorkoutActivity(
      name: 'Jumping jacks',
      sets: '5 sets',
      imagePath: 'jumping-jack.png',
      videoPath: 'jumping jacks.mp4',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(
          'Beginner Workout',
          style: GoogleFonts.poppins(
            fontSize: 24,
            fontWeight: FontWeight.w600,
            color: Colors.black,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.add, color: Color(0xFF40C4FF)),
            onPressed: () {
              // TODO: Implement add activity
            },
          ),
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: activities.length,
        itemBuilder: (context, index) {
          final activity = activities[index];
          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withOpacity(0.1),
                  spreadRadius: 0,
                  blurRadius: 6,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: ListTile(
              contentPadding: const EdgeInsets.all(12),
              leading: ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.asset(
                  activity.imagePath,
                  width: 60,
                  height: 60,
                  fit: BoxFit.cover,
                ),
              ),
              title: Text(
                activity.name,
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: Colors.black,
                ),
              ),
              subtitle: Text(
                activity.sets,
                style: GoogleFonts.poppins(
                  fontSize: 14,
                  color: Colors.grey[600],
                ),
              ),
              trailing: SizedBox(
                width: 24,
                height: 24,
                child: Checkbox(
                  value: activity.isCompleted,
                  onChanged: (bool? value) {
                    setState(() {
                      activity.isCompleted = value ?? false;
                    });
                  },
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(4),
                  ),
                  activeColor: const Color(0xFF40C4FF),
                ),
              ),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => ExerciseVideoScreen(
                      title: activity.name,
                      videoPath: activity.videoPath,
                      sets: activity.sets,
                    ),
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}
