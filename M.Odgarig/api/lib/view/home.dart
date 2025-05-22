import 'package:flutter/material.dart';
import 'package:water_drop_nav_bar/water_drop_nav_bar.dart';
import 'package:api/view/profile.dart';
import 'package:api/view/exam.dart';
import 'package:api/view/lesson.dart';
import 'package:api/view/choice.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.deepPurple,
        visualDensity: VisualDensity.adaptivePlatformDensity,
        fontFamily: 'Roboto',
      ),
      home: HomeScreen(),
    );
  }
}

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  bool _isSearching = false;
  String _searchQuery = "";
  final TextEditingController _searchController = TextEditingController();
  final FocusNode _searchFocusNode = FocusNode();

  final List<Widget> _screens = [
    HomeContent(), // Энд HomeContent() байна
    LessonsScreen(),
    ExamsScreen(),
    ProfileScreen(),
  ];

  @override
  void dispose() {
    _searchController.dispose();
    _searchFocusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: !_isSearching
            ? Row(
                children: [
                  Icon(Icons.school, color: Colors.white, size: 28),
                  SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'ЭЕШ Платформ',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 0.5,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              )
            : _buildSearchField(),
        backgroundColor: Colors.deepPurple[700], // AppBar-ын өнгө
        elevation: 4,
        shadowColor: Colors.black45,
        actions: [
          if (!_isSearching)
            AnimatedContainer(
              duration: Duration(milliseconds: 300),
              curve: Curves.easeInOut,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.1),
                borderRadius: BorderRadius.circular(30),
              ),
              padding: EdgeInsets.symmetric(horizontal: 8),
              margin: EdgeInsets.all(8),
              child: IconButton(
                icon: Icon(Icons.search, color: Colors.white, size: 24),
                splashRadius: 20,
                onPressed: () {
                  setState(() {
                    _isSearching = true;
                  });
                  Future.delayed(Duration(milliseconds: 50), () {
                    _searchFocusNode.requestFocus();
                  });
                },
              ),
            )
          else
            IconButton(
              icon: Icon(Icons.close, color: Colors.white),
              splashRadius: 20,
              onPressed: () {
                setState(() {
                  _isSearching = false;
                  _searchQuery = "";
                  _searchController.clear();
                });
              },
            ),
        ],
      ),
      backgroundColor: Colors.grey[50],
      body: _screens[_currentIndex],
      bottomNavigationBar: WaterDropNavBar(
        backgroundColor: Colors.deepPurple[900]!, // BottomNavigationBar-ын өнгө
        onItemSelected: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        selectedIndex: _currentIndex,
        barItems: [
          BarItem(filledIcon: Icons.home, outlinedIcon: Icons.home_outlined),
          BarItem(
            filledIcon: Icons.menu_book,
            outlinedIcon: Icons.menu_book_outlined,
          ),
          BarItem(
            filledIcon: Icons.assignment,
            outlinedIcon: Icons.assignment_outlined,
          ),
          BarItem(filledIcon: Icons.person, outlinedIcon: Icons.person_outline),
        ],
      ),
    );
  }

  Widget _buildSearchField() {
    return Container(
      height: 40,
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.2),
        borderRadius: BorderRadius.circular(20),
      ),
      child: TextField(
        controller: _searchController,
        focusNode: _searchFocusNode,
        autofocus: true,
        onChanged: (value) {
          setState(() {
            _searchQuery = value;
          });
        },
        style: TextStyle(color: Colors.white, fontSize: 16),
        decoration: InputDecoration(
          hintText: "Хайх...",
          hintStyle: TextStyle(color: Colors.white70),
          border: InputBorder.none,
          prefixIcon: Icon(Icons.search, color: Colors.white70),
          suffixIcon: _searchQuery.isNotEmpty
              ? IconButton(
                  icon: Icon(Icons.clear, size: 20, color: Colors.white70),
                  onPressed: () {
                    _searchController.clear();
                    setState(() {
                      _searchQuery = "";
                    });
                  },
                )
              : null,
          contentPadding: EdgeInsets.symmetric(vertical: 8),
        ),
      ),
    );
  }
}

// HomeContent класс
class HomeContent extends StatelessWidget {
  double _getResponsiveFontSize(
    BuildContext context, {
    required double baseSize,
    double? smallScale = 0.8,
    double? mediumScale = 0.9,
    double? largeScale = 1.1,
  }) {
    double screenWidth = MediaQuery.of(context).size.width;

    if (screenWidth <= 320) {
      return baseSize * 0.7;
    } else if (screenWidth <= 360) {
      return baseSize * 0.8;
    } else if (screenWidth > 600) {
      return baseSize * largeScale!;
    } else if (screenWidth > 400) {
      return baseSize * mediumScale!;
    } else {
      return baseSize * smallScale!;
    }
  }

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;

    return SingleChildScrollView(
      child: Column(
        children: [
          Container(
            padding: EdgeInsets.all(screenWidth * 0.05),
            decoration: BoxDecoration(
              color: Colors.grey[50], // Энд өнгийг өөрчиллөө
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(30),
                bottomRight: Radius.circular(30),
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.deepPurple[200]!.withOpacity(0.5),
                  spreadRadius: 1,
                  blurRadius: 8,
                  offset: Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Таны Ирээдүйн\nАмжилтын Эхлэл',
                  style: TextStyle(
                    fontSize: _getResponsiveFontSize(
                      context,
                      baseSize: 28,
                    ),
                    fontWeight: FontWeight.w800,
                    color: Colors.deepPurple[900],
                    letterSpacing: 0.5,
                    height: 1.2,
                  ),
                ),
                SizedBox(height: 15),
                Text(
                  'Элсэлтийн ерөнхий шалгалтад бэлтгэх хамгийн найдвартай платформ.',
                  style: TextStyle(
                    fontSize: _getResponsiveFontSize(
                      context,
                      baseSize: 18,
                    ),
                    color: Colors.deepPurple[700],
                    fontWeight: FontWeight.w500,
                    height: 1.4,
                  ),
                ),
                SizedBox(height: 15),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {},
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.deepPurple[700],
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(25),
                          ),
                          padding: EdgeInsets.symmetric(
                            horizontal: screenWidth * 0.04,
                            vertical: 16,
                          ),
                          elevation: 4,
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.create,
                              color: Colors.white,
                              size: 22,
                            ),
                            SizedBox(width: 12),
                            Text(
                              'Бэлтгэх',
                              style: TextStyle(
                                fontSize: _getResponsiveFontSize(
                                  context,
                                  baseSize: 18,
                                ),
                                fontWeight: FontWeight.w600,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    SizedBox(width: 12),
                    TextButton(
                      onPressed: () {},
                      child: Text(
                        'Дэлгэрэнгүй',
                        style: TextStyle(
                          fontSize: _getResponsiveFontSize(
                            context,
                            baseSize: 18,
                          ),
                          color: Colors.deepPurple[700],
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          SizedBox(height: 25),

          // Мэргэжил сонгох хэсэг
          Container(
            margin: EdgeInsets.symmetric(horizontal: 20),
            padding: EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(15),
              boxShadow: [
                BoxShadow(
                  color: Colors.deepPurple.withOpacity(0.2),
                  blurRadius: 8,
                  offset: Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(Icons.school, color: Colors.deepPurple[800], size: 26),
                    SizedBox(width: 10),
                    Text(
                      ' Мэргэжил сонгох',
                      style: TextStyle(
                        fontSize: _getResponsiveFontSize(
                          context,
                          baseSize: 22,
                        ),
                        fontWeight: FontWeight.w700,
                        color: Colors.deepPurple[900],
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 12),
                Text(
                  'Ирээдүйн мэргэжлээ сонгож, тохирох их сургуулиуд, тэдгээрийн босго оноог харьцуул.',
                  style: TextStyle(
                    fontSize: _getResponsiveFontSize(
                      context,
                      baseSize: 16,
                    ),
                    color: Colors.deepPurple[600],
                  ),
                ),
                SizedBox(height: 15),
                ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => UniversitySelectorPage(),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.deepPurple[700],
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(25),
                    ),
                    padding: EdgeInsets.symmetric(vertical: 12),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      SizedBox(width: 8),
                      Text(
                        'Сургууль Сонгох',
                        style: TextStyle(
                          fontSize: _getResponsiveFontSize(
                            context,
                            baseSize: 16,
                          ),
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          SizedBox(height: 25),
          // ЭЕШ-ын хуваарь хэсэг
          Container(
            margin: EdgeInsets.symmetric(horizontal: 20),
            padding: EdgeInsets.all(16), // Padding-г багасгалаа
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(15),
              boxShadow: [
                BoxShadow(
                  color: Colors.deepPurple.withOpacity(0.2),
                  blurRadius: 8,
                  offset: Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'ЭЕШ-ын Хуваарь',
                  style: TextStyle(
                    fontSize: _getResponsiveFontSize(context, baseSize: 22), // Фонтны хэмжээг багасгалаа
                    fontWeight: FontWeight.w700,
                    color: Colors.deepPurple[900],
                  ),
                ),
                SizedBox(height: 10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Бүртгэлийн хугацаа',
                      style: TextStyle(
                        fontSize: _getResponsiveFontSize(context, baseSize: 16), // Фонтны хэмжээг багасгалаа
                        fontWeight: FontWeight.bold,
                        color: Colors.deepPurple[800],
                      ),
                    ),
                    Flexible(
                      child: Text(
                        '2024 оны 4 дүгээр сарын 1-ээс 4 дүгээр сарын 30 хүртэл',
                        style: TextStyle(
                          fontSize: _getResponsiveFontSize(context, baseSize: 14), // Фонтны хэмжээг багасгалаа
                          color: Colors.deepPurple[600],
                        ),
                        textAlign: TextAlign.end,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Шалгалтын өдөр',
                      style: TextStyle(
                        fontSize: _getResponsiveFontSize(context, baseSize: 16), // Фонтны хэмжээг багасгалаа
                        fontWeight: FontWeight.bold,
                        color: Colors.deepPurple[800],
                      ),
                    ),
                    Text(
                      '2024 оны 6 дугаар сарын 15-16',
                      style: TextStyle(
                        fontSize: _getResponsiveFontSize(context, baseSize: 14), // Фонтны хэмжээг багасгалаа
                        color: Colors.deepPurple[600],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          SizedBox(height: 20),
        ],
      ),
    );
  }
}

