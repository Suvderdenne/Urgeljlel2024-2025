import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/widgets.dart';



class LeaderboardPG extends StatefulWidget {
  const LeaderboardPG({super.key});

  @override
  State<LeaderboardPG> createState() => _LeaderboardPGState();
}

class _LeaderboardPGState extends State<LeaderboardPG> {
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
            ),
          ],
        ),
      ),
      body: Stack(
        children: [
          // Rank 1st
          Positioned(
            top: 140,
            right: 200,
            child: rank(
                radius: 45.0,
                height: 25,
                image: "Leaderboard/Profile1.png",
                name: "Name 1",
                point: "10/10"),
          ),
          // for rank 2nd
          Positioned(
            top: 240,
            left: 45,
            child: rank(
                radius: 30.0,
                height: 10,
                image: "Leaderboard/Profile2.png",
                name: "Name 2",
                point: "9/10"),
          ),
          // For 3rd rank
          Positioned(
            top: 263,
            right: 50,
            child: rank(
                radius: 30.0,
                height: 10,
                image: "Leaderboard/Profile3.png",
                name: "Name 3",
                point: "8/10"),
          ),
        ],
      ),
    );
  }

  Column rank({
    required double radius,
    required double height,
    required String image,
    required String name,
    required String point,
  }) {
    return Column(
      children: [
        CircleAvatar(
          radius: radius,
          backgroundImage: AssetImage(image),
        ),
        SizedBox(
          height: height,
        ),
        Text(
          name,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        SizedBox(
          height: height,
        ),
        Container(
          height: 25,
          width: 70,
          decoration: BoxDecoration(
              color: Colors.black54, borderRadius: BorderRadius.circular(50)),
          child: Row(
            children: [
              const SizedBox(
                width: 5,
              ),
              const Icon(
                Icons.back_hand,
                color: Color.fromARGB(255, 255, 187, 0),
              ),
              const SizedBox(
                width: 5,
              ),
              Text(
                point,
                style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 10,
                    color: Colors.white),
              ),
            ],
          ),
        ),
      ],
    );
  }
}