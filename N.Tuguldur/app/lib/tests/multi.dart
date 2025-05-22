import 'dart:async';
import 'package:app/tests/Profile.dart';
import 'package:flutter/material.dart';
import 'dart:math';
import 'home.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

void main() => runApp(const Multigame());

class Multigame extends StatelessWidget {
  const Multigame({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
      home: MonopolyBoard(),
    );
  }
}

class MonopolyBoard extends StatefulWidget {
  const MonopolyBoard({super.key});

  @override
  _MonopolyBoardState createState() => _MonopolyBoardState();
}

class Header extends StatefulWidget {
  const Header({Key? key}) : super(key: key);

  @override
  _HeaderState createState() => _HeaderState();
}

class _HeaderState extends State<Header> with SingleTickerProviderStateMixin {
  String? firstname;
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _loadUsername();

    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );

    _fadeAnimation = CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    );

    _controller.forward();
  }

  Future<void> _loadUsername() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      firstname = prefs.getString('firstname');
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _fadeAnimation,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFF3100B8), Color(0xFF5E4FC3)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: const BorderRadius.only(
            bottomLeft: Radius.circular(24),
            bottomRight: Radius.circular(24),
          ),
          boxShadow: const [
            BoxShadow(
              color: Colors.black26,
              blurRadius: 16,
              offset: Offset(0, 6),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              firstname != null ? "Hello, $firstname 👋" : "Welcome!",
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: Colors.white,
                shadows: [
                  Shadow(
                    blurRadius: 4,
                    color: Colors.black45,
                    offset: Offset(1, 1),
                  ),
                ],
              ),
            ),
            GestureDetector(
              onTap: () {
                showDialog(
                  context: context,
                  builder: (BuildContext context) {
                    return AlertDialog(
                      title: const Text('Confirmation'),
                      content: const Text(
                        'This game progress will be lost. Are you sure you want to go to the Home page?',
                      ),
                      actions: <Widget>[
                        TextButton(
                          child: const Text('Cancel'),
                          onPressed: () => Navigator.of(context).pop(),
                        ),
                        TextButton(
                          child: const Text('Yes'),
                          onPressed: () {
                            Navigator.of(context).pop();
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => HomePage(),
                              ),
                            );
                          },
                        ),
                      ],
                    );
                  },
                );
              },
              child: const Icon(
                Icons.home_rounded,
                size: 30,
                color: Colors.white70,
                shadows: [
                  Shadow(
                    blurRadius: 6,
                    color: Colors.black45,
                    offset: Offset(1, 2),
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

class _MonopolyBoardState extends State<MonopolyBoard> {
  final int boardSize = 40;
  List<int> playerPositions = [0, 0, 0, 0];
  List<int> playerBalances = [1000, 1000, 1000, 1000];
  List<bool> skipTurns = [false, false, false, false];
  int currentPlayerIndex = 0;
  int lastRoll = 1;

  final List<IconData> iconOptions = [
    Icons.person,
    Icons.directions_car,
    Icons.pets,
    Icons.airplanemode_active,
  ];
  List<String> playerEmojis = [
    '🚗', // Car emoji
    '🚢', // Ship emoji
    '🐶', // Dog emoji
    '✈️', // Airplane emoji
  ];

  List<Color> playerColors = [
    Colors.blue,
    Colors.green,
    Colors.orange,
    Colors.purple,
  ];

  final Map<String, Color> boardStyles = {
    'Classic': const Color.fromARGB(255, 218, 140, 52),
    'Neo Mode': const Color.fromARGB(255, 169, 47, 207),
    'Ocean Blue': const Color.fromARGB(255, 10, 137, 196)!,
    'Sunset': const Color.fromARGB(255, 230, 140, 3)!,
  };
  String selectedStyle = 'Classic';
  late DateTime gameStartTime;
  late Timer gameTimer;
  late Timer displayTimer;
  Duration timeLeft = const Duration(minutes: 15);

  int numberOfPlayers = 2; // Default to 2 players

  final Set<int> ownableTiles = {
    1,
    3,
    5,
    6,
    8,
    9,
    11,
    12,
    13,
    14,
    15,
    16,
    18,
    19,
    21,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    31,
    32,
    34,
    35,
    37,
    39,
  };

  List<int> ownership = List.filled(40, 0);

  final List<String> tileNames = [
    "START",
    "SUNSET",
    "REWARDS",
    "BEACH",
    "TAX",
    "RAIL",
    "VILLA",
    "CARD",
    "HOTEL",
    "MAPLE",
    "JAIL",
    "PALACE",
    "POWER",
    "CITY",
    "VICTORIA",
    "RAIL",
    "SUITE",
    "INVEST",
    "SKY",
    "URBAN",
    "PARK",
    "TOWERS",
    "MYSTERY",
    "HALL",
    "HOTEL",
    "RAIL",
    "BLUE",
    "HARBOR",
    "UTILITY",
    "TROPIC",
    "JAIL",
    "PACIFIC",
    "NORTH",
    "REWARDS",
    "PENN",
    "RAIL",
    "LUCK",
    "PARK",
    "TAX",
    "VIEW",
  ];

  @override
  void initState() {
    super.initState();
    Future.delayed(Duration.zero, () async {
      await _selectNumberOfPlayers();
      await _selectBoardStyle();
      _startGameTimer();
    });
  }

  Future<void> _selectNumberOfPlayers() async {
    int? players = await showDialog<int>(
      context: context,
      barrierDismissible: false,
      builder:
          (context) => AlertDialog(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            backgroundColor: const Color(0xFFE9F0FF),
            title: Row(
              children: const [
                Icon(Icons.group, color: Color(0xFF5C6BC0)),
                SizedBox(width: 8),
                Text(
                  "Select Number of Players",
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                    color: Color(0xFF2C387E),
                  ),
                ),
              ],
            ),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children:
                  [2, 3, 4].map((num) {
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 6),
                      child: ElevatedButton.icon(
                        icon: const Icon(Icons.person),
                        label: Text(
                          "$num Player${num > 1 ? 's' : ''}",
                          style: const TextStyle(fontSize: 16),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF5C6BC0),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(
                            horizontal: 24,
                            vertical: 12,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        onPressed: () => Navigator.pop(context, num),
                      ),
                    );
                  }).toList(),
            ),
          ),
    );

    if (players != null && players >= 2 && players <= 4) {
      setState(() {
        numberOfPlayers = players;
        playerPositions = List.filled(numberOfPlayers, 0);
        playerBalances = List.filled(numberOfPlayers, 1000);
        skipTurns = List.filled(numberOfPlayers, false);
      });
    }
  }

  Future<void> rollDice(int playerIndex) async {
    if (currentPlayerIndex != playerIndex) {
      // Not this player's turn
      return;
    }

    if (skipTurns[playerIndex]) {
      setState(() {
        skipTurns[playerIndex] = false;
        currentPlayerIndex = (currentPlayerIndex + 1) % numberOfPlayers;
      });
      return;
    }

    final roll = Random().nextInt(6) + 1;
    lastRoll = roll;

    if (playerPositions[playerIndex] == 10) {
      if (playerBalances[playerIndex] >= 50) {
        bool payToMove = await _askToPayToMove(playerIndex);
        if (payToMove) {
          setState(() {
            playerBalances[playerIndex] -= 50;
            playerPositions[playerIndex] =
                (playerPositions[playerIndex] + roll) % boardSize;
          });
        } else {
          skipTurns[playerIndex] = true;
        }
      } else if (roll == 6) {
        setState(() {
          playerPositions[playerIndex] =
              (playerPositions[playerIndex] + roll) % boardSize;
        });
      } else {
        skipTurns[playerIndex] = true;
      }

      setState(() {
        currentPlayerIndex = (currentPlayerIndex + 1) % numberOfPlayers;
      });
      return;
    }

    setState(() {
      playerPositions[playerIndex] =
          (playerPositions[playerIndex] + roll) % boardSize;
    });

    // Check if landed on owned property
    int owner = ownership[playerPositions[playerIndex]];
    if (owner > 0 && owner != playerIndex + 1) {
      int rent = 100; // Base rent
      setState(() {
        playerBalances[playerIndex] -= rent;
        playerBalances[owner - 1] += rent;
      });

      if (playerBalances[playerIndex] <= 0) {
        _showGameOverDialog("Player ${owner} wins!");
        return;
      }
    }

    // Check if property can be bought
    if (ownership[playerPositions[playerIndex]] == 0 &&
        ownableTiles.contains(playerPositions[playerIndex])) {
      await _askToBuyLand(playerPositions[playerIndex], playerIndex);
    }

    // Check for bankrupt players
    for (int i = 0; i < numberOfPlayers; i++) {
      if (playerBalances[i] <= 0) {
        _showGameOverDialog(
          "Player ${(currentPlayerIndex + 1) % numberOfPlayers + 1} wins!",
        );
        return;
      }
    }

    setState(() {
      currentPlayerIndex = (currentPlayerIndex + 1) % numberOfPlayers;
    });
  }

  Widget _buildPlayerButton(int playerIndex, double tileSize) {
    final bool isCurrent = currentPlayerIndex == playerIndex;
    final Color baseColor = playerColors[playerIndex];
    final Color backgroundColor =
        isCurrent ? baseColor : baseColor.withOpacity(0.6);

    return Container(
      margin: const EdgeInsets.all(6),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(40),
        boxShadow: [
          BoxShadow(
            color: baseColor.withOpacity(0.4),
            blurRadius: isCurrent ? 10 : 5,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: ElevatedButton(
        onPressed: () => rollDice(playerIndex),
        style: ElevatedButton.styleFrom(
          backgroundColor: backgroundColor,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(40),
          ),
          padding: EdgeInsets.symmetric(vertical: 10, horizontal: tileSize / 3),
          elevation: isCurrent ? 8 : 2,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              playerEmojis[playerIndex], // Emoji token
              style: TextStyle(
                fontSize: 40, // Adjust size for better visibility
                color: Colors.blue, // Change color to suit your theme
                fontWeight: FontWeight.bold,
              ),
            ),

            const SizedBox(width: 8),
            Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Player ${playerIndex + 1}',
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                Text(
                  '\$${playerBalances[playerIndex]}',
                  style: const TextStyle(fontSize: 12, color: Colors.white70),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _startGameTimer() {
    gameStartTime = DateTime.now();
    timeLeft = const Duration(minutes: 15);

    gameTimer = Timer(const Duration(minutes: 15), _endGameByTimer);

    displayTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      final secondsPassed = DateTime.now().difference(gameStartTime);
      final remaining = const Duration(minutes: 15) - secondsPassed;

      if (remaining.isNegative) {
        timer.cancel();
      } else {
        setState(() {
          timeLeft = remaining;
        });
      }
    });
  }

  void _endGameByTimer() {
    int maxBalance = playerBalances.reduce(max);
    List<int> winners = [];
    for (int i = 0; i < numberOfPlayers; i++) {
      if (playerBalances[i] == maxBalance) {
        winners.add(i + 1);
      }
    }

    String result;
    if (winners.length == 1) {
      result = "Time's up! Player ${winners[0]} wins with \$$maxBalance!";
    } else {
      result =
          "Time's up! It's a tie between players ${winners.join(' and ')}!";
    }

    _showGameOverDialog(result);
  }

  @override
  void dispose() {
    gameTimer.cancel();
    displayTimer.cancel();
    super.dispose();
  }

  Future<void> _selectBoardStyle() async {
    String? style = await showDialog<String>(
      context: context,
      builder:
          (context) => AlertDialog(
            title: const Text("Choose Board Style"),
            content: SingleChildScrollView(
              child: Column(
                children:
                    boardStyles.entries.map((entry) {
                      return GestureDetector(
                        onTap: () {
                          Navigator.pop(context, entry.key);
                        },
                        child: Card(
                          margin: const EdgeInsets.symmetric(vertical: 8),
                          elevation: 5,
                          color: boardStyles[entry.key],
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Center(
                              child: Text(
                                entry.key,
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ),
                        ),
                      );
                    }).toList(),
              ),
            ),
          ),
    );

    if (style != null && boardStyles.containsKey(style)) {
      setState(() {
        selectedStyle = style;
      });
    }
  }

  final Map<int, int> tileCost = {
    1: 60,
    3: 60,
    5: 200,
    6: 100,
    8: 100,
    9: 120,
    11: 140,
    12: 150,
    13: 140,
    14: 160,
    15: 200,
    16: 180,
    18: 180,
    19: 200,
    21: 220,
    23: 220,
    24: 240,
    25: 200,
    26: 260,
    27: 260,
    28: 150,
    29: 280,
    31: 300,
    32: 300,
    34: 320,
    35: 200,
    37: 350,
    39: 400,
  };

  Future<void> _askToBuyLand(int tileIndex, int playerIndex) async {
    int cost = tileCost[tileIndex] ?? 200;
    int playerBalance = playerBalances[playerIndex];

    // Prevent the dialog if the player can't afford the tile
    if (playerBalance < cost) {
      await showDialog(
        context: context,
        builder:
            (context) => AlertDialog(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              backgroundColor: const Color(0xFFFFF3F0),
              title: Row(
                children: const [
                  Icon(Icons.warning_amber_rounded, color: Color(0xFFD32F2F)),
                  SizedBox(width: 8),
                  Text(
                    "Not Enough Funds!",
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 20,
                      color: Color(0xFFB71C1C),
                    ),
                  ),
                ],
              ),
              content: Text(
                "Player ${playerIndex + 1} has only \$${playerBalance} and cannot afford \$${cost}.",
                style: const TextStyle(fontSize: 16),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text(
                    "OK",
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
      );
      return;
    }

    // Show styled buy dialog
    bool shouldBuy = await _showBuyDialog(
      tileNames[tileIndex],
      cost,
      playerIndex,
    );

    if (shouldBuy) {
      setState(() {
        ownership[tileIndex] = playerIndex + 1; // Players are numbered 1-4
        playerBalances[playerIndex] -= cost;
      });
    }
  }

  Future<bool> _showBuyDialog(
    String tileName,
    int cost,
    int playerIndex,
  ) async {
    return await showDialog<bool>(
          context: context,
          barrierDismissible: false,
          builder:
              (context) => AlertDialog(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
                backgroundColor: const Color(0xFFF1F6FF),
                title: Row(
                  children: [
                    const Icon(Icons.shopping_cart, color: Color(0xFF6A5AE0)),
                    const SizedBox(width: 8),
                    Text(
                      "Player ${playerIndex + 1}: Buy $tileName?",
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 20,
                        color: Color(0xFF333366),
                      ),
                    ),
                  ],
                ),
                content: Text(
                  "This tile costs \$$cost.\nDo you want to purchase it?",
                  style: const TextStyle(
                    fontSize: 16,
                    color: Color(0xFF444444),
                  ),
                ),
                actions: [
                  TextButton(
                    onPressed: () => Navigator.pop(context, true),
                    style: TextButton.styleFrom(
                      backgroundColor: const Color(0xFF4CAF50),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 10,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: const Text(
                      "Yes",
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  TextButton(
                    onPressed: () => Navigator.pop(context, false),
                    style: TextButton.styleFrom(
                      backgroundColor: const Color(0xFFD32F2F),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 10,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: const Text(
                      "No",
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
        ) ??
        false;
  }

  Future<bool> _askToPayToMove(int playerIndex) async {
    return await showDialog<bool>(
          context: context,
          barrierDismissible: false,
          builder:
              (context) => AlertDialog(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
                backgroundColor: const Color(0xFFEFF3FF),
                title: Row(
                  children: [
                    const Icon(Icons.lock, color: Color(0xFF6A5AE0)),
                    const SizedBox(width: 8),
                    Text(
                      "Player ${playerIndex + 1}: In Jail!",
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 20,
                        color: Color(0xFF333366),
                      ),
                    ),
                  ],
                ),
                content: const Text(
                  "Pay \$50 to get out of jail?",
                  style: TextStyle(fontSize: 16, color: Color(0xFF444444)),
                ),
                actions: [
                  TextButton(
                    onPressed: () => Navigator.pop(context, true),
                    style: TextButton.styleFrom(
                      backgroundColor: const Color(0xFF4CAF50),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 10,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: const Text(
                      "Yes",
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  TextButton(
                    onPressed: () => Navigator.pop(context, false),
                    style: TextButton.styleFrom(
                      backgroundColor: const Color(0xFFD32F2F),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 10,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: const Text(
                      "No",
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
        ) ??
        false;
  }

  Future<void> _showGameOverDialog(String result) async {
    await showDialog(
      context: context,
      barrierDismissible: false, // prevent accidental dismissal
      builder:
          (context) => AlertDialog(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            backgroundColor: const Color(0xFFF0F4FF),
            title: Row(
              children: const [
                Icon(Icons.flag, color: Color(0xFF6A5AE0)),
                SizedBox(width: 8),
                Text(
                  "Game Over!",
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 22,
                    color: Color(0xFF333366),
                  ),
                ),
              ],
            ),
            content: Text(
              result,
              style: const TextStyle(fontSize: 18, color: Color(0xFF4B4B4B)),
            ),
            actions: [
              TextButton(
                style: TextButton.styleFrom(
                  backgroundColor: const Color(0xFF6A5AE0),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 12,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                onPressed: () {
                  Navigator.pop(context);
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => HomePage()),
                  );
                },
                child: const Text(
                  "OK",
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ),
            ],
          ),
    );
  }

  final List<String> tileEmojis = [
    "🏁",
    "🏘️",
    "🎁",
    "🏚️",
    "💰",
    "🚂",
    "🏢",
    "❓",
    "🌲",
    "🏡",
    "🚔",
    "⛪",
    "⚡",
    "🏤",
    "🏠",
    "🚂",
    "🏬",
    "🎁",
    "🏙️",
    "🏙️",
    "🅿️",
    "🏨",
    "❓",
    "🏭",
    "🏦",
    "🚂",
    "🏘️",
    "🏘️",
    "💧",
    "🌇",
    "🚔",
    "🌴",
    "🏛️",
    "🎁",
    "🏛️",
    "🚂",
    "❓",
    "🏰",
    "💸",
    "🎢",
  ];

  Widget buildTile(int index, double tileSize) {
  final tileColor =
      ownership[index] > 0
          ? playerColors[ownership[index] - 1].withOpacity(0.3)
          : boardStyles[selectedStyle] ?? Colors.green[100];

  return Container(
    margin: const EdgeInsets.all(1),
    decoration: BoxDecoration(
      color: tileColor,
      border: Border.all(color: Colors.black12),
      borderRadius: BorderRadius.circular(5),
      boxShadow: [
        BoxShadow(
          color: Colors.black.withOpacity(0.2), // Shadow color with opacity
          blurRadius: 8, // Softens the shadow
          spreadRadius: 2, // Extends the shadow
          offset: Offset(2, 4), // X and Y offset for the shadow
        ),
      ],
    ),
    child: AspectRatio(
      aspectRatio: 0.7,
      child: Stack(
        children: [
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Text(
                  tileEmojis[index],
                  style: TextStyle(fontSize: tileSize / 2),
                ),
                const SizedBox(height: 12),
                Flexible(
                  child: FittedBox(
                    fit: BoxFit.scaleDown,
                    child: Text(
                      tileNames[index],
                      textAlign: TextAlign.center,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: tileSize / 1,
                        color: ownership[index] > 0
                            ? playerColors[ownership[index] - 1]
                            : const Color.fromARGB(
                                255,
                                255,
                                255,
                                255,
                              ), // Set text color based on ownership or default to white
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          // Add player icons to the tile
          for (int i = 0; i < numberOfPlayers; i++)
            if (playerPositions[i] == index)
              Positioned(
                left: 5 + (i % 2) * (tileSize / 2 - 10),
                top: 5 + (i ~/ 2) * (tileSize / 2 - 10),
                child: Text(
                  playerEmojis[i], // Emoji token
                  style: TextStyle(
                    fontSize: 30, // Adjust size for better visibility
                    color: Colors.blue, // Change color to suit your theme
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
        ],
      ),
    ),
  );
}


  Widget buildBoard(double tileSize) {
    return Stack(
      children: [
        Column(
          children: [
            Row(
              children: List.generate(
                11,
                (i) => Expanded(
                  child: RotatedBox(
                    quarterTurns: 2,
                    child: buildTile(i, tileSize),
                  ),
                ),
              ),
            ),
            Expanded(
              child: Row(
                children: [
                  Column(
                    children: List.generate(
                      9,
                      (i) => Expanded(
                        child: RotatedBox(
                          quarterTurns: 1,
                          child: buildTile(39 - i, tileSize),
                        ),
                      ),
                    ),
                  ),
                  Expanded(
                    child: Container(
                      color: boardStyles[selectedStyle],
                      child: Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              selectedStyle,
                              style: const TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                color: Colors.black87,
                              ),
                            ),
                            const SizedBox(height: 100),
                            Text(
                              "Current Player: ${currentPlayerIndex + 1}",
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                color: playerColors[currentPlayerIndex],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  Column(
                    children: List.generate(
                      9,
                      (i) => Expanded(
                        child: RotatedBox(
                          quarterTurns: 3,
                          child: buildTile(11 + i, tileSize),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Row(
              children: List.generate(
                11,
                (i) => Expanded(child: buildTile(30 - i, tileSize)),
              ),
            ),
          ],
        ),
        // Player buttons at the edges
        // Top edge buttons (Player 1)
        if (numberOfPlayers >= 1)
          Positioned(
            top: 100,
            left: 0,
            right: 0,
            child: Center(
              child: RotatedBox(
                quarterTurns: 2,
                child: _buildPlayerButton(0, tileSize),
              ),
            ),
          ),

        // Right edge buttons (Player 2)
        if (numberOfPlayers >= 2)
          Positioned(
            right: 100,
            top: 0,
            bottom: 0,
            child: Center(
              child: RotatedBox(
                quarterTurns: 3,
                child: _buildPlayerButton(1, tileSize),
              ),
            ),
          ),

        // Bottom edge buttons (Player 3)
        if (numberOfPlayers >= 3)
          Positioned(
            bottom: 100,
            left: 0,
            right: 0,
            child: Center(child: _buildPlayerButton(2, tileSize)),
          ),

        // Left edge buttons (Player 4)
        if (numberOfPlayers >= 4)
          Positioned(
            left: 100,
            top: 0,
            bottom: 0,
            child: Center(
              child: RotatedBox(
                quarterTurns: 1,
                child: _buildPlayerButton(3, tileSize),
              ),
            ),
          ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;
    double screenHeight = MediaQuery.of(context).size.height;
    double tileSize = min(screenWidth, screenHeight) / 12;

    return Scaffold(
      appBar: AppBar(title: const Header()),
      body: Container(
        color: const Color.fromARGB(255, 255, 255, 255),
        child: Column(
          children: [
            Expanded(
              child: Center(
                child: AspectRatio(
                  aspectRatio: 1,
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      buildBoard(tileSize),
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.85),
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: const [
                            BoxShadow(
                              color: Colors.black26,
                              blurRadius: 8,
                              offset: Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Text(
                          '⏱️ ${timeLeft.inMinutes.remainder(60).toString().padLeft(2, '0')}:${(timeLeft.inSeconds.remainder(60)).toString().padLeft(2, '0')}',
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Color.fromARGB(255, 61, 105, 128),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 10),
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 500),
              transitionBuilder: (child, animation) {
                return FadeTransition(
                  opacity: animation,
                  child: ScaleTransition(scale: animation, child: child),
                );
              },
              child: Container(
                key: ValueKey<int>(lastRoll),
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 12,
                ),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF8EC5FC), Color(0xFFE0C3FC)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: const [
                    BoxShadow(
                      color: Colors.black26,
                      blurRadius: 8,
                      offset: Offset(0, 4),
                    ),
                  ],
                ),
                child: Text(
                  '🎲 $lastRoll',
                  style: const TextStyle(
                    fontSize: 36,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                    shadows: [
                      Shadow(
                        color: Colors.black45,
                        blurRadius: 4,
                        offset: Offset(1, 2),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            Padding(
              padding: const EdgeInsets.symmetric(vertical: 16),
              child: TextButton.icon(
                onPressed: _selectBoardStyle,
                icon: const Icon(Icons.brush, color: Colors.white),
                label: const Text(
                  "Change Board Style",
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                style: TextButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 14,
                  ),
                  backgroundColor: const Color(0xFF6A5AE0),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  elevation: 4,
                  shadowColor: Colors.black45,
                ),
              ),
            ),
            const SizedBox(height: 100),
          ],
        ),
      ),
    );
  }
}
