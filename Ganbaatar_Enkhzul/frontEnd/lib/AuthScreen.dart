import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';
import 'package:diplooajil/ButtonScreen.dart';
import './services/auth_service.dart';

void main() {
  runApp(const TypingMasterApp());
}

class TypingMasterApp extends StatelessWidget {
  const TypingMasterApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: const AuthScreen(),
    );
  }
}

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  bool isLogin = true;
  final usernameController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  bool isLoading = false;

  void toggleScreen() {
    setState(() {
      isLogin = !isLogin;
    });
  }

  // Register or Login function
  Future<void> handleAuthAction() async {
    setState(() {
      isLoading = true;
    });

    try {
      if (isLogin) {
        await AuthService.login(
          emailController.text,
          passwordController.text,
        );

        // Navigate to main screen after successful login
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => ButtonScreen()),
        );
      } else {
        await AuthService.register(
          usernameController.text,
          emailController.text,
          passwordController.text,
        );

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text('Амжилттай бүртгэгдлээ! Та одоо нэвтэрч болно.')),
        );
        setState(() {
          isLogin = true;
        });
      }
    } catch (e) {
      String errorMessage;
      if (e.toString().contains('SocketException') ||
          e.toString().contains('Connection refused')) {
        errorMessage =
            'Сервертэй холбогдож чадсангүй. Та дараах зүйлсийг шалгана уу:\n'
            '1. Сервер ажиллаж байгаа эсэх\n'
            '2. Серверийн хаяг зөв эсэх\n'
            '3. Интернэт холболт байгаа эсэх';
      } else {
        errorMessage = 'Алдаа гарлаа: ${e.toString()}';
      }
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(errorMessage),
          duration: Duration(seconds: 5),
        ),
      );
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          Positioned(
              top: 0,
              left: 0,
              child: Image.asset('assets/images/main_top.png', width: 150)),
          Positioned(
              bottom: 0,
              left: 0,
              child: Image.asset('assets/images/main_top.png', width: 150)),
          Positioned(
              bottom: 0,
              right: 0,
              child: Image.asset('assets/images/login_bottom.png', width: 150)),
          Center(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    SizedBox(
                      height: 200,
                      width: 200,
                      child: Lottie.asset(
                        isLogin
                            ? 'assets/lottie/login.json'
                            : 'assets/lottie/speed.json',
                      ),
                    ),
                    const SizedBox(height: 20),
                    if (!isLogin) ...[
                      // Sign Up fields
                      TextField(
                        controller: usernameController,
                        decoration: InputDecoration(
                          prefixIcon: const Icon(Icons.person),
                          hintText: "Нэр",
                          filled: true,
                          fillColor: Colors.purple.shade50,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(30),
                            borderSide: BorderSide.none,
                          ),
                        ),
                      ),
                      const SizedBox(height: 15),
                    ],
                    TextField(
                      controller: emailController,
                      decoration: InputDecoration(
                        prefixIcon: const Icon(Icons.email),
                        hintText: "Имэйл хаяг",
                        filled: true,
                        fillColor: Colors.purple.shade50,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(30),
                          borderSide: BorderSide.none,
                        ),
                      ),
                    ),
                    const SizedBox(height: 15),
                    TextField(
                      controller: passwordController,
                      obscureText: true,
                      decoration: InputDecoration(
                        prefixIcon: const Icon(Icons.lock),
                        hintText: "Нууц үг",
                        filled: true,
                        fillColor: Colors.purple.shade50,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(30),
                          borderSide: BorderSide.none,
                        ),
                      ),
                    ),
                    const SizedBox(height: 15),
                    if (!isLogin) ...[
                      // Password Repeat field
                      TextField(
                        obscureText: true,
                        decoration: InputDecoration(
                          prefixIcon: const Icon(Icons.lock),
                          hintText: "Нууц үг давтах",
                          filled: true,
                          fillColor: Colors.purple.shade50,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(30),
                            borderSide: BorderSide.none,
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                    ],
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.purple,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30),
                          ),
                        ),
                        onPressed: isLoading ? null : handleAuthAction,
                        child: isLoading
                            ? CircularProgressIndicator(color: Colors.white)
                            : Text(
                                isLogin ? 'Нэвтрэх' : 'Бүртгүүлэх',
                                style: const TextStyle(
                                    color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                              ),
                      ),
                    ),
                    const SizedBox(height: 15),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(isLogin
                            ? "Don't have an account? "
                            : "Already have an account? "),
                        GestureDetector(
                          onTap: toggleScreen,
                          child: Text(
                            isLogin ? "Бүртгүүлэх" : "Нэвтрэх",
                            style: const TextStyle(
                              color: Colors.purple,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
