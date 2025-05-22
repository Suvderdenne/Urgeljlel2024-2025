import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';

import 'dart:convert';
import 'package:http/http.dart' as http;
class Signup extends StatefulWidget {
  const Signup({super.key});
  @override
  _SignupState createState() => _SignupState();
}

class _SignupState extends State<Signup> {
  
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController firstnameController = TextEditingController();
final TextEditingController passworrepaetdController = TextEditingController();
  bool _obscurePassword = true;
bool _obscurePasswordRepeat = true;

  void sendJson() async {
    
    final url = Uri.parse('http://127.0.0.1:8001/users/');


    
    final Map<String, dynamic> jsonMap = {
      'action': 'register',
      'email': emailController.text,
      'passw': passwordController.text,
      'firstname': firstnameController.text
    };

    try {
      
      final String jsonString = json.encode(jsonMap);
      print('JSON to send: $jsonString');

      
      final response = await http.post(
        url,
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonString,
      );

      
      if (response.statusCode == 200) {
        print('Success: ${response.body}');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('User registered successfully!'),
            backgroundColor: Colors.green,
          ),
        );
      } else {
      }
    } catch (e) {
      print('Error sending JSON: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.primaryContainer,
      body: Form(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 30.0),
          child: Column(
            children: [
              const SizedBox(height: 100),
              Lottie.asset("../assets/register.json", width: 200),
              Text(
                "Register",
                style: Theme.of(context).textTheme.headlineLarge,
              ),
              const SizedBox(height: 10),
              Text(
                "Create your account",
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: 35),
              TextFormField(
                controller: firstnameController,
                keyboardType: TextInputType.name,
                decoration: InputDecoration(
                  labelText: "Username",
                  prefixIcon: const Icon(Icons.person_outline),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              const SizedBox(height: 10),
              TextFormField(
                controller: emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: InputDecoration(
                  labelText: "Email",
                  prefixIcon: const Icon(Icons.email_outlined),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              const SizedBox(height: 10),
              TextFormField(
  controller: passwordController,
  keyboardType: TextInputType.visiblePassword,
  obscureText: _obscurePassword, // Use obscureText instead of managing state manually
  decoration: InputDecoration(
    labelText: "Password",
    prefixIcon: const Icon(Icons.password_outlined),
    suffixIcon: IconButton(
      onPressed: () {
        setState(() {
          _obscurePassword = !_obscurePassword;
        });
      },
      icon: _obscurePassword
          ? const Icon(Icons.visibility_outlined)
          : const Icon(Icons.visibility_off_outlined),
    ),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(10),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(10),
    ),
  ),
),
const SizedBox(height: 10),
TextFormField(
  controller: passworrepaetdController,
  keyboardType: TextInputType.visiblePassword,
  obscureText: _obscurePasswordRepeat, // Separate state for this field
  decoration: InputDecoration(
    labelText: "Repeat Password",
    prefixIcon: const Icon(Icons.password_outlined),
    suffixIcon: IconButton(
      onPressed: () {
        setState(() {
          _obscurePasswordRepeat = !_obscurePasswordRepeat;
        });
      },
      icon: _obscurePasswordRepeat
          ? const Icon(Icons.visibility_outlined)
          : const Icon(Icons.visibility_off_outlined),
    ),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(10),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(10),
    ),
  ),
  validator: (String? value) {
    if (value == null || value.isEmpty) {
      return "Please enter password.";
    } else if (value != passwordController.text) {
      return "Password doesn't match.";
    }
    return null;
  },
),

              const SizedBox(height: 50),
              Column(
                children: [
                  ElevatedButton(
                    onPressed: sendJson,
                    child: Text('Register'),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text("Already have an account?"),
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text("Login"),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}


import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';
import 'signup.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'tests/home.dart';
class Login extends StatefulWidget {
  const Login({super.key});

  @override
  _LoginState createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _obscurePassword = true;
  bool _isLoading = false;

  void sendJson() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    final url = Uri.parse('http://127.0.0.1:8001/users/');

    final Map<String, dynamic> jsonMap = {
      'action': 'login',
      'email': emailController.text,
      'passw': passwordController.text,
    };

    setState(() {
      _isLoading = true;
    });

    try {
      final String jsonString = json.encode(jsonMap);
      print('JSON to send: $jsonString');

      final response = await http.post(
        url,
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonString,
      );

      if (response.statusCode == 200) {
        print('Success: ${response.body}');
        final responseData = json.decode(response.body);

        // Save user data to shared preferences
        final prefs = await SharedPreferences.getInstance();
        prefs.setString('email', responseData['data'][0]['email']);
        prefs.setString('firstname', responseData['data'][0]['firstname']);

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('User logged in successfully!'),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => Home()),
        );
      } else {
        print('Failed with status code: ${response.statusCode}');
        print('Failed with error: ${response.reasonPhrase}');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to login.'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      print('Error sending JSON: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error: $e'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.primaryContainer,
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 30.0),
          child: Column(
            children: [
              const SizedBox(height: 100),
              Lottie.asset("../assets/register.json", width: 200),
              Text(
                "Login",
                style: Theme.of(context).textTheme.headlineLarge,
              ),
              const SizedBox(height: 35),
              TextFormField(
                controller: emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: InputDecoration(
                  labelText: "Email",
                  prefixIcon: const Icon(Icons.email_outlined),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your email';
                  }
                  if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value)) {
                    return 'Please enter a valid email';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 10),
              TextFormField(
                controller: passwordController,
                keyboardType: TextInputType.visiblePassword,
                obscureText: _obscurePassword,
                decoration: InputDecoration(
                  labelText: "Password",
                  prefixIcon: const Icon(Icons.password_outlined),
                  suffixIcon: IconButton(
                    onPressed: () {
                      setState(() {
                        _obscurePassword = !_obscurePassword;
                      });
                    },
                    icon: _obscurePassword
                        ? const Icon(Icons.visibility_outlined)
                        : const Icon(Icons.visibility_off_outlined),
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your password';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 10),
              const SizedBox(height: 50),
              _isLoading
                  ? CircularProgressIndicator()
                  : Column(
                      children: [
                        ElevatedButton(
                          onPressed: sendJson,
                          child: Text('Login'),
                        ),
                        const SizedBox(height: 30,),
                        TextButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (context) => Signup()),
                            );
                          },
                          child: Text("Register"),
                        ),
                        TextButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (context) => HomePage()),
                            );
                          },
                          child: Text("Home"),
                        ),
                      ],
                    ),
            ],
          ),
        ),
      ),
    );
  }
}
