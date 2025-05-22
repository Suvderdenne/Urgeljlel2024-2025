import 'package:app/login.dart';
import 'package:app/tests/Profile.dart';
import 'package:app/tests/multi.dart';
import 'package:flutter/material.dart';
import 'package:app/tests/mono.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  runApp(const Home());
}

class Home extends StatelessWidget {
  const Home({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blueGrey,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: const HomePage(),
      routes: {
        '/home': (context) => const HomePage(),
        '/search': (context) => const ProfilePage(),
      },
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String? firstname;
  final TextEditingController _usernameController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _checkUsername();
  }

  Future<void> _checkUsername() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      firstname = prefs.getString('firstname');
    });
  }

  void _saveUsernameAndStart() async {
    final prefs = await SharedPreferences.getInstance();
    if (_usernameController.text.trim().isNotEmpty) {
      await prefs.setString('username', _usernameController.text.trim());
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const MonopolyGame()),
      );
    }
  }

  void _goToLogin(BuildContext context) {
    Navigator.push(context, MaterialPageRoute(builder: (context) => Login()));
  }

  void _playGame() {
    if (firstname != null) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const MonopolyGame()),
      );
    }
  }

  Widget _getPage(String route) {
    switch (route) {
      case '/home':
        return const HomePage();
      case '/game':
        return const MonopolyGame();
      default:
        return const HomePage();
    }
  }

  void _navigateToPage(String route) async {
    bool shouldNavigate = true;

    if (ModalRoute.of(context)?.settings.name == '/game') {
      shouldNavigate =
          await showDialog(
            context: context,
            builder:
                (context) => AlertDialog(
                  title: const Text('Leave Game?'),
                  content: const Text(
                    'Your current game progress will be lost. Do you want to continue?',
                  ),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(context, false),
                      child: const Text('Stay'),
                    ),
                    TextButton(
                      onPressed: () => Navigator.pop(context, true),
                      child: const Text('Leave'),
                    ),
                  ],
                ),
          ) ??
          false;
    }

    if (shouldNavigate) {
      Navigator.push(
        context,
        PageRouteBuilder(
          pageBuilder:
              (context, animation, secondaryAnimation) => _getPage(route),
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            const begin = Offset(1.0, 0.0);
            const end = Offset.zero;
            const curve = Curves.easeInOut;
            var tween = Tween(
              begin: begin,
              end: end,
            ).chain(CurveTween(curve: curve));
            var offsetAnimation = animation.drive(tween);

            return SlideTransition(position: offsetAnimation, child: child);
          },
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.blueAccent, Colors.greenAccent],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: Stack(
          children: [
            // Transparent login button in top-left
            firstname != null && firstname!.isNotEmpty
                ? SizedBox.shrink() // Hide the login button
                : Positioned(
                  top: 40,
                  right: 20,
                  child: TextButton.icon(
                    onPressed: () => _goToLogin(context),
                    icon: const Icon(Icons.login, color: Colors.white),
                    label: const Text(
                      "Login",
                      style: TextStyle(color: Colors.white),
                    ),
                    style: TextButton.styleFrom(
                      backgroundColor: Colors.black.withOpacity(0.3),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
                ),
            Center(
              child:
                  firstname == null
                      ? _buildUsernameInput()
                      : Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          // Banner image
                          ClipRRect(
                            borderRadius: BorderRadius.circular(
                              12,
                            ), // optional rounded corners
                            child: Image.asset(
                              'mono.png', // replace with your image path or use Image.network
                              width: 500,
                              height: 250,
                              fit: BoxFit.cover,
                            ),
                          ),
                          const SizedBox(height: 20),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              ElevatedButton.icon(
                                onPressed: _playGame,
                                icon: const Icon(Icons.play_arrow),
                                label: const Text("Play Solo"),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.blue,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 24,
                                    vertical: 12,
                                  ),
                                ),
                              ),
                              IconButton(
                                icon: const Icon(
                                  Icons.person_2_outlined,
                                  size: 28,
                                  color: Color.fromARGB(255, 255, 255, 255),
                                ),
                                onPressed: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) => ProfilePage(),
                                    ),
                                  );
                                },
                              ),
                              const SizedBox(height: 10),
                              ElevatedButton.icon(
                                onPressed: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) => Multigame(),
                                    ),
                                  );
                                },
                                icon: const Icon(Icons.play_arrow),
                                label: const Text("Play with friends"),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor:  Colors.blue,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 24,
                                    vertical: 12,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildUsernameInput() {
    // Check if the user is already logged in by checking for a username.
    if (firstname != null && firstname!.isNotEmpty) {
      // If the user is logged in, show the "Play" button instead.
      return Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            'Welcome, $firstname!',
            style: TextStyle(fontSize: 18, color: Colors.white),
          ),
          const SizedBox(height: 20),
          ElevatedButton.icon(
            onPressed: _playGame,
            icon: const Icon(Icons.play_arrow),
            label: const Text("Play"),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.green,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            ),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => Multigame()),
              );
            },
            child: Text('Play with friends'),
            style: ElevatedButton.styleFrom(
              elevation: 4,
              padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
        ],
      );
    } else {
      // If the user is not logged in, show the username input field.
      return Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(12), // optional rounded corners
            child: Image.asset(
              'mono.png', // replace with your image path or use Image.network
              width: 500,
              height: 250,
              fit: BoxFit.cover,
            ),
          ),
          const Text(
            'Enter your username',
            style: TextStyle(fontSize: 18, color: Colors.white),
          ),
          const SizedBox(height: 12),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 140),
            child: TextField(
              controller: _usernameController,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Username',
                hintStyle: const TextStyle(color: Colors.white70),
                filled: true,
                fillColor: Colors.black26,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: const BorderSide(color: Colors.white),
                ),
              ),
            ),
          ),
          const SizedBox(height: 10),
          TextButton.icon(
            onPressed: _generateRandomName,
            icon: const Icon(Icons.shuffle, color: Colors.white),
            label: const Text(
              'Generate Random Name',
              style: TextStyle(color: Colors.white),
            ),
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: _saveUsernameAndStart,
            child: const Text("Solo play"),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue,
              foregroundColor: Colors.white,
            ),
          ),
          const SizedBox(height: 10),
          ElevatedButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => Multigame()),
              );
            },
            child: Text('Play with friends'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue,
              foregroundColor: Colors.white,
            ),
          ),
        ],
      );
    }
  }

  final List<String> _randomNames = [
    'ShadowStrike',
    'PixelNinja',
    'BlazeKing',
    'FrostByte',
    'DragonSnap',
    'NoScopeDude',
    'CyberWizard',
    'AceRanger',
    'NovaKnight',
    'QuantumGhost',
  ];

  void _generateRandomName() {
    final random = (_randomNames..shuffle()).first;
    setState(() {
      _usernameController.text = random;
    });
  }
}
