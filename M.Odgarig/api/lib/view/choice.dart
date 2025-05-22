import 'dart:async';
import 'package:flutter/material.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';

class University {
  final String name;
  final List<Major> majors;

  University({required this.name, required this.majors});
}

class Major {
  final String name;
  final int cutoffScore;

  Major({required this.name, required this.cutoffScore});
}

class UniversitySelectorPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Сургууль сонгох"),
        backgroundColor: Colors.deepPurple[700], // Home хуудасны AppBar-ын өнгө
      ),
      body: UniversitySmoothPageView(),
    );
  }
}

class UniversitySmoothPageView extends StatefulWidget {
  @override
  _UniversitySmoothPageViewState createState() =>
      _UniversitySmoothPageViewState();
}

class _UniversitySmoothPageViewState extends State<UniversitySmoothPageView> {
  final List<University> universities = [
    University(
      name: "Монгол Улсын Их Сургууль (МУИС)",
      majors: [
        Major(name: "Программ хангамж", cutoffScore: 620),
        Major(name: "Мэдээлэл зүй", cutoffScore: 600),
        Major(name: "Эдийн засаг", cutoffScore: 580),
        Major(name: "Хууль зүй", cutoffScore: 650),
        Major(name: "Санхүү", cutoffScore: 610),
      ],
    ),
    University(
      name: "Хууль Зүйн Их Сургууль (ХУИС)",
      majors: [
        Major(name: "Хууль зүй", cutoffScore: 680),
        Major(name: "Олон улсын хууль", cutoffScore: 670),
        Major(name: "Цагдаагийн шинжлэх ухаан", cutoffScore: 630),
      ],
    ),
    University(
      name: "Шинжлэх Ухаан Технологийн Их Сургууль (ШУТИС)",
      majors: [
        Major(name: "Инженер", cutoffScore: 590),
        Major(name: "Архитектур", cutoffScore: 610),
        Major(name: "Химийн технологи", cutoffScore: 580),
        Major(name: "Цахилгаан инженер", cutoffScore: 600),
      ],
    ),
    University(
      name: "АНАГААХ Шинжлэх Ухааны Их Сургууль (АШУИС)",
      majors: [
        Major(name: "Эм зүй", cutoffScore: 680),
        Major(name: "Анагаах ухаан", cutoffScore: 720),
        Major(name: "Сурган хүмүүжүүлэх ухаан", cutoffScore: 650),
        Major(name: "Нийгмийн ажилтан", cutoffScore: 600),
      ],
    ),
    University(
      name: "ХААИС (Хөдөө Аж Ахуйн Их Сургууль)",
      majors: [
        Major(name: "Хөдөө аж ахуй", cutoffScore: 550),
        Major(name: "Ветеринар", cutoffScore: 580),
        Major(name: "Хүнсний технологи", cutoffScore: 570),
      ],
    ),
    University(
      name: "Бизнесийн Удирдлагын Академи (БУА)",
      majors: [
        Major(name: "Бизнес удирдлага", cutoffScore: 590),
        Major(name: "Маркетинг", cutoffScore: 580),
        Major(name: "Санхүү", cutoffScore: 600),
      ],
    ),
  ];

  final PageController _universityPageController =
      PageController(viewportFraction: 0.9);
  final PageController _viewPageController = PageController();
  Timer? _autoScrollTimer;
  int _currentUniversityIndex = 0;

  University? _selectedUniversity;
  Major? _selectedMajor;
  int _currentViewPage = 0;

  @override
  void initState() {
    super.initState();
    if (universities.isNotEmpty) {
      _selectedUniversity = universities[0];
    }
    _startAutoScroll();
  }

  @override
  void dispose() {
    _autoScrollTimer?.cancel();
    _universityPageController.dispose();
    _viewPageController.dispose();
    super.dispose();
  }

  void _startAutoScroll() {
    _autoScrollTimer = Timer.periodic(Duration(seconds: 3), (timer) {
      if (_currentViewPage == 0) {
        final nextPage = _currentUniversityIndex + 1;
        if (nextPage < universities.length) {
          _universityPageController.nextPage(
            duration: Duration(milliseconds: 500),
            curve: Curves.easeInOut,
          );
        } else {
          _universityPageController.animateToPage(
            0,
            duration: Duration(milliseconds: 500),
            curve: Curves.easeInOut,
          );
        }
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Colors.deepPurple[400]!, Colors.deepPurple[100]!],
        ),
      ),
      child: Column(
        children: [
          Expanded(
            child: PageView(
              controller: _viewPageController,
              onPageChanged: (index) {
                setState(() {
                  _currentViewPage = index;
                });
              },
              children: [
                _buildUniversityPageView(),
                _buildMajorSelectionPage(),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: SmoothPageIndicator(
              controller: _viewPageController,
              count: 2,
              effect: WormEffect(
                dotHeight: 10,
                dotWidth: 10,
                type: WormType.thin,
                activeDotColor: Colors.white,
                dotColor: Colors.white.withOpacity(0.5),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildUniversityPageView() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: Text(
            "Таны Ирээдүйн Амжилтын Эхлэл",
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ),
        SizedBox(height: 20),
        Expanded(
          child: NotificationListener<ScrollNotification>(
            onNotification: (notification) {
              if (notification is ScrollEndNotification) {
                _currentUniversityIndex =
                    _universityPageController.page?.round() ?? 0;
                setState(() {
                  _selectedUniversity = universities[_currentUniversityIndex];
                });
              }
              return false;
            },
            child: PageView.builder(
              controller: _universityPageController,
              itemCount: universities.length,
              onPageChanged: (index) {
                _currentUniversityIndex = index;
                setState(() {
                  _selectedUniversity = universities[index];
                  _selectedMajor = null;
                });
              },
              physics: BouncingScrollPhysics(),
              itemBuilder: (context, index) {
                final university = universities[index];
                return GestureDetector(
                  onTap: () {
                    _autoScrollTimer?.cancel();
                    setState(() {
                      _selectedUniversity = university;
                      _viewPageController.animateToPage(
                        1,
                        duration: Duration(milliseconds: 500),
                        curve: Curves.easeInOut,
                      );
                    });
                    _startAutoScroll();
                  },
                  child: Container(
                    margin:
                        EdgeInsets.symmetric(horizontal: 10.0, vertical: 20.0),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(15),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black26,
                          blurRadius: 10,
                          offset: Offset(0, 5),
                        )
                      ],
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.school,
                            size: 50, color: Colors.deepPurple[700]),
                        SizedBox(height: 16),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16.0),
                          child: Text(
                            university.name,
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.deepPurple[700],
                            ),
                          ),
                        ),
                        SizedBox(height: 8),
                        Text(
                          "${university.majors.length} мэргэжил",
                          style: TextStyle(color: Colors.grey[700]),
                        ),
                        SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: () {
                            _autoScrollTimer?.cancel();
                            setState(() {
                              _selectedUniversity = university;
                              _viewPageController.animateToPage(
                                1,
                                duration: Duration(milliseconds: 500),
                                curve: Curves.easeInOut,
                              );
                            });
                            _startAutoScroll();
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.deepPurple[700],
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(20),
                            ),
                            padding: EdgeInsets.symmetric(
                                horizontal: 24, vertical: 12),
                          ),
                          child: Text(
                            "Мэргэжил сонгох",
                            style: TextStyle(fontSize: 16, color: Colors.white),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ),
        SizedBox(height: 10),
        Container(
          padding: EdgeInsets.only(bottom: 20),
          child: SmoothPageIndicator(
            controller: _universityPageController,
            count: universities.length,
            effect: ExpandingDotsEffect(
              dotHeight: 8,
              dotWidth: 8,
              activeDotColor: Colors.white,
              dotColor: Colors.white.withOpacity(0.4),
              spacing: 8,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildMajorSelectionPage() {
    if (_selectedUniversity == null) {
      return Center(
        child: Text(
          "Эхлээд сургууль сонгоно уу",
          style: TextStyle(color: Colors.white, fontSize: 18),
        ),
      );
    }

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: Text(
            _selectedUniversity!.name,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
            textAlign: TextAlign.center,
          ),
        ),
        Text(
          "Мэргэжил сонгох",
          style: TextStyle(
            fontSize: 18,
            color: Colors.white,
            fontWeight: FontWeight.w500,
          ),
        ),
        SizedBox(height: 16),
        Expanded(
          child: ListView.builder(
            padding: EdgeInsets.symmetric(horizontal: 16),
            itemCount: _selectedUniversity!.majors.length,
            itemBuilder: (context, index) {
              final major = _selectedUniversity!.majors[index];
              final isSelected = _selectedMajor?.name == major.name;

              return Card(
                elevation: isSelected ? 8 : 2,
                margin: EdgeInsets.symmetric(vertical: 8),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: isSelected
                      ? BorderSide(color: Colors.deepPurple[700]!, width: 2)
                      : BorderSide.none,
                ),
                child: InkWell(
                  borderRadius: BorderRadius.circular(12),
                  onTap: () {
                    setState(() {
                      _selectedMajor = major;
                    });
                  },
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Text(
                                major.name,
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            if (isSelected)
                              Icon(Icons.check_circle,
                                  color: Colors.deepPurple[700]),
                          ],
                        ),
                        SizedBox(height: 8),
                        Text(
                          "Босго оноо: ${major.cutoffScore}",
                          style: TextStyle(color: Colors.grey[700]),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              TextButton.icon(
                onPressed: () {
                  setState(() {
                    _viewPageController.animateToPage(
                      0,
                      duration: Duration(milliseconds: 500),
                      curve: Curves.easeInOut,
                    );
                  });
                },
                icon: Icon(Icons.arrow_back, color: Colors.white),
                label: Text("Буцах", style: TextStyle(color: Colors.white)),
              ),
              if (_selectedMajor != null)
                ElevatedButton(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(
                          "${_selectedUniversity!.name}, ${_selectedMajor!.name} сонголт хадгалагдлаа",
                        ),
                        duration: Duration(seconds: 2),
                      ),
                    );
                    Navigator.pop(context);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: Colors.deepPurple[700],
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                    padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  ),
                  child: Text("Хадгалах", style: TextStyle(fontSize: 16)),
                ),
            ],
          ),
        ),
      ],
    );
  }
}