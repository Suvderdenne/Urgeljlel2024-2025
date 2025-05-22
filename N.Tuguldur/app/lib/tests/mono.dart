import 'dart:async';
import 'package:app/tests/Profile.dart';
import 'package:flutter/material.dart';
import 'dart:math';
import 'home.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

void main() => runApp(const MonopolyGame());

class MonopolyGame extends StatelessWidget {
  const MonopolyGame({super.key});

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
    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 18),
    decoration: BoxDecoration(
      color: const Color.fromARGB(255, 47, 4, 147),
      borderRadius: const BorderRadius.only(
        bottomLeft: Radius.circular(24),
        bottomRight: Radius.circular(24),
      ),
      boxShadow: const [
        BoxShadow(
          color: Colors.black26,
          blurRadius: 10,
          offset: Offset(0, 6),
        ),
      ],
    ),
    child: Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Expanded(
          child: Text(
            firstname != null ? "Hello, $firstname 👋" : "Welcome!",
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: Colors.white,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ),
        Tooltip(
          message: 'Go to Home',
          child: IconButton(
            icon: const Icon(
              Icons.home_rounded,
              size: 30,
              color: Colors.white,
            ),
            onPressed: () {
              showDialog(
  context: context,
  builder: (BuildContext context) {
    return AlertDialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      title: const Text(
        'Leave Game?',
        style: TextStyle(
          fontWeight: FontWeight.bold,
          fontSize: 20,
        ),
      ),
      content: const Text(
        'Your current game progress will be lost.\nAre you sure you want to return to the Home page?',
        style: TextStyle(fontSize: 16),
      ),
      actionsPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          style: TextButton.styleFrom(
            foregroundColor: Colors.grey[700],
            textStyle: const TextStyle(fontWeight: FontWeight.w500),
          ),
          child: const Text('Cancel'),
        ),
        TextButton(
          onPressed: () {
            Navigator.of(context).pop();
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => HomePage()),
            );
          },
          style: TextButton.styleFrom(
            foregroundColor: Colors.deepPurple,
            textStyle: const TextStyle(fontWeight: FontWeight.bold),
          ),
          child: const Text('Yes'),
        ),
      ],
    );
  },
);

            },
          ),
        ),
      ],
    ),
  );
}

}

class _MonopolyBoardState extends State<MonopolyBoard> {
  final int boardSize = 40;
  int playerPosition = 0;
  int botPosition = 0;
  int lastRoll = 1;
  int playerBalance = 1000;
  int botBalance = 1000;
  bool isPlayerTurn = true;
  bool skipPlayerTurn = false;
  bool skipBotTurn = false;
  final List<String> iconOptions = [
    '👤', // Person emoji
    '🚗', // Car emoji
    '🐾', // Pets emoji
    '✈️', // Airplane emoji
    '🎰', // Casino emoji
  ];

  String playerIcon = '👤'; // Default player emoji
  String botIcon = '🤖'; // Bot emoji

  final Map<String, Color> boardStyles = {
    'Classic': const Color.fromARGB(255, 218, 140, 52),
    'Neo Mode': const Color.fromARGB(255, 169, 47, 207),
    'Ocean Blue': const Color.fromARGB(255, 10, 137, 196)!,
    'Sunset': const Color.fromARGB(255, 230, 140, 3)!,
  };
  late DateTime gameStartTime;
  late Timer gameTimer;
  late Timer displayTimer;
  Duration timeLeft = const Duration(minutes: 15);

  String selectedStyle = 'Classic';

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
    "START", // 0
    "SUNSET", // 1
    "REWARDS", // 2
    "BEACH", // 3
    "TAX", // 4
    "RAIL", // 5
    "VILLA", // 6
    "CARD", // 7
    "HOTEL", // 8
    "MAPLE", // 9
    "JAIL", // 10
    "PALACE", // 11
    "POWER", // 12
    "CITY", // 13
    "VICTORIA", // 14
    "RAIL", // 15
    "SUITE", // 16
    "INVEST", // 17
    "SKY", // 18
    "URBAN", // 19
    "PARK", // 20
    "TOWERS", // 21
    "MYSTERY", // 22
    "HALL", // 23
    "HOTEL", // 24
    "RAIL", // 25
    "BLUE", // 26
    "HARBOR", // 27
    "UTILITY", // 28
    "TROPIC", // 29
    "JAIL", // 30
    "PACIFIC", // 31
    "NORTH", // 32
    "REWARDS", // 33
    "PENN", // 34
    "RAIL", // 35
    "LUCK", // 36
    "PARK", // 37
    "TAX", // 38
    "VIEW", // 39
  ];

  Future<void> rollDice() async {
    if (!isPlayerTurn && skipBotTurn) {
      skipBotTurn = false;
      isPlayerTurn = true;
      setState(() {});
      return;
    }

    if (isPlayerTurn && skipPlayerTurn) {
      skipPlayerTurn = false;
      isPlayerTurn = false;
      setState(() {});
      await Future.delayed(const Duration(seconds: 1));
      rollDice();
      return;
    }

    final roll = Random().nextInt(6) + 1;
    lastRoll = roll;

    if (isPlayerTurn && playerPosition == 10) {
      if (playerBalance >= 50) {
        bool payToMove = await _askToPayToMove();
        if (payToMove) {
          playerBalance -= 50;
          playerPosition = (playerPosition + roll) % boardSize;
        }
      } else if (roll == 6) {
        playerPosition = (playerPosition + roll) % boardSize;
      } else {
        skipPlayerTurn = true;
      }
      isPlayerTurn = false;
      setState(() {});
      return;
    }

    if (isPlayerTurn) {
      playerPosition = (playerPosition + roll) % boardSize;

      if (ownership[playerPosition] == 2) {
        playerBalance -= 100;
        botBalance += 100;
        skipPlayerTurn = true;
      }

      if (ownership[playerPosition] == 0 &&
          ownableTiles.contains(playerPosition)) {
        await _askToBuyLand(playerPosition);
      }

      isPlayerTurn = false;
      setState(() {});

      await Future.delayed(const Duration(seconds: 1));
      rollDice();
    } else {
      botPosition = (botPosition + roll) % boardSize;

      if (ownership[botPosition] == 1) {
        botBalance -= 100;
        playerBalance += 100;
        skipBotTurn = true;
      }

      final tileCost = {
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

      if (ownership[botPosition] == 0 && ownableTiles.contains(botPosition)) {
        int cost = tileCost[botPosition] ?? 200;
        int safetyBalance = 300;
        bool isCheapTile =
            botPosition <= 10 || [5, 15, 25, 35, 12, 28].contains(botPosition);
        bool isFeelingLucky = Random().nextBool();

        if ((botBalance - cost >= safetyBalance || isCheapTile) &&
            isFeelingLucky) {
          ownership[botPosition] = 2;
          botBalance -= cost;
        }
      }

      isPlayerTurn = true;
      setState(() {});

      if (playerBalance <= 0) {
        _showGameOverDialog("Bot wins!");
      } else if (botBalance <= 0) {
        _showGameOverDialog("Player wins!");
      }
    }
  }

  @override
  void initState() {
    super.initState();
    Future.delayed(Duration.zero, () async {
      await _selectBoardStyle();
      await _selectPlayerIcon();
      _startGameTimer();
    });
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
    String result;

    if (playerBalance > botBalance) {
      result = "Time's up! Player wins with \$${playerBalance}!";
    } else if (botBalance > playerBalance) {
      result = "Time's up! Bot wins with \$${botBalance}!";
    } else {
      result = "Time's up! It's a tie!";
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


  Future<void> _selectPlayerIcon() async {
    String? selectedIcon = await showDialog<String>(
      context: context,
      builder:
          (context) => AlertDialog(
            title: const Text(
              "Select Your Icon",
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children:
                  iconOptions.map((emoji) {
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8.0),
                      child: InkWell(
                        onTap: () {
                          Navigator.pop(context, emoji);
                        },
                        child: Container(
                          decoration: BoxDecoration(
                            color: const Color.fromARGB(255, 83, 91, 105),
                            borderRadius: BorderRadius.circular(12),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black26,
                                blurRadius: 6,
                                offset: Offset(0, 4),
                              ),
                            ],
                          ),
                          padding: const EdgeInsets.all(12),
                          child: Text(
                            emoji,
                            style: TextStyle(
                              fontSize: 40,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    );
                  }).toList(),
            ),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.pop(
                    context,
                  ); // Close the dialog without selecting an emoji
                },
                child: const Text("Cancel"),
              ),
            ],
          ),
    );

    if (selectedIcon != null) {
      setState(() {
        playerIcon = selectedIcon; // Store the selected emoji
      });
    }
  }

  final tileCost = {
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
  final List<String> tileEmojis = [
    "🏁", // GO
    "🏘️", // Mediterranean Avenue
    "🎁", // Community Chest
    "🏚️", // Baltic Avenue
    "💰", // Tax
    "🚂", // Reading Railroad
    "🏢", // Oriental Avenue
    "❓", // Chance
    "🌲", // Vermont Avenue
    "🏡", // Connecticut Avenue
    "🚔", // Jail
    "⛪", // St. Charles Place
    "⚡", // Electric Company
    "🏤", // States Avenue
    "🏠", // Virginia Avenue
    "🚂", // Pennsylvania Railroad
    "🏬", // St. James Place
    "🎁", // Community Chest
    "🏙️", // Tennessee Avenue
    "🏙️", // New York Avenue
    "🅿️", // Free Parking
    "🏨", // Kentucky Avenue
    "❓", // Chance
    "🏭", // Indiana Avenue
    "🏦", // Illinois Avenue
    "🚂", // B&O Railroad
    "🏘️", // Atlantic Avenue
    "🏘️", // Ventnor Avenue
    "💧", // Water Works
    "🌇", // Marvin Gardens
    "🚔", // Jail again (visiting)
    "🌴", // Pacific Avenue
    "🏛️", // North Carolina Avenue
    "🎁", // Community Chest
    "🏛️", // Pennsylvania Avenue
    "🚂", // Short Line
    "❓", // Chance
    "🏰", // Park Place
    "💸", // Luxury Tax
    "🎢", // Boardwalk
  ];
  Future<void> _askToBuyLand(int tileIndex) async {
  int cost = tileCost[tileIndex] ?? 200;

  // Show buy dialog with styled UI
  bool shouldBuy = await _showBuyDialog(tileNames[tileIndex], cost);

  if (shouldBuy) {
    setState(() {
      ownership[tileIndex] = 1; // Set ownership to the current player (1 for Player 1)
      playerBalance -= cost; // Deduct cost from player's balance
    });
  }
}


  Future<bool> _showBuyDialog(String tileName, int cost) async {
  return await showDialog<bool>(
    context: context,
    builder: (context) => AlertDialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16.0), // Rounded corners for dialog
      ),
      backgroundColor: Colors.white, // Dialog background color
      title: Text(
        "Buy $tileName?",
        style: TextStyle(
          fontSize: 22, // Larger font for the title
          fontWeight: FontWeight.bold, // Bold title for emphasis
          color: Colors.green, // Color that matches a buying theme
        ),
      ),
      content: Text(
        "This tile costs \$$cost. Do you want to purchase it?",
        style: TextStyle(
          fontSize: 18, // Slightly smaller font for the content
          color: Colors.black87, // Readable color for the content
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context, true),
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
            decoration: BoxDecoration(
              color: Colors.green, // Green button for buying
              borderRadius: BorderRadius.circular(8), // Rounded corners for the button
            ),
            child: Text(
              "Yes",
              style: TextStyle(
                fontSize: 18, // Font size for the button text
                fontWeight: FontWeight.bold,
                color: Colors.white, // White text for contrast
              ),
            ),
          ),
        ),
        TextButton(
          onPressed: () => Navigator.pop(context, false),
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
            decoration: BoxDecoration(
              color: Colors.redAccent, // Red button for cancel action
              borderRadius: BorderRadius.circular(8), // Rounded corners for the button
            ),
            child: Text(
              "No",
              style: TextStyle(
                fontSize: 18, // Font size for the button text
                fontWeight: FontWeight.bold,
                color: Colors.white, // White text for contrast
              ),
            ),
          ),
        ),
      ],
    ),
  ) ??
  false;
}


  Future<bool> _askToPayToMove() async {
  return await showDialog<bool>(
    context: context,
    builder: (context) => AlertDialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16.0), // Rounded corners for dialog
      ),
      backgroundColor: Colors.white, // Dialog background color
      title: Text(
        "You are in Jail!",
        style: TextStyle(
          fontSize: 22, // Larger font for the title
          fontWeight: FontWeight.bold, // Bold title for emphasis
          color: Colors.orangeAccent, // Color that matches the theme
        ),
      ),
      content: Text(
        "Pay 50 to get out of jail?",
        style: TextStyle(
          fontSize: 18, // Slightly smaller font for the content
          color: Colors.black87, // Readable color for the content
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context, true),
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
            decoration: BoxDecoration(
              color: Colors.green, // Green button to indicate action
              borderRadius: BorderRadius.circular(8), // Rounded corners for the button
            ),
            child: Text(
              "Yes",
              style: TextStyle(
                fontSize: 18, // Font size for the button text
                fontWeight: FontWeight.bold,
                color: Colors.white, // White text for contrast
              ),
            ),
          ),
        ),
        TextButton(
          onPressed: () => Navigator.pop(context, false),
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
            decoration: BoxDecoration(
              color: Colors.redAccent, // Red button for cancel action
              borderRadius: BorderRadius.circular(8), // Rounded corners for the button
            ),
            child: Text(
              "No",
              style: TextStyle(
                fontSize: 18, // Font size for the button text
                fontWeight: FontWeight.bold,
                color: Colors.white, // White text for contrast
              ),
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
    builder: (context) => AlertDialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16.0), // Rounded corners
      ),
      backgroundColor: Colors.white, // Background color for the dialog
      title: Text(
        "Game Over!",
        style: TextStyle(
          fontSize: 24, // Title font size
          fontWeight: FontWeight.bold, // Bold for emphasis
          color: Colors.redAccent, // Red color for game-over theme
        ),
      ),
      content: Text(
        result,
        style: TextStyle(
          fontSize: 18, // Content font size
          color: Colors.black87, // Dark color for better readability
        ),
      ),
      actions: [
        TextButton(
          onPressed: () {
            Navigator.pop(context);
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => HomePage()),
            );
          },
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
            decoration: BoxDecoration(
              color: Colors.blueAccent, // Blue background for the button
              borderRadius: BorderRadius.circular(8), // Rounded corners for button
            ),
            child: Text(
              "OK",
              style: TextStyle(
                fontSize: 18, // Button text size
                fontWeight: FontWeight.bold,
                color: Colors.white, // White text for contrast
              ),
            ),
          ),
        ),
      ],
    ),
  );
}


  Widget buildTile(int index, double tileSize) {
  // Define tile background color based on ownership and style
  final tileColor = ownership[index] == 1
      ? Colors.blue[200]
      : ownership[index] == 2
          ? Colors.red[200]
          : boardStyles[selectedStyle] ?? Colors.green[100];

  return Container(
    margin: const EdgeInsets.all(1), // Slightly increased margin for spacing
    decoration: BoxDecoration(
      color: tileColor,
      borderRadius: BorderRadius.circular(5), // Rounded corners for a modern look
      boxShadow: [
        BoxShadow(
          color: Colors.black26,
          blurRadius: 8,
          offset: Offset(0, 4), // Subtle shadow effect
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
                // Display emoji with adjustable font size
                Text(
                  tileEmojis[index],
                  style: TextStyle(
                    fontSize: tileSize / 2, // Larger emoji size
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8), // Increased spacing between emoji and tile name
                Flexible(
                  child: FittedBox(
                    fit: BoxFit.scaleDown, // Adjust text size to fit
                    child: Text(
                      tileNames[index],
                      textAlign: TextAlign.center,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: tileSize / 3, // Adjusted font size for better readability
                        color: const Color.fromARGB(221, 255, 255, 255), // More visible text color
                        fontWeight: FontWeight.w600, // Bold text for emphasis
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          // Animated player position with stylish transition
          AnimatedSwitcher(
            duration: const Duration(milliseconds: 300),
            transitionBuilder: (child, animation) => FadeTransition(
              opacity: animation,
              child: SlideTransition(
                position: Tween<Offset>(
                  begin: const Offset(0.0, -0.2),
                  end: Offset.zero,
                ).animate(animation),
                child: child,
              ),
            ),
            child: playerPosition == index
                ? Positioned(
                    left: tileSize / 4,
                    top: tileSize / 4,
                    child: Text(
                      playerIcon, // Player emoji
                      style: TextStyle(
                        fontSize: tileSize / 2,
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  )
                : const SizedBox.shrink(),
          ),
          // Animated bot position with stylish transition
          AnimatedSwitcher(
            duration: const Duration(milliseconds: 300),
            transitionBuilder: (child, animation) => FadeTransition(
              opacity: animation,
              child: SlideTransition(
                position: Tween<Offset>(
                  begin: const Offset(0.0, -0.2),
                  end: Offset.zero,
                ).animate(animation),
                child: child,
              ),
            ),
            child: botPosition == index
                ? Positioned(
                    right: tileSize / 4,
                    bottom: tileSize / 4,
                    child: Text(
                      botIcon, // Bot emoji
                      style: TextStyle(
                        fontSize: tileSize / 2,
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  )
                : const SizedBox.shrink(),
          ),
        ],
      ),
    ),
  );
}


  Widget buildBoard(double tileSize) {
    return Column(
      children: [
        Row(
          children: List.generate(
            11,
            (i) => Expanded(child: buildTile(i, tileSize)),
          ),
        ),

        Expanded(
          child: Row(
            children: [
              // LEFT SIDE (rotate 270° or -90°)
              Column(
                children: List.generate(
                  9,
                  (i) => Expanded(
                    child: RotatedBox(
                      quarterTurns: 3,
                      child: buildTile(39 - i, tileSize),
                    ),
                  ),
                ),
              ),

              // CENTER
              Expanded(
                child: Container(
                  color: boardStyles[selectedStyle],
                  child: Center(
                    child: Text(
                      selectedStyle,
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                    ),
                  ),
                ),
              ),

              // RIGHT SIDE (rotate 90°)
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
    );
  }

  @override
Widget build(BuildContext context) {
  double screenWidth = MediaQuery.of(context).size.width;
  double screenHeight = MediaQuery.of(context).size.height;
  double tileSize = min(screenWidth, screenHeight) / 12;

  return Scaffold(
    appBar: AppBar(
      title: Header(),
      backgroundColor: Colors.deepPurple[600], // Set app bar color
    ),
    body: Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [const Color.fromARGB(255, 44, 120, 207), const Color.fromARGB(255, 201, 65, 154)!],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Column(
        children: [
          Expanded(
            child: Center(
              child: AspectRatio(
                aspectRatio: 1,
                child: buildBoard(tileSize),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8.0),
            child: Text(
              '⏱️ Time Left: ${timeLeft.inMinutes.remainder(60).toString().padLeft(2, '0')}:${(timeLeft.inSeconds.remainder(60)).toString().padLeft(2, '0')}',
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ),
          const SizedBox(height: 10),
          AnimatedSwitcher(
            duration: const Duration(milliseconds: 400),
            transitionBuilder: (child, animation) => ScaleTransition(scale: animation, child: child),
            child: Text(
              '🎲 $lastRoll',
              key: ValueKey<int>(lastRoll),
              style: const TextStyle(
                fontSize: 34,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: rollDice,
            style: ElevatedButton.styleFrom(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 40),
              elevation: 10,
            ),
            child: const Text(
              'Roll Dice',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color.fromARGB(255, 192, 22, 22)),
            ),
          ),
          const SizedBox(height: 20),
          TextButton(
            onPressed: _selectBoardStyle,
            child: const Text(
              "Change Board Style",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w500,
                color: Colors.deepPurple,
              ),
            ),
          ),
          const SizedBox(height: 20),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 4.0),
            child: Column(
              children: [
                Text(
                  'Player: ${tileNames[playerPosition]} | Balance: \$${playerBalance}',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Bot: ${tileNames[botPosition]} | Balance: \$${botBalance}',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: Colors.redAccent,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 30),
          IconButton(
            icon: const Icon(
              Icons.person_2_outlined,
              size: 32,
              color: Colors.black54,
            ),
            onPressed: () {
              showDialog(
                context: context,
                builder: (context) => Dialog(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: SizedBox(
                    width: 300,
                    height: 400,
                    child: ProfilePage(),
                  ),
                ),
              );
            },
          ),
        ],
      ),
    ),
  );
}


}
