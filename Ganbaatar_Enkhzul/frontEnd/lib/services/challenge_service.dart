import 'dart:convert';
import 'package:http/http.dart' as http;
import 'auth_service.dart';
import '../include.dart';

class ChallengeService {
  static String baseUrl = baseurl + 'text';

  Future<List<Map<String, dynamic>>> getUserChallengeHistory() async {   
    try {
        // Хэрэглэгчийн сорилын түүхийг авах
      final token = await AuthService.getToken();
      if (token == null) {
        throw Exception('No authentication token found');
      }
      final response = await http.get(
        Uri.parse('$baseUrl/attempts/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token', 
        },
      );

      if (response.statusCode == 200) {      
        final List<dynamic> data = json.decode(response.body);         
        return data.map((item) => item as Map<String, dynamic>).toList();
      } else if (response.statusCode == 401) { 
        // Token expired or invalid 
        await AuthService.logout();
        throw Exception('Session expired. Please login again.');
      } else {
        throw Exception('Failed to load challenge history');
      }
    } catch (e) {
      throw Exception('Error fetching challenge history: $e');
    }
  }
  // Сорилын үр дүнг серверт хадгалах
  Future<void> saveAttempt({
    required int challengeId,
    required int correctWordCount,
    required int wrongWordCount,
    required int durationSeconds,
  }) async {
    try {
      final token = await AuthService.getToken();
      if (token == null) {
        throw Exception('No authentication token found');
      }
      final data = {
        'challenge': challengeId,
        'correct_word_count': correctWordCount,
        'wrong_word_count': wrongWordCount,
        'duration_seconds': durationSeconds,
      };

      print('Sending attempt data: ${json.encode(data)}');

// POST хүсэлтээр сервер рүү өгөгдлөө илгээнэ
      final response = await http.post(
        Uri.parse('$baseUrl/attempts/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode(data),
      );

      if (response.statusCode != 201) {
        print('Server response: ${response.body}');
        throw Exception(
            'Failed to save attempt: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      print('Error in saveAttempt: $e');
      throw Exception('Error saving attempt: $e');
    }
  }
  // Тодорхой хэл, төвшин, хугацаагаар random сорил авах sanamsarq soril tatah
  Future<Map<String, dynamic>> getChallenge(
      String langCode, String level, int minutes) async {
    try {
      final token = await AuthService.getToken();
      if (token == null) {
        throw Exception('No authentication token found');
      }
      // Random сорил авах GET хүсэлт
      final response = await http.get(
        Uri.parse(
            '$baseUrl/random-challenge/?lang_code=$langCode&level=$level&minutes=$minutes'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        print('Raw response: ${response.body}');

        String? charset =
            response.headers['content-type']?.contains('charset=') == true
                ? response.headers['content-type']!.split('charset=')[1]
                : null;

        print('Response charset: $charset');

        var responseData = json.decode(utf8.decode(response.bodyBytes));      

        if (responseData.containsKey('text')) {
          print('Challenge text: ${responseData['text']}');
        }

        return responseData;
      } else if (response.statusCode == 401) {
        await AuthService.logout();
        throw Exception('Session expired. Please login again.');
      } else {
        throw Exception('Failed to fetch challenge');
      }
    } catch (e) {
      throw Exception('Error fetching challenge: $e');
    }
  }
}
