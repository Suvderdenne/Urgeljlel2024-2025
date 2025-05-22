import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:lottie/lottie.dart'; // For formatting date and time
import 'tests/header_footer.dart';

class Duolingo extends StatefulWidget {
  const Duolingo({super.key});

  @override
  State<Duolingo> createState() => _DuolingoState();
}

class _DuolingoState extends State<Duolingo> {


  String getFormattedDateTime() {
    DateTime now = DateTime.now();
    String formattedDate = DateFormat('EEEE, MMM d, yyyy').format(now);
    String formattedTime = DateFormat('h:mm a').format(now);
    return "$formattedDate at $formattedTime";
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Center(
          child: Text(
            "News Feed",
            style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold),
          ),
        ),
        backgroundColor: Colors.white,
      ),
      body: Align(
        alignment: Alignment.topCenter,
        child: SingleChildScrollView(
          child: Column(
            children: [
              Container(
                margin: EdgeInsets.only(top: 40),
                height: 350,
                width: 350,
                decoration: BoxDecoration(
                  color: Colors.white, // Background color
                  borderRadius: BorderRadius.circular(15), // Rounded corners
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.5),
                      spreadRadius: 5,
                      blurRadius: 7,
                      offset: Offset(0, 3), // changes position of shadow
                    ),
                  ],
                  border: Border.all(
                    color: Colors.blueAccent, // Border color
                    width: 2, // Border width
                  ),
                ),
                child: Padding(
                  padding: EdgeInsets.all(20),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(15),
                        child: Image.asset(
                          "../assets/tlapse/qw.png",
                          fit: BoxFit.cover,
                          alignment: Alignment.centerLeft,
                        ),
                      ),
                      SizedBox(height: 10),
                      Text(
                        "Sitly sentences help us learn",
                        style: TextStyle(
                          color: Colors.black,
                          fontWeight: FontWeight.bold,
                          fontSize: 20,
                        ),
                      ),
                      Text(
                        "In our recent blog post, we explain the superpower behind quirky sentences.",
                        style: TextStyle(
                          color: Colors.grey,
                          fontSize: 15,
                        ),
                      ),
                      SizedBox(height: 10),
                      Text(
                        getFormattedDateTime(),
                        style: TextStyle(
                          color: Colors.grey,
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Container(
                margin: EdgeInsets.only(top: 40),
                height: 350,
                width: 350,
                decoration: BoxDecoration(
                  color: Colors.white, // Background color
                  borderRadius: BorderRadius.circular(15), // Rounded corners
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.5),
                      spreadRadius: 5,
                      blurRadius: 7,
                      offset: Offset(0, 3), // changes position of shadow
                    ),
                  ],
                  border: Border.all(
                    color: Colors.blueAccent, // Border color
                    width: 2, // Border width
                  ),
                ),
                child: Padding(
                  padding: EdgeInsets.all(20),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(15),
                        child: Image.asset(
                          "../assets/tlapse/add.jpg",
                          fit: BoxFit.cover,
                          alignment: Alignment.centerLeft,
                        ),
                      ),
                      SizedBox(height: 10),
                      Text(
                        "Sitly sentences help us learn",
                        style: TextStyle(
                          color: Colors.black,
                          fontWeight: FontWeight.bold,
                          fontSize: 20,
                        ),
                      ),
                      Text(
                        "In our recent blog post, we explain the superpower behind quirky sentences.",
                        style: TextStyle(
                          color: Colors.grey,
                          fontSize: 15,
                        ),
                      ),
                      SizedBox(height: 10),
                      Text(
                        getFormattedDateTime(),
                        style: TextStyle(
                          color: Colors.grey,
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Container(
                margin: EdgeInsets.only(top: 40),
                height: 350,
                width: 350,
                decoration: BoxDecoration(
                  color: Colors.white, // Background color
                  borderRadius: BorderRadius.circular(15), // Rounded corners
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.5),
                      spreadRadius: 5,
                      blurRadius: 7,
                      offset: Offset(0, 3), // changes position of shadow
                    ),
                  ],
                  border: Border.all(
                    color: Colors.blueAccent, // Border color
                    width: 2, // Border width
                  ),
                ),
                child: Padding(
                  padding: EdgeInsets.all(20),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(15),
                        child: Image.asset(
                          "../assets/tlapse/img.jpg",
                          fit: BoxFit.cover,
                          alignment: Alignment.centerLeft,
                        ),
                      ),
                      SizedBox(height: 10),
                      Text(
                        "Sitly sentences help us learn",
                        style: TextStyle(
                          color: Colors.black,
                          fontWeight: FontWeight.bold,
                          fontSize: 20,
                        ),
                      ),
                      Text(
                        "In our recent blog post, we explain the superpower behind quirky sentences.",
                        style: TextStyle(
                          color: Colors.grey,
                          fontSize: 15,
                        ),
                      ),
                      SizedBox(height: 10),
                      Text(
                        getFormattedDateTime(),
                        style: TextStyle(
                          color: Colors.grey,
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Container(
                margin: EdgeInsets.only(top: 40),
                height: 350,
                width: 350,
                decoration: BoxDecoration(
                  color: Colors.white, // Background color
                  borderRadius: BorderRadius.circular(15), // Rounded corners
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.5),
                      spreadRadius: 5,
                      blurRadius: 7,
                      offset: Offset(0, 3), // changes position of shadow
                    ),
                  ],
                  border: Border.all(
                    color: Colors.blueAccent, // Border color
                    width: 2, // Border width
                  ),
                ),
                child: Padding(
                  padding: EdgeInsets.all(20),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(15),
                        child: Lottie.asset(
                          '../assets/tlapse/duo.json',
                          fit: BoxFit.cover,
                          alignment: Alignment.centerLeft,
                        ),
                      ),
                      SizedBox(height: 10),
                      Text(
                        "Sitly sentences help us learn",
                        style: TextStyle(
                          color: Colors.black,
                          fontWeight: FontWeight.bold,
                          fontSize: 20,
                        ),
                      ),
                      Text(
                        "In our recent blog post, we explain the superpower behind quirky sentences.",
                        style: TextStyle(
                          color: Colors.grey,
                          fontSize: 15,
                        ),
                      ),
                      SizedBox(height: 10),
                      Text(
                        getFormattedDateTime(),
                        style: TextStyle(
                          color: Colors.grey,
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: Footer(),
    );
  }
}
