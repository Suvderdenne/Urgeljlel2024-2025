import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/register_screen.dart';
import 'screens/main_menu_screen.dart';
import 'screens/meal/add_food_screen.dart';
import 'screens/fasting/fasting_screen.dart';
import 'providers/auth_provider.dart';
import 'providers/weight_provider.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProxyProvider<AuthProvider, WeightProvider>(
          create: (context) =>
              WeightProvider(Provider.of<AuthProvider>(context, listen: false)),
          update: (context, auth, previous) => WeightProvider(auth),
        ),
      ],
      child: MaterialApp(
        title: 'Fitness App',
        theme: ThemeData(
          primaryColor: const Color(0xFFFF5A5F),
          primarySwatch: Colors.blue,
          visualDensity: VisualDensity.adaptivePlatformDensity,
          scaffoldBackgroundColor: Colors.white,
          appBarTheme: const AppBarTheme(
            backgroundColor: Colors.white,
            elevation: 0,
            iconTheme: IconThemeData(color: Colors.black),
            titleTextStyle: TextStyle(
              color: Colors.black,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          textTheme: const TextTheme(
            headlineLarge: TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
            titleLarge: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
            bodyLarge: TextStyle(
              fontSize: 16,
              color: Colors.grey,
            ),
          ),
        ),
        initialRoute: '/login',
        routes: {
          '/login': (context) => const LoginScreen(),
          '/register': (context) => const RegisterScreen(),
          '/home': (context) => const MainMenuScreen(),
          '/add-food': (context) => const AddFoodScreen(),
          '/fasting': (context) => const FastingScreen(),
        },
      ),
    );
  }
}
