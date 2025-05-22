import 'package:flutter/material.dart';

void main() {
  runApp(const ExamsScreen());
}

class ExamsScreen extends StatelessWidget {
  const ExamsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ЭЕШ Бэлтгэл',
      theme: ThemeData(
        primarySwatch: Colors.deepPurple,
        fontFamily: 'Roboto',
        cardTheme: CardTheme(
          elevation: 4,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
          color: Colors.white,
        ),
      ),
      home: const MainExamScreen(),
    );
  }
}

class MainExamScreen extends StatelessWidget {
  const MainExamScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'ЭЕШ - Шалгалт',
          style: TextStyle(color: Colors.white),
        ),
        centerTitle: true,
        flexibleSpace: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFF512DA8), Color(0xFF5E35B1)],
              begin: Alignment.topRight,
              end: Alignment.bottomLeft,
            ),
          ),
        ),
        elevation: 4,
        shadowColor: Colors.black45,
      ),
      body: Container(
        decoration: BoxDecoration(
          color: Colors.grey[50],
        ),
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Card(
              child: ListTile(
                leading: Icon(Icons.history, color: Colors.deepPurple[700], size: 30),
                title: Text(
                  'Он оны тестүүд',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.deepPurple[900]),
                ),
                subtitle: const Text('Өмнөх жилүүдийн ЭЕШ-ын тестүүд'),
                trailing: const Icon(Icons.arrow_forward_ios),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const PreviousYearsTestsScreen(),
                    ),
                  );
                },
              ),
            ),
            Card(
              child: ListTile(
                leading: Icon(Icons.check_circle_outline, color: Colors.deepPurple[600], size: 30),
                title: Text(
                  'Шалгалт сорил',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.deepPurple[900]),
                ),
                subtitle: const Text('Өөрийгөө шалгах сорилууд'),
                trailing: const Icon(Icons.arrow_forward_ios),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const PracticeExamsScreen(),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class PreviousYearsTestsScreen extends StatelessWidget {
  const PreviousYearsTestsScreen({super.key});

  final List<String> testYears = const [
    '2024',
    '2023',
    '2022',
    '2021',
    '2020',
    '2019',
    '2018',
    '2017',
    '2016',
    '2015',
    '2014',
    '2013',
    '2012',
    // Add more years as needed
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Он оны тестүүд',
          style: TextStyle(color: Colors.white),
        ),
        centerTitle: true,
        flexibleSpace: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFF512DA8), Color(0xFF5E35B1)],
              begin: Alignment.topRight,
              end: Alignment.bottomLeft,
            ),
          ),
        ),
        elevation: 4,
        shadowColor: Colors.black45,
      ),
      backgroundColor: Colors.grey[50],
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: testYears.length,
        itemBuilder: (context, index) {
          final year = testYears[index];
          return Card(
            child: ListTile(
              title: Text('$year оны ЭЕШ',
                  style: TextStyle(fontWeight: FontWeight.bold, color: Colors.deepPurple[800])),
              trailing: const Icon(Icons.arrow_forward_ios),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => YearTestsScreen(year: year),
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}

class YearTestsScreen extends StatelessWidget {
  final String year;

  const YearTestsScreen({super.key, required this.year});

  final List<String> tests = const [
    'Математик',
    'Монгол хэл',
    'Англи хэл',
    'Физик',
    'Хими',
    'Нигмийн ухаан',
    'Монголын Түүх',
    'Биологи',
    'Газар зүй',
    // ... other subjects for the year
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          '$year оны ЭЕШ',
          style: const TextStyle(color: Colors.white),
        ),
        centerTitle: true,
        flexibleSpace: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFF512DA8), Color(0xFF5E35B1)],
              begin: Alignment.topRight,
              end: Alignment.bottomLeft,
            ),
          ),
        ),
        elevation: 4,
        shadowColor: Colors.black45,
      ),
      backgroundColor: Colors.grey[50],
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: tests.length,
        itemBuilder: (context, index) {
          final testName = tests[index];
          return Card(
            child: ListTile(
              title: Text(testName,
                  style: TextStyle(fontWeight: FontWeight.bold, color: Colors.deepPurple[800])),
              trailing: const Icon(Icons.arrow_forward_ios),
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('$year оны $testName тест удахгүй...')),
                );
              },
            ),
          );
        },
      ),
    );
  }
}

class PracticeExamsScreen extends StatelessWidget {
  const PracticeExamsScreen({super.key});

  final List<String> practiceExams = const [
    'Математикийн сорил №1',
    'Монгол хэлний сорил №1',
    'Англи хэлний сорил №1',
    'Физикийн сорил №1',
    'Хими сорил №1',
    'Нигмийн ухаан сорил №1',
    'Монголын Түүх сорил №1',
    'Биологи сорил №1',
    'Газар зүй сорил №1',
    // Add more practice exams
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Шалгалт сорил',
          style: TextStyle(color: Colors.white),
        ),
        centerTitle: true,
        flexibleSpace: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFF512DA8), Color(0xFF5E35B1)],
              begin: Alignment.topRight,
              end: Alignment.bottomLeft,
            ),
          ),
        ),
        elevation: 4,
        shadowColor: Colors.black45,
      ),
      backgroundColor: Colors.grey[50],
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: practiceExams.length,
        itemBuilder: (context, index) {
          final examName = practiceExams[index];
          return Card(
            child: ListTile(
              title: Text(examName,
                  style: TextStyle(fontWeight: FontWeight.bold, color: Colors.deepPurple[800])),
              trailing: const Icon(Icons.arrow_forward_ios),
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('$examName сорил удахгүй...')),
                );
              },
            ),
          );
        },
      ),
    );
  }
}