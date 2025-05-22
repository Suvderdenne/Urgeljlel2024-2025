import 'package:flutter/material.dart';
import 'home.dart';
import 'Profile.dart';
import 'package:shared_preferences/shared_preferences.dart';


class Header extends StatefulWidget {
  const Header({Key? key}) : super(key: key);

  @override
  _HeaderState createState() => _HeaderState();
}

class _HeaderState extends State<Header> {
  String? firstname;

  @override
  void initState() {
    super.initState();
    _loadUsername();
  }

  Future<void> _loadUsername() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      firstname = prefs.getString('firstname');
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16.0),
      decoration: const BoxDecoration(
        color: Color.fromARGB(255, 102, 67, 191),
        boxShadow: [
          BoxShadow(
            color: Colors.black26,
            blurRadius: 6,
            offset: Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Existing username text
          Text(
            firstname != null ? " $firstname " : "Welcome!",
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),
          // Add the button to navigate to Home
          IconButton(
            icon: Icon(Icons.home),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => HomePage()),  // Ensure HomePage is imported
              );
            },
            tooltip: 'Go to Home',
          ),
        ],
      ),
    );
  }
}



class Footer extends StatefulWidget {
  @override
  _FooterState createState() => _FooterState();
}

class _FooterState extends State<Footer> {
  Map<IconData, bool> _buttonPressed = {
    Icons.person_outlined: false,
    Icons.shop: false,
    Icons.home: false,
    Icons.timelapse: false,
    Icons.more_horiz: false,
  };

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10.0),
      color: Color.fromARGB(255, 81, 122, 255),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildFooterButton(
            context,
            icon: Icons.person_outlined,
            destination: ProfilePage(),
          ),
          _buildFooterButton(
            context,
            icon: Icons.home,
            destination: HomePage(),
          ),

        ],
      ),
    );
  }

  Widget _buildFooterButton(BuildContext context,
      {required IconData icon, required Widget destination}) {
    bool isPressed = _buttonPressed[icon] ?? false;

    return Material(
      elevation: 10,
      shape: CircleBorder(),
      child: InkWell(
        customBorder: CircleBorder(),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => destination),
          );
        },
        onTapDown: (_) {
          _updateButtonColor(icon, true);
        },
        onTapCancel: () {
          _updateButtonColor(icon, false);
        },
        onTapUp: (_) {
          _updateButtonColor(icon, false);
        },
        child: AnimatedContainer(
          duration: Duration(milliseconds: 300),
          width: isPressed ? 66 : 56,
          height: isPressed ? 66 : 56,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: isPressed ? Colors.blue : Colors.white,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.2),
                spreadRadius: 1,
                blurRadius: 8,
                offset: Offset(4, 4),
              ),
            ],
          ),
          child: Icon(
            icon,
            color: isPressed ? Colors.white : Colors.purple,
          ),
        ),
      ),
    );
  }

  void _updateButtonColor(IconData icon, bool isPressed) {
    setState(() {
      _buttonPressed[icon] = isPressed;
    });
  }
}
