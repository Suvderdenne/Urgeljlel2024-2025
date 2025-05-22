import 'package:flutter/material.dart';
import 'package:api/view/home.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  // Existing controllers and variables
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _isLoading = false;
  bool _obscurePassword = true;
  bool _showRegistration = false;
  bool _showForgotPassword = false; // New flag for forgot password screen
  final _formKey = GlobalKey<FormState>();

  // Registration controllers
  final TextEditingController _regEmailController = TextEditingController();
  final TextEditingController _regPhoneController = TextEditingController();
  final TextEditingController _regLastNameController = TextEditingController();
  final TextEditingController _regFirstNameController = TextEditingController();
  final TextEditingController _regPasswordController = TextEditingController();

  // Forgot password controllers
  final TextEditingController _forgotEmailController = TextEditingController();
  final TextEditingController _forgotPhoneController = TextEditingController();
  bool _useEmailForRecovery = true; // Toggle between email and phone recovery

  @override
  void dispose() {
    // Dispose all controllers
    _emailController.dispose();
    _passwordController.dispose();
    _regEmailController.dispose();
    _regPhoneController.dispose();
    _regLastNameController.dispose();
    _regFirstNameController.dispose();
    _regPasswordController.dispose();
    _forgotEmailController.dispose();
    _forgotPhoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          image: DecorationImage(
            image: NetworkImage('https://i.pinimg.com/736x/2c/43/ea/2c43eaba2fa106786b6496aba9fcf1ba.jpg'), // Replace with your background image
            fit: BoxFit.cover,
          ),
        ),
        child: Center(
          child: SingleChildScrollView(
            padding: EdgeInsets.symmetric(horizontal: 30.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (!_showForgotPassword) _buildMainContent(),
                if (_showForgotPassword) _buildForgotPasswordScreen(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildMainContent() {
    return Column(
      children: [
        // Logo and Title
        Column(
          children: [
            Container(
              padding: EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.deepPurple,
                shape: BoxShape.circle,
              ),
              child: Icon(Icons.school, size: 50, color: Colors.white),
            ),
            SizedBox(height: 20),
            Text(
              'ЭЕШ Бэлтгэл',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.w800,
                color: Colors.deepPurple,
                fontFamily: 'Roboto',
                letterSpacing: 0.5,
                shadows: [
                  Shadow(
                    color: Colors.black12,
                    blurRadius: 2,
                    offset: Offset(1, 1),
                  ),
                ],
              ),
            ),
            SizedBox(height: 10),
            Text(
              _showRegistration 
                  ? 'Шинэ хэрэглэгч бүртгүүлэх'
                  : 'Боловсролын шинэ гарцыг нээцгээе',
              style: TextStyle(
                fontSize: 16,
                color: Colors.deepPurple.shade700,
                fontWeight: FontWeight.w500,
                fontFamily: 'Roboto',
                letterSpacing: 0.3,
              ),
            ),
          ],
        ),
        SizedBox(height: 40),

        // Toggle between Login and Registration
        if (!_showRegistration) _buildLoginForm(),
        if (_showRegistration) _buildRegistrationForm(),

        // Toggle button between login and registration
        if (!_showRegistration)
          TextButton(
            onPressed: () {
              setState(() {
                _showRegistration = !_showRegistration;
              });
            },
            child: Text(
              'Шинэ хэрэглэгч үүсгэх',
              style: TextStyle(
                color: Colors.deepPurple.shade700,
                fontWeight: FontWeight.w600,
                fontSize: 15,
              ),
            ),
          ),
        if (_showRegistration)
          TextButton(
            onPressed: () {
              setState(() {
                _showRegistration = !_showRegistration;
              });
            },
            child: Text(
              'Нэвтрэх хэсэг рүү буцах',
              style: TextStyle(
                color: Colors.deepPurple.shade700,
                fontWeight: FontWeight.w600,
                fontSize: 15,
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildLoginForm() {
    return Card(
      elevation: 8,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      child: Padding(
        padding: EdgeInsets.all(25),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              // Email Field
              TextFormField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: Colors.deepPurple.shade900,
                ),
                decoration: InputDecoration(
                  labelText: 'Имэйл хаяг',
                  labelStyle: TextStyle(
                    color: Colors.deepPurple.shade600,
                    fontWeight: FontWeight.w500,
                  ),
                  prefixIcon: Icon(Icons.email, color: Colors.deepPurple),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide: BorderSide(color: Colors.deepPurple.shade200),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide: BorderSide(color: Colors.deepPurple.shade200),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide: BorderSide(color: Colors.deepPurple, width: 1.5),
                  ),
                  filled: true,
                  fillColor: Colors.white.withOpacity(0.9),
                ),
              ),
              SizedBox(height: 20),

              // Password Field
              TextFormField(
                controller: _passwordController,
                obscureText: _obscurePassword,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: Colors.deepPurple.shade900,
                ),
                decoration: InputDecoration(
                  labelText: 'Нууц үг',
                  labelStyle: TextStyle(
                    color: Colors.deepPurple.shade600,
                    fontWeight: FontWeight.w500,
                  ),
                  prefixIcon: Icon(Icons.lock, color: Colors.deepPurple),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _obscurePassword ? Icons.visibility_off : Icons.visibility,
                      color: Colors.deepPurple,
                    ),
                    onPressed: () {
                      setState(() {
                        _obscurePassword = !_obscurePassword;
                      });
                    },
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide: BorderSide(color: Colors.deepPurple.shade200),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide: BorderSide(color: Colors.deepPurple.shade200),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide: BorderSide(color: Colors.deepPurple, width: 1.5),
                  ),
                  filled: true,
                  fillColor: Colors.white.withOpacity(0.9),
                ),
              ),
              SizedBox(height: 10),

              // Forgot Password
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () {
                    setState(() {
                      _showForgotPassword = true;
                    });
                  },
                  child: Text(
                    'Нууц үг мартсан?',
                    style: TextStyle(
                      color: Colors.deepPurple.shade600,
                      fontWeight: FontWeight.w500,
                      fontSize: 14,
                      decoration: TextDecoration.underline,
                    ),
                  ),
                ),
              ),
              SizedBox(height: 20),

              // Login Button
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (context) => HomeScreen()),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.deepPurple,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                    elevation: 5,
                    padding: EdgeInsets.symmetric(vertical: 15),
                    shadowColor: Colors.deepPurple.withOpacity(0.4),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.login, color: Colors.white, size: 22),
                      SizedBox(width: 10),
                      Text(
                        'НЭВТРЭХ',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                          letterSpacing: 0.8,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRegistrationForm() {
    return Card(
      elevation: 8,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      child: Padding(
        padding: EdgeInsets.all(25),
        child: Form(
          child: Column(
            children: [
              // First Name
              TextFormField(
                controller: _regFirstNameController,
                decoration: InputDecoration(
                  labelText: 'Овог',
                  prefixIcon: Icon(Icons.person_outline, color: Colors.deepPurple),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              SizedBox(height: 15),

              // Last Name
              TextFormField(
                controller: _regLastNameController,
                decoration: InputDecoration(
                  labelText: 'Нэр',
                  prefixIcon: Icon(Icons.person, color: Colors.deepPurple),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              SizedBox(height: 15),

              // Email (Gmail)
              TextFormField(
                controller: _regEmailController,
                keyboardType: TextInputType.emailAddress,
                decoration: InputDecoration(
                  labelText: 'Gmail хаяг',
                  prefixIcon: Icon(Icons.email, color: Colors.deepPurple),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              SizedBox(height: 15),

              // Phone Number
              TextFormField(
                controller: _regPhoneController,
                keyboardType: TextInputType.phone,
                decoration: InputDecoration(
                  labelText: 'Утасны дугаар',
                  prefixIcon: Icon(Icons.phone, color: Colors.deepPurple),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              SizedBox(height: 15),

              // Password
              TextFormField(
                controller: _regPasswordController,
                obscureText: true,
                decoration: InputDecoration(
                  labelText: 'Нууц үг',
                  prefixIcon: Icon(Icons.lock, color: Colors.deepPurple),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              SizedBox(height: 20),

              // Register Button
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (context) => HomeScreen()),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.deepPurple,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                    elevation: 5,
                    padding: EdgeInsets.symmetric(vertical: 15),
                  ),
                  child: Text(
                    'БҮРТГҮҮЛЭХ',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildForgotPasswordScreen() {
    return Column(
      children: [
        // Back button
        Align(
          alignment: Alignment.topLeft,
          child: IconButton(
            icon: Icon(Icons.arrow_back, color: Colors.deepPurple),
            onPressed: () {
              setState(() {
                _showForgotPassword = false;
              });
            },
          ),
        ),
        SizedBox(height: 20),

        // Title
        Text(
          'Нууц үг сэргээх',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Colors.deepPurple,
          ),
        ),
        SizedBox(height: 10),
        Text(
          'Нууц үгээ сэргээх холбоосыг имэйл эсвэл утасны дугаараар авах',
          style: TextStyle(
            fontSize: 14,
            color: Colors.deepPurple.shade700,
          ),
          textAlign: TextAlign.center,
        ),
        SizedBox(height: 30),

        // Recovery method toggle
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Имэйлээр'),
            Switch(
              value: _useEmailForRecovery,
              onChanged: (value) {
                setState(() {
                  _useEmailForRecovery = value;
                });
              },
              activeColor: Colors.deepPurple,
            ),
            Text('Утасны дугаараар'),
          ],
        ),
        SizedBox(height: 20),

        // Recovery input field
        Card(
          elevation: 8,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          child: Padding(
            padding: EdgeInsets.all(25),
            child: Column(
              children: [
                if (_useEmailForRecovery)
                  TextFormField(
                    controller: _forgotEmailController,
                    keyboardType: TextInputType.emailAddress,
                    decoration: InputDecoration(
                      labelText: 'Имэйл хаяг',
                      prefixIcon: Icon(Icons.email, color: Colors.deepPurple),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  )
                else
                  TextFormField(
                    controller: _forgotPhoneController,
                    keyboardType: TextInputType.phone,
                    decoration: InputDecoration(
                      labelText: 'Утасны дугаар',
                      prefixIcon: Icon(Icons.phone, color: Colors.deepPurple),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  ),
                SizedBox(height: 20),

                // Submit button
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    onPressed: () {
                      // Handle password reset
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            _useEmailForRecovery
                                ? 'Имэйл хаягруу нууц үг сэргээх холбоос илгээлээ'
                                : 'Утасны дугаарт нууц үг сэргээх код илгээлээ',
                          ),
                        ),
                      );
                      setState(() {
                        _showForgotPassword = false;
                      });
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.deepPurple,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: Text(
                      'ИЛГЭЭХ',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}