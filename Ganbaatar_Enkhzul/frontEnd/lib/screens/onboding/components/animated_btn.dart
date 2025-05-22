import 'package:diplooajil/CourseDetailsPage.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:rive/rive.dart';

class AnimatedBtn extends StatelessWidget {
  const AnimatedBtn({
    super.key,
    required RiveAnimationController btnAnimationController,
    required this.press,
  }) : _btnAnimationController = btnAnimationController;

  final RiveAnimationController _btnAnimationController;
  final VoidCallback press;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        press();
        // Navigate to CourseDetailsPage when tapped
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const CourseDetailsPage()), // Navigate to the new page
        );
      },
      child: SizedBox(
        height: 64,
        width: 236,
        child: Stack(
          children: [
            RiveAnimation.asset(
              "assets/RiveAssets/button.riv",
              controllers: [_btnAnimationController],
            ),
            Positioned.fill(
              top: 8,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // Arrow icon pointing right (horizontal)
                  AnimatedContainer(
                    duration: Duration(milliseconds: 300),
                    curve: Curves.easeInOut,
                    transform: Matrix4.rotationZ(0), // Set this to 0 for horizontal (no rotation)
                    child: Icon(
                      CupertinoIcons.arrow_right,
                      size: 24, // Adjust size
                      color: Colors.redAccent, // Set the color
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    "Start the course",
                    style: GoogleFonts.pacifico().copyWith(
                      fontSize: 18, // Increase the font size
                      fontWeight: FontWeight.bold, // Make it bold
                      color: Colors.redAccent, // Set text color to pink
                      letterSpacing: 1.2, // Add some space between letters
                      shadows: [
                        Shadow(
                          offset: Offset(2, 2),
                          blurRadius: 4,
                          color: Colors.black.withOpacity(0.5),
                        ),
                      ], // Add shadow for depth
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class CoursePage extends StatelessWidget {
  const CoursePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Course Page')),
      body: const Center(
        child: Text('Welcome to the Course!'),
      ),
    );
  }
}