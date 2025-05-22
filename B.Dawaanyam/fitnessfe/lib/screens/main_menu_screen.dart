import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'plan/personal_plan_screen.dart';
import 'workout/workout_screen.dart';
import 'meal/meal_screen.dart';
import 'profile/profile_screen.dart';

class MainMenuScreen extends StatefulWidget {
  const MainMenuScreen({super.key});

  @override
  State<MainMenuScreen> createState() => _MainMenuScreenState();
}

class _MainMenuScreenState extends State<MainMenuScreen> {
  int _selectedIndex = 0;

  final List<Widget> _screens = [
    const PersonalPlanScreen(),
    const WorkoutScreen(),
    const MealScreen(),
    const ProfileScreen(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_selectedIndex],
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.1),
              spreadRadius: 0,
              blurRadius: 10,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: BottomNavigationBar(
          items: <BottomNavigationBarItem>[
            BottomNavigationBarItem(
              icon: const Icon(Icons.calendar_today),
              label: 'Plan',
              activeIcon: Icon(Icons.calendar_today,
                  color: Theme.of(context).primaryColor),
            ),
            BottomNavigationBarItem(
              icon: const Icon(Icons.fitness_center),
              label: 'Workout',
              activeIcon: Icon(Icons.fitness_center,
                  color: Theme.of(context).primaryColor),
            ),
            BottomNavigationBarItem(
              icon: const Icon(Icons.restaurant_menu),
              label: 'Meal',
              activeIcon: Icon(Icons.restaurant_menu,
                  color: Theme.of(context).primaryColor),
            ),
            BottomNavigationBarItem(
              icon: const Icon(Icons.person),
              label: 'Profile',
              activeIcon:
                  Icon(Icons.person, color: Theme.of(context).primaryColor),
            ),
          ],
          currentIndex: _selectedIndex,
          selectedItemColor: Theme.of(context).primaryColor,
          unselectedItemColor: Colors.grey,
          selectedLabelStyle: GoogleFonts.poppins(
            fontSize: 12,
            fontWeight: FontWeight.w500,
          ),
          unselectedLabelStyle: GoogleFonts.poppins(
            fontSize: 12,
            fontWeight: FontWeight.w400,
          ),
          type: BottomNavigationBarType.fixed,
          backgroundColor: Colors.white,
          elevation: 0,
          onTap: _onItemTapped,
        ),
      ),
    );
  }
}
