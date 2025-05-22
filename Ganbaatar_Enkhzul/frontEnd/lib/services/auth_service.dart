import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../include.dart';

class AuthService {
  static const String _tokenKey = 'auth_token';
  static const String _userDataKey = 'user_data';
  static const String _userIdKey = 'user_id';

  // Get the stored token   
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  // Get the stored user ID   
  static Future<int?> getUserId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(_userIdKey);
  }

  // Save the token   
  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
  }

  // Save the user ID  
  static Future<void> saveUserId(int userId) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(_userIdKey, userId);
  }

  // Save user data 
  static Future<void> saveUserData(Map<String, dynamic> userData) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userDataKey, json.encode(userData));
  }

  // Get user data    
  static Future<Map<String, dynamic>?> getUserData() async {
    final prefs = await SharedPreferences.getInstance();
    final userDataString = prefs.getString(_userDataKey);
    if (userDataString != null) {
      return json.decode(userDataString) as Map<String, dynamic>;
    }
    return null;
  }

  // Clear stored data (for logout)  
  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_userDataKey);
    await prefs.remove(_userIdKey);
  }

  // Login API
  static Future<Map<String, dynamic>> login(
      String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('${baseurl}users/login/'),
        headers: {"Content-Type": "application/json"},
        body: json.encode({
          'email': email,
          'password': password,
        }),
      );
      // Хэрэв амжилттай нэвтэрвэл
      if (response.statusCode == 200) {
        final responseData = json.decode(response.body);
        print('Login response: $responseData'); // Debug print
        // Токен хадгалах
        if (responseData['token'] != null) {
          await saveToken(responseData['token']);

          // Extract and save user ID        
          final userId = responseData['user_id'] ?? responseData['user']?['id'];
          if (userId != null) {
            print('Saving user ID: $userId'); // Debug print
            await saveUserId(userId);
          } else {
            print('No user ID found in response'); // Debug print
            throw Exception('No user ID in login response');
          }

          // Save user data if available           
          if (responseData['user'] != null) {
            await saveUserData(responseData['user']);
          }
        }
        return responseData;
      } else {
        print(
            'Login failed with status: ${response.statusCode}'); // Debug print
        print('Response body: ${response.body}'); // Debug print
        throw Exception('Failed to login: ${response.body}');
      }
    } catch (e) {
      print('Login error: $e'); // Debug print
      throw Exception('Login failed: $e');
    }
  }

  // Register API
  static Future<Map<String, dynamic>> register(
      String username, String email, String password) async {
    final response = await http.post(
      Uri.parse('${baseurl}users/register/'),
      headers: {"Content-Type": "application/json"},
      body: json.encode({
        'username': username,
        'email': email,
        'password': password,
      }),
    );

    if (response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to register: ${response.body}');
    }
  }
}
