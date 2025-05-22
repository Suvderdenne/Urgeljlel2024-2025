import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:math';

void main() {
  runApp(const DinoRunGame());
}

class DinoRunGame extends StatelessWidget {
  const DinoRunGame({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '4-Player Dino Run',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const GameScreen(),
    );
  }
}

class GameScreen extends StatefulWidget {
  const GameScreen({super.key});

  @override
  State<GameScreen> createState() => _GameScreenState();
}

class _GameScreenState extends State<GameScreen> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;
  
  // Game state
  bool _isGameStarted = false;
  bool _isGameOver = false;
  double _speed = 0.0;
  double _distance = 0.0;
  
  // Players
  final List<Player> _players = [
    Player(yPosition: 0.2, color: Colors.red, key: 'Arrow Up'),
    Player(yPosition: 0.4, color: Colors.blue, key: 'Key W'),
    Player(yPosition: 0.6, color: Colors.green, key: 'Key I'),
    Player(yPosition: 0.8, color: Colors.purple, key: 'Key 8'),
  ];
  
  // Obstacles
  final List<Obstacle> _obstacles = [];
  final Random _random = Random();
  int _nextObstacleTime = 0;
  
  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 16),
      vsync: this,
    )..addListener(_updateGame);
    
    _animation = Tween<double>(begin: 0, end: 1).animate(_controller);
    
    // Start the game animation loop
    _controller.repeat();
  }
  
  void _updateGame() {
    if (!_isGameStarted || _isGameOver) return;
    
    setState(() {
      // Update game speed and distance
      _speed += 0.0005;
      _distance += _speed;
      
      // Move obstacles
      for (var obstacle in _obstacles) {
        obstacle.x -= _speed * 10;
      }
      
      // Remove off-screen obstacles
      _obstacles.removeWhere((obstacle) => obstacle.x < -0.1);
      
      // Add new obstacles
      _nextObstacleTime--;
      if (_nextObstacleTime <= 0) {
        _obstacles.add(Obstacle(
          x: 1.1,
          height: _random.nextDouble() * 0.1 + 0.05,
          y: _random.nextDouble() * 0.8 + 0.1,
        ));
        _nextObstacleTime = _random.nextInt(50) + 30;
      }
      
      // Update players
      for (var player in _players) {
        player.update();
        
        // Check for collisions
        for (var obstacle in _obstacles) {
          if (_checkCollision(player, obstacle)) {
            _isGameOver = true;
            break;
          }
        }
      }
    });
  }
  
  bool _checkCollision(Player player, Obstacle obstacle) {
    // Simple collision detection
    final double playerLeft = 0.15;
    final double playerRight = 0.25;
    final double playerTop = player.yPosition - 0.05;
    final double playerBottom = player.yPosition + 0.05;
    
    final double obstacleLeft = obstacle.x;
    final double obstacleRight = obstacle.x + 0.1;
    final double obstacleTop = obstacle.y;
    final double obstacleBottom = obstacle.y + obstacle.height;
    
    return playerLeft < obstacleRight &&
           playerRight > obstacleLeft &&
           playerTop < obstacleBottom &&
           playerBottom > obstacleTop;
  }
  
  void _startGame() {
    setState(() {
      _isGameStarted = true;
      _isGameOver = false;
      _speed = 0.0;
      _distance = 0.0;
      _obstacles.clear();
      _nextObstacleTime = 0;
      
      for (var player in _players) {
        player.reset();
      }
    });
  }
  
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: RawKeyboardListener(
        focusNode: FocusNode(),
        autofocus: true,
        onKey: (event) {
          if (event is RawKeyDownEvent) {
            final key = event.logicalKey.keyLabel;
            for (var player in _players) {
              if (key == player.key) {
                player.jump();
              }
            }
            
            // Space to start/restart game
            if (key == 'Space' && (!_isGameStarted || _isGameOver)) {
              _startGame();
            }
          }
        },
        child: Stack(
          children: [
            // Ground
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Container(
                height: 20,
                color: Colors.grey[400],
              ),
            ),
            
            // Players
            for (var player in _players)
              Positioned(
                left: 50,
                top: MediaQuery.of(context).size.height * player.yPosition,
                child: Transform.translate(
                  offset: Offset(0, -player.jumpHeight * 100),
                  child: Container(
                    width: 40,
                    height: 60,
                    decoration: BoxDecoration(
                      color: player.color,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Center(
                      child: Text(
                        player.key.replaceAll('Key ', '').replaceAll('Arrow ', ''),
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            
            // Obstacles
            for (var obstacle in _obstacles)
              Positioned(
                left: MediaQuery.of(context).size.width * obstacle.x,
                top: MediaQuery.of(context).size.height * obstacle.y,
                child: Container(
                  width: 30,
                  height: MediaQuery.of(context).size.height * obstacle.height,
                  color: Colors.brown,
                ),
              ),
            
            // Game info
            Positioned(
              top: 20,
              left: 20,
              child: Text(
                'Distance: ${_distance.toStringAsFixed(1)}',
                style: const TextStyle(fontSize: 20),
              ),
            ),
            
            // Start/Restart overlay
            if (!_isGameStarted || _isGameOver)
              Container(
                color: Colors.black54,
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        _isGameOver ? 'Game Over!' : '4-Player Dino Run',
                        style: const TextStyle(
                          fontSize: 40,
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 20),
                      const Text(
                        'Controls:',
                        style: TextStyle(
                          fontSize: 24,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 10),
                      for (var player in _players)
                        Text(
                          '${player.key.replaceAll('Key ', '').replaceAll('Arrow ', '')} - ${player.color} dino',
                          style: TextStyle(
                            fontSize: 20,
                            color: player.color,
                          ),
                        ),
                      const SizedBox(height: 30),
                      const Text(
                        'Press SPACE to start',
                        style: TextStyle(
                          fontSize: 24,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class Player {
  final double yPosition;
  final Color color;
  final String key;
  
  double jumpHeight = 0.0;
  double jumpVelocity = 0.0;
  bool isJumping = false;
  
  Player({
    required this.yPosition,
    required this.color,
    required this.key,
  });
  
  void jump() {
    if (!isJumping) {
      isJumping = true;
      jumpVelocity = -0.02;
    }
  }
  
  void update() {
    if (isJumping) {
      jumpHeight += jumpVelocity;
      jumpVelocity += 0.001;
      
      if (jumpHeight <= 0.0) {
        jumpHeight = 0.0;
        isJumping = false;
      }
    }
  }
  
  void reset() {
    jumpHeight = 0.0;
    jumpVelocity = 0.0;
    isJumping = false;
  }
}

class Obstacle {
  double x;
  double y;
  double height;
  
  Obstacle({
    required this.x,
    required this.y,
    required this.height,
  });
}