import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../login.dart';
import 'package:app/tests/update.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({Key? key}) : super(key: key);

  @override
  _ProfilePageState createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  String? email;
  String? firstname;
  String? imageBase64;
  bool _isLoading = true;
  final Color startColor = const Color(0xFF6A11CB);
  final Color endColor = const Color(0xFF2575FC);

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      debugPrint('Loaded image data length: ${prefs.getString('image')?.length}');
      
      setState(() {
        email = prefs.getString('email');
        firstname = prefs.getString('firstname');
        imageBase64 = prefs.getString('image');
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Error loading user data: $e');
      setState(() => _isLoading = false);
    }
  }

  Future<void> _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    if (!mounted) return;
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => const Login()),
    );
  }

  Widget _buildProfileImage() {
    if (_isLoading) {
      return const CircularProgressIndicator(
        valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
      );
    }

    try {
      if (imageBase64 != null && imageBase64!.isNotEmpty) {
        final imageBytes = base64Decode(imageBase64!);
        if (imageBytes.isNotEmpty) {
          return Container(
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.3),
                  blurRadius: 10,
                  spreadRadius: 2,
                  offset: const Offset(0, 5),
                )
              ],
            ),
            child: CircleAvatar(
              radius: 60,
              backgroundImage: MemoryImage(imageBytes),
              backgroundColor: Colors.transparent,
            ),
          );
        }
      }
    } catch (e) {
      debugPrint('Error decoding image: $e');
    }

    return Container(
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 10,
            spreadRadius: 2,
            offset: const Offset(0, 5),
          )
        ],
      ),
      child: const CircleAvatar(
        radius: 60,
        backgroundColor: Colors.white,
        child: Icon(Icons.person, size: 50, color: Colors.grey),
      ),
    );
  }

  Widget _buildInfoCard(IconData icon, String title, String subtitle) {
    return Container(
      height: 80,
      margin: const EdgeInsets.only(bottom: 15),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 8,
            spreadRadius: 1,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: Card(
        color: Colors.white.withOpacity(0.15),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(15),
        ),
        elevation: 0,
        child: ListTile(
          leading: Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: Colors.white, size: 20),
          ),
          title: Text(
            title,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
          ),
          subtitle: Text(
            subtitle,
            style: TextStyle(
              color: Colors.white.withOpacity(0.8),
              fontSize: 14,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildProfileContent() {
    return SingleChildScrollView(
      child: Column(
        children: [
          const SizedBox(height: 30),
          _buildProfileImage(),
          const SizedBox(height: 20),
          Text(
            firstname ?? 'User',
            style: TextStyle(
              fontSize: 28, 
              fontWeight: FontWeight.bold, 
              color: Colors.white,
              shadows: [
                Shadow(
                  blurRadius: 10,
                  color: Colors.black.withOpacity(0.3),
                  offset: const Offset(0, 2),
                )
              ],
            ),
          ),
          const SizedBox(height: 5),
          Text(
            email ?? '',
            style: const TextStyle(
              fontSize: 16, 
              color: Colors.white70,
            ),
          ),
          const SizedBox(height: 30),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20.0),
            child: Column(
              children: [
                _buildInfoCard(Icons.person_outline, 'First Name', firstname ?? ''),
                _buildInfoCard(Icons.email_outlined, 'Email', email ?? ''),
                _buildInfoCard(Icons.phone_iphone_outlined, 'Phone', '+1234567890'),
                _buildInfoCard(Icons.location_city_outlined, 'City', 'Your City'),
                _buildInfoCard(Icons.work_outline, 'Profession', 'Developer'),
                const SizedBox(height: 30),
                ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => UpdateProfilePage(),
                      ),
                    ).then((_) => _loadUserData());
                  },
                  child: const Text('Edit Profile'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    foregroundColor: Colors.white,
                  ),
                ),
                const SizedBox(height: 30),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: _logout,
                    icon: const Icon(Icons.logout, color: Colors.white),
                    label: const Text(
                      'Logout',
                      style: TextStyle(
                        fontSize: 18,
                        color: Colors.white,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.redAccent,
                      padding: const EdgeInsets.symmetric(vertical: 15),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      elevation: 5,
                      shadowColor: Colors.black.withOpacity(0.3),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildLoginPrompt() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.account_circle,
              size: 80,
              color: Colors.white.withOpacity(0.5),
            ),
            const SizedBox(height: 20),
            const Text(
              'No user is logged in',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 24.0,
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              'Please login to access your profile',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 16.0,
                color: Colors.white.withOpacity(0.8),
              ),
            ),
            const SizedBox(height: 30),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(builder: (context) => const Login()),
                  );
                },
                icon: const Icon(Icons.login, color: Colors.white),
                label: const Text(
                  'Login',
                  style: TextStyle(
                    fontSize: 18,
                    color: Colors.white,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.greenAccent,
                  padding: const EdgeInsets.symmetric(vertical: 15),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 5,
                  shadowColor: Colors.black.withOpacity(0.3),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isLoggedIn = email != null && email!.isNotEmpty;

    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(60),
        child: AppBar(
          title: const Text(
            "Профайл",
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          centerTitle: true,
          backgroundColor: const Color.fromARGB(255, 102, 67, 191),
          elevation: 10,
        ),
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [startColor, endColor],
          ),
        ),
        child: _isLoading
            ? const Center(
                child: CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                ),
              )
            : isLoggedIn
                ? _buildProfileContent()
                : _buildLoginPrompt(),
      ),
    );
  }
}