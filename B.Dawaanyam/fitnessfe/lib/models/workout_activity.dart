class WorkoutActivity {
  final String name;
  final String sets;
  final String imagePath;
  final String videoPath;
  bool isCompleted;

  WorkoutActivity({
    required this.name,
    required this.sets,
    required this.imagePath,
    required this.videoPath,
    this.isCompleted = false,
  });
}
