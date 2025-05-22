import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:async';
import 'package:flutter/foundation.dart' show kIsWeb;

class AuthProvider with ChangeNotifier {
  String? _token;
  String? _username;
  bool _isLoading = false;

  bool get isAuthenticated => _token != null;
  bool get isLoading => _isLoading;
  String? get username => _username;
  String? get token => _token;

  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:8000'; // For web browser
    } else {
      return 'http://10.0.2.2:8000'; // For Android emulator
    }
  }

  AuthProvider() {
    _loadToken();
  }

  Future<void> _loadToken() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('token');
    _username = prefs.getString('username');
    notifyListeners();
  }

  Future<void> _saveToken(String token, String username) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);
    await prefs.setString('username', username);
    _token = token;
    _username = username;
    notifyListeners();
  }

  Future<void> _clearToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('username');
    _token = null;
    _username = null;
    notifyListeners();
  }

  static Future<bool> testConnection() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ).timeout(
        const Duration(seconds: 5),
        onTimeout: () {
          throw TimeoutException('Connection test timed out after 5 seconds');
        },
      );

      print('Connection test response status: ${response.statusCode}');
      print('Connection test response body: ${response.body}');
      return response.statusCode == 200;
    } catch (e) {
      print('Connection test error: $e');
      return false;
    }
  }

  Future<Map<String, dynamic>> get(String endpoint) async {
    try {
      if (_token == null) {
        throw Exception('User is not logged in. Please log in first.');
      }

      // Ensure endpoint has trailing slash
      if (!endpoint.endsWith('/')) {
        endpoint = '$endpoint/';
      }

      print('Making GET request to: $baseUrl$endpoint');
      print('Using token: Yes');

      final response = await http.get(
        Uri.parse('$baseUrl$endpoint'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer $_token',
        },
      ).timeout(
        const Duration(seconds: 10),
        onTimeout: () {
          throw TimeoutException('Request timed out after 10 seconds');
        },
      );

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else if (response.statusCode == 401) {
        throw Exception('Authentication failed. Please log in again.');
      } else {
        throw Exception(
            'Failed to load data: ${response.statusCode} - ${response.body}');
      }
    } on TimeoutException catch (e) {
      print('Timeout error: $e');
      throw Exception(
          'Connection timed out. Please check if the server is running.');
    } catch (e) {
      print('Error in GET request: $e');
      rethrow;
    }
  }

  Future<Map<String, dynamic>> post(
      String endpoint, Map<String, dynamic> data) async {
    try {
      // Ensure endpoint has trailing slash
      if (!endpoint.endsWith('/')) {
        endpoint = '$endpoint/';
      }

      print('Making POST request to: $baseUrl$endpoint');
      print('Request data: $data');

      final response = await http
          .post(
        Uri.parse('$baseUrl$endpoint'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          if (_token != null) 'Authorization': 'Bearer $_token',
        },
        body: json.encode(data),
      )
          .timeout(
        const Duration(seconds: 10),
        onTimeout: () {
          throw TimeoutException('Request timed out after 10 seconds');
        },
      );

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        return json.decode(response.body);
      } else {
        throw Exception(
            'Failed to post data: ${response.statusCode} - ${response.body}');
      }
    } on TimeoutException catch (e) {
      print('Timeout error: $e');
      throw Exception(
          'Connection timed out. Please check if the server is running.');
    } catch (e) {
      print('Error in POST request: $e');
      rethrow;
    }
  }

  Future<bool> login(String username, String password) async {
    _isLoading = true;
    notifyListeners();

    // Test connection first
    final canConnect = await testConnection();
    if (!canConnect) {
      _isLoading = false;
      notifyListeners();
      return false;
    }

    try {
      final response = await post('/api/login/', {
        'username': username,
        'password': password,
      });

      await _saveToken(response['token'], username);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      print('Login error: $e');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> register(String username, String password, String email) async {
    _isLoading = true;
    notifyListeners();

    try {
      await post('/api/register/', {
        'username': username,
        'password': password,
        'email': email,
      });

      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      print('Registration error: $e');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    try {
      if (_token != null) {
        await post('/api/logout/', {});
      }
      await _clearToken();
    } catch (e) {
      print('Logout error: $e');
      await _clearToken();
    }
  }
}
