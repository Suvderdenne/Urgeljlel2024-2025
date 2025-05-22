import 'package:flutter/material.dart';
import 'package:app/tests/header_footer.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  MyApp();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Duo(),
    );
  }
}

class Duo extends StatelessWidget {
  const Duo({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            Spacer(),
            Padding(
              padding: const EdgeInsets.only(
                  left: 25.0), // Зүүн талд 40 пикселийн зай нэмнэ
              child: Row(
                children: [
                  Icon(Icons.favorite, color: Colors.red),
                  SizedBox(width: 5), // Текст болон дүрс хоорондын зай нэмнэ
                  Text('5'),
                ],
              ),
            ),
          ],
        ),
        bottom: PreferredSize(
          preferredSize: Size.fromHeight(
              4.0), // LinearProgressIndicator-ийн өндрийг тохируулна
          child: LinearProgressIndicator(
            value: 0.5,
            valueColor: AlwaysStoppedAnimation<Color>(Colors.green),
            backgroundColor: Colors.grey[200],
          ),
        ),
      ),
      body: Padding(
        padding: EdgeInsets.all(10),
        child: SingleChildScrollView(
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.only(left: 20.0),
                    child: Text(
                      "NEW WORD",
                      style: TextStyle(
                        fontSize: 15,
                        color: Color.fromARGB(255, 231, 17, 184),
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.only(left: 20.0),
                    child: Text(
                      "Which of these is",
                      style: TextStyle(
                        fontSize: 22,
                        color: Colors.black,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(
                height: 25,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(2),
                          side: BorderSide(
                              color: Color.fromARGB(255, 167, 163, 163),
                              width: 1),
                        ),
                        padding:
                            EdgeInsets.symmetric(horizontal: 15, vertical: 20)),
                    child: Row(
                      children: [
                        Column(
                          children: [
                            Image.asset(
                              "../assets/duo/la_donna.png",
                              width: 100,
                              height: 150,
                            ),
                            SizedBox(width: 20),
                            Text(
                              "la donna",
                              style:
                                  TextStyle(fontSize: 20, color: Colors.black),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  SizedBox(width: 20),
                  ElevatedButton(
                      onPressed: () {},
                      style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            // borderRadius: BorderRadius.circular(2),
                            side: BorderSide(
                                color: Color.fromARGB(255, 167, 163, 163),
                                width: 1),
                          ),
                          padding: EdgeInsets.symmetric(
                              horizontal: 15, vertical: 20)),
                      child: Row(
                        children: [
                          Column(
                            children: [
                              Image.asset(
                                "../assets/home/logo.png",
                                width: 100,
                                height: 150,
                              ),
                              Text(
                                "l'uomo",
                                style: TextStyle(
                                    fontSize: 20, color: Colors.black),
                              ),
                            ],
                          ),
                        ],
                      )),
                ],
              ),
              SizedBox(
                height: 20,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(2),
                          side: BorderSide(
                              color: Color.fromARGB(255, 167, 163, 163),
                              width: 1),
                        ),
                        padding:
                            EdgeInsets.symmetric(horizontal: 15, vertical: 20)),
                    child: Row(
                      children: [
                        Column(
                          children: [
                            Image.asset(
                              "../assets/duo/il_ragazzo.png",
                              width: 100,
                              height: 150,
                            ),
                            Text(
                              "il ragazzo",
                              style:
                                  TextStyle(fontSize: 20, color: Colors.black),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  SizedBox(width: 20),
                  ElevatedButton(
                      onPressed: () {},
                      style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            // borderRadius: BorderRadius.circular(2),
                            side: BorderSide(
                                color: Color.fromARGB(255, 167, 163, 163),
                                width: 1),
                          ),
                          padding: EdgeInsets.symmetric(
                              horizontal: 15, vertical: 20)),
                      child: Row(
                        children: [
                          Column(
                            children: [
                              Image.asset(
                                "../assets/duo/la_ragazza.png",
                                width: 100,
                                height: 150,
                              ),
                              Text(
                                "la ragazza",
                                style: TextStyle(
                                    fontSize: 20, color: Colors.black),
                              ),
                            ],
                          ),
                        ],
                      )),
                ],
              ),
              SizedBox(
                height: 60,
              ),
              ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color.fromARGB(255, 148, 228, 148),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(5)),
                    minimumSize: Size(200, 50),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        "CHECK",
                        style: TextStyle(
                            fontSize: 20,
                            color: Color.fromARGB(255, 15, 15, 15)),
                      )
                    ],
                  )),
            ],
          ),
        ),
      ),
      bottomNavigationBar: Footer(),
    );
  }
}
