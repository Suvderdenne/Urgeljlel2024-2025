import 'dart:ui';
import 'package:diplooajil/AuthScreen.dart';  // Make sure AuthScreen is imported
import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';
import 'package:introduction_screen/introduction_screen.dart';
import 'package:google_fonts/google_fonts.dart';

class CourseDetailsPage extends StatefulWidget {
  const CourseDetailsPage({super.key});

  @override
  State<CourseDetailsPage> createState() => _CourseDetailsPageState();
}

class _CourseDetailsPageState extends State<CourseDetailsPage> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _rotationAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 10),
      vsync: this,
    )..repeat();

    _rotationAnimation = Tween<double>(begin: 0, end: 2 * 3.14159).animate(_controller);
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned.fill(
          child: Image.asset(
            "assets/Backgrounds/Spline.png",
            fit: BoxFit.cover,
          ),
        ),
        Positioned.fill(
          child: AnimatedBuilder(
            animation: _controller,
            builder: (context, child) {
              return Transform.rotate(
                angle: _rotationAnimation.value,
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                  child: Container(color: Colors.black.withOpacity(0.4)),
                ),
              );
            },
          ),
        ),
        IntroductionScreen(
          globalBackgroundColor: Colors.transparent,
          pages: [
            PageViewModel(
              titleWidget: Text(
                "🔥Speed Typer",
                style: GoogleFonts.pacifico(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                  shadows: [Shadow(color: Colors.redAccent, blurRadius: 10)],
                ),
              ),
              bodyWidget: Text(
                "Speed Typer - Та шивэлтийн жинхэнэ мастер болоход бэлэн үү? 🏆",
                textAlign: TextAlign.center,
                style: GoogleFonts.roboto(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              image: Center(
                child: Lottie.asset("assets/lottie/speed.json", height: 250),
              ),
              decoration: getPageDecoration(),
            ),
            PageViewModel(
              titleWidget: Text(
                "✨ ЯАГААД Speed Typer?",
                style: GoogleFonts.pacifico(
                  fontSize: 26,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                  shadows: [Shadow(color: Colors.purpleAccent, blurRadius: 10)],
                ),
              ),
              bodyWidget: Text(
                "Speed Typer бол Монгол болон Англи хэл дээрх шивэлтийн хурд, нарийвчлалаа шалгах, сайжруулах, өөрийгөө сорих хамгийн хөгжилтэй бөгөөд үр дүнтэй апп!",
                textAlign: TextAlign.center,
                style: GoogleFonts.roboto(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              image: Center(
                child: Lottie.asset("assets/lottie/loading.json", height: 500),
              ),
              decoration: getPageDecoration(),
            ),
            PageViewModel(
              titleWidget: Text(
                "🚀 Let's start now!",
                style: GoogleFonts.pacifico(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                  shadows: [Shadow(color: Colors.orangeAccent, blurRadius: 10)],
                ),
              ),
              bodyWidget: Text(
                "⏳ Цаг бол алт! Илүү хурдан, илүү оновчтой шивж сураад, өөрийгөө хөгжүүл!📝 Бичих чадвараа дараагийн түвшинд гаргая!",
                textAlign: TextAlign.center,
                style: GoogleFonts.roboto(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              image: Center(
                child: Lottie.asset("assets/lottie/typingg.json", height: 350),
              ),
              decoration: getPageDecoration(),
            ),
          ],
          onDone: () {
            Navigator.of(context).pushReplacement(
              MaterialPageRoute(builder: (_) => AuthScreen()),
            );
          },
          onSkip: () {
            Navigator.of(context).pushReplacement(
              MaterialPageRoute(builder: (_) => AuthScreen()),
            );
          },
          showSkipButton: true,
          skip: Text(
            "Алгасах",
            style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          next: const Icon(Icons.arrow_forward, color: Colors.blue),
          done: Text(
            "Дуусгах",
            style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          dotsDecorator: DotsDecorator(
            size: const Size(10, 10),
            color: Colors.white54,
            activeSize: const Size(22, 10),
            activeColor: Colors.purple,
            spacing: const EdgeInsets.symmetric(horizontal: 5),
          ),
        ),
      ],
    );
  }

  PageDecoration getPageDecoration() {
    return PageDecoration(
      titleTextStyle: GoogleFonts.poppins(
        fontSize: 26,
        fontWeight: FontWeight.bold,
        color: Colors.white,
      ),
      bodyTextStyle: GoogleFonts.roboto(
        fontSize: 18,
        fontWeight: FontWeight.w500,
        color: Colors.white70,
      ),
      imagePadding: EdgeInsets.all(20),
      pageColor: Colors.transparent,
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Нүүр", style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.bold))),
      body: Center(
        child: Text(
          "Тавтай морил!",
          style: GoogleFonts.roboto(fontSize: 18, fontWeight: FontWeight.w500),
        ),
      ),
    );
  }
}
