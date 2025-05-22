import 'package:flutter/material.dart';

class LessonsScreen extends StatelessWidget {
  final List<Map<String, dynamic>> subjects = [
    {
      'name': 'Монгол хэл',
      'icon': Icons.language,
      'color': Colors.red,
      'totalLessons': 45,
      'completed': 0,
      'chapters': [
        {'title': 'Үгийн сан, хэлц үг', 'completed': false},
        {'title': 'Хэлзүй', 'completed': false},
        {'title': 'Утга зохиол', 'completed': false},
        {'title': 'Бичгийн дүрэм', 'completed': false},
      ]
    },
    {
      'name': 'Математик',
      'icon': Icons.calculate,
      'color': Colors.blue,
      'totalLessons': 60,
      'completed': 0,
      'chapters': [
        {'title': 'Алгебр', 'completed': false},
        {'title': 'Геометр', 'completed': false},
        {'title': 'Тригонометр', 'completed': false},
        {'title': 'Тооны онол', 'completed': false},
      ]
    },
    {
      'name': 'Англи хэл',
      'icon': Icons.translate,
      'color': Colors.green,
      'totalLessons': 40,
      'completed': 0,
      'chapters': [
        {'title': 'Grammar', 'completed': false},
        {'title': 'Vocabulary', 'completed': false},
        {'title': 'Reading', 'completed': false},
        {'title': 'Listening', 'completed': false},
      ]
    },
    {
      'name': 'Физик',
      'icon': Icons.science,
      'color': Colors.purple,
      'totalLessons': 50,
      'completed': 0,
      'chapters': [
        {'title': 'Механик', 'completed': false},
        {'title': 'Цахилгаан', 'completed': false},
        {'title': 'Соронзон', 'completed': false},
        {'title': 'Дулаан', 'completed': false},
      ]
    },
    {
      'name': 'Хими',
      'icon': Icons.emoji_objects,
      'color': Colors.orange,
      'totalLessons': 45,
      'completed': 0,
      'chapters': [
        {'title': 'Бодисын бүтэц', 'completed': false},
        {'title': 'Химийн урвал', 'completed': false},
        {'title': 'Органик хими', 'completed': false},
        {'title': 'Химийн тооцоо', 'completed': false},
      ]
    },
    {
      'name': 'Биологи',
      'icon': Icons.eco,
      'color': Colors.teal,
      'totalLessons': 40,
      'completed': 0,
      'chapters': [
        {'title': 'Эс биологи', 'completed': false},
        {'title': 'Амьтан биологи', 'completed': false},
        {'title': 'Ургамал биологи', 'completed': false},
        {'title': 'Генетик', 'completed': false},
      ]
    },
    {
      'name': 'Монголын түүх',
      'icon': Icons.history,
      'color': Colors.brown,
      'totalLessons': 35,
      'completed': 0,
      'chapters': [
        {'title': 'Эртний түүх', 'completed': false},
        {'title': 'Дундад зууны түүх', 'completed': false},
        {'title': 'Шинэ түүх', 'completed': false},
        {'title': 'Орчин үеийн түүх', 'completed': false},
      ]
    },
    {
      'name': 'Газарзүй',
      'icon': Icons.public,
      'color': Colors.indigo,
      'totalLessons': 30,
      'completed': 0,
      'chapters': [
        {'title': 'Физик газарзүй', 'completed': false},
        {'title': 'Эдийн засгийн газарзүй', 'completed': false},
        {'title': 'Монголын газарзүй', 'completed': false},
        {'title': 'Дэлхийн газарзүй', 'completed': false},
      ]
    },
    {
      'name': 'Нийгмийн ухаан',
      'icon': Icons.people,
      'color': Colors.pink,
      'totalLessons': 25,
      'completed': 0,
      'chapters': [
        {'title': 'Нийгмийн ухаан', 'completed': false},
        {'title': 'Санхүүгийн боловсрол', 'completed': false},
        {'title': 'Эрх зүй', 'completed': false},
        {'title': 'Сэтгэл зүй', 'completed': false},
      ]
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('ЭЕШ - Бүх хичээлүүд'),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: _buildSubjectList(),
      ),
    );
  }

  Widget _buildSubjectList() {
    return ListView.separated(
      physics: NeverScrollableScrollPhysics(),
      shrinkWrap: true,
      itemCount: subjects.length,
      separatorBuilder: (context, index) => SizedBox(height: 12),
      itemBuilder: (context, index) {
        final subject = subjects[index];
        final double progress = (subject['completed'] as int) / (subject['totalLessons'] as int);
        
        return Card(
          elevation: 2,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          child: InkWell(
            borderRadius: BorderRadius.circular(12),
            onTap: () {
              _navigateToSubjectDetails(context, subject);
            },
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: subject['color'].withOpacity(0.2),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          subject['icon'],
                          color: subject['color'],
                          size: 24,
                        ),
                      ),
                      SizedBox(width: 15),
                      Expanded(
                        child: Text(
                          subject['name'],
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      Icon(
                        Icons.chevron_right,
                        color: Colors.grey,
                      ),
                    ],
                  ),
                  SizedBox(height: 15),
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Хичээл: ${subject['completed']}/${subject['totalLessons']}',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.grey[600],
                              ),
                            ),
                            SizedBox(height: 5),
                            LinearProgressIndicator(
                              value: progress,
                              backgroundColor: Colors.grey[200],
                              valueColor: AlwaysStoppedAnimation<Color>(
                                subject['color'],
                              ),
                              minHeight: 6,
                              borderRadius: BorderRadius.circular(3),
                            ),
                          ],
                        ),
                      ),
                      SizedBox(width: 15),
                      TextButton(
                        onPressed: () {
                          _navigateToSubjectDetails(context, subject);
                        },
                        style: TextButton.styleFrom(
                          foregroundColor: subject['color'],
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                          ),
                          padding: EdgeInsets.symmetric(
                            horizontal: 20,
                            vertical: 8,
                          ),
                        ),
                        child: Text(
                          'Дэлгэрэнгүй',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  void _navigateToSubjectDetails(BuildContext context, Map<String, dynamic> subject) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => SubjectDetailsScreen(subject: subject),
      ),
    );
  }
}

class SubjectDetailsScreen extends StatelessWidget {
  final Map<String, dynamic> subject;

  const SubjectDetailsScreen({Key? key, required this.subject}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('ЭЕШ - ${subject['name']}'),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSubjectHeader(),
            SizedBox(height: 20),
            _buildChapterList(),
          ],
        ),
      ),
    );
  }

  Widget _buildSubjectHeader() {
    final double progress = (subject['completed'] as int) / (subject['totalLessons'] as int);
    
    return Card(
      elevation: 2,
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              children: [
                Container(
                  padding: EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: subject['color'].withOpacity(0.2),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    subject['icon'],
                    color: subject['color'],
                    size: 30,
                  ),
                ),
                SizedBox(width: 15),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        subject['name'],
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 5),
                      Text(
                        'ЭЕШ-д бэлтгэх хичээлүүд',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            SizedBox(height: 15),
            LinearProgressIndicator(
              value: progress,
              backgroundColor: Colors.grey[200],
              valueColor: AlwaysStoppedAnimation<Color>(subject['color']),
              minHeight: 8,
              borderRadius: BorderRadius.circular(4),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildChapterList() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'ЭЕШ-ын сэдвүүд',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        SizedBox(height: 10),
        ListView.separated(
          physics: NeverScrollableScrollPhysics(),
          shrinkWrap: true,
          itemCount: (subject['chapters'] as List).length,
          separatorBuilder: (context, index) => SizedBox(height: 8),
          itemBuilder: (context, index) {
            final chapter = subject['chapters'][index];
            return Card(
              elevation: 1,
              child: ListTile(
                leading: Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: chapter['completed'] 
                        ? Colors.green[100] 
                        : Colors.grey[200],
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    chapter['completed'] ? Icons.check : Icons.play_arrow,
                    color: chapter['completed'] ? Colors.green : Colors.grey,
                  ),
                ),
                title: Text(
                  chapter['title'],
                  style: TextStyle(
                    fontWeight: FontWeight.w500,
                  ),
                ),
                subtitle: Text('ЭЕШ-ын тусгай хичээл'),
                trailing: Icon(Icons.chevron_right),
                onTap: () {
                  // Handle chapter tap
                },
              ),
            );
          },
        ),
      ],
    );
  }
}