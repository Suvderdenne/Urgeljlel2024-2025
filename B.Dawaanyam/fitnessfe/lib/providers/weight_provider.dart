import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../providers/auth_provider.dart';

class WeightEntry {
  final DateTime date;
  final double weight;

  WeightEntry({
    required this.date,
    required this.weight,
  });

  factory WeightEntry.fromJson(Map<String, dynamic> json) {
    return WeightEntry(
      date: DateTime.parse(json['date']),
      weight: json['weight_kg'].toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'date': date.toIso8601String(),
      'weight_kg': weight,
    };
  }
}

class WeightProvider with ChangeNotifier {
  final AuthProvider _authProvider;
  List<WeightEntry> _weightHistory = [];
  bool _isLoading = false;
  double? _projectedWeightLoss;
  double? _totalWeightLoss;

  WeightProvider(this._authProvider);

  List<WeightEntry> get weightHistory => _weightHistory;
  bool get isLoading => _isLoading;
  double? get projectedWeightLoss => _projectedWeightLoss;
  double? get totalWeightLoss => _totalWeightLoss;

  Future<void> loadWeightHistory() async {
    if (_authProvider.isAuthenticated) {
      _isLoading = true;
      notifyListeners();

      try {
        final response = await http.get(
          Uri.parse('http://localhost:8000/api/weight-logs/'),
          headers: {
            'Authorization': 'Bearer ${_authProvider.token}',
          },
        );

        if (response.statusCode == 200) {
          final List<dynamic> data = json.decode(response.body);
          _weightHistory = data
              .map((entry) => WeightEntry.fromJson(entry))
              .toList()
            ..sort((a, b) => a.date.compareTo(b.date));
          _calculateProjections();
        }
      } catch (e) {
        print('Error loading weight history: $e');
      }

      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> addWeightEntry(WeightEntry entry) async {
    if (_authProvider.isAuthenticated) {
      _isLoading = true;
      notifyListeners();

      try {
        final response = await http.post(
          Uri.parse('http://localhost:8000/api/weight-logs/'),
          headers: {
            'Authorization': 'Bearer ${_authProvider.token}',
            'Content-Type': 'application/json',
          },
          body: json.encode(entry.toJson()),
        );

        if (response.statusCode == 201) {
          await loadWeightHistory();
          return true;
        }
      } catch (e) {
        print('Error adding weight entry: $e');
      }

      _isLoading = false;
      notifyListeners();
    }
    return false;
  }

  void _calculateProjections() {
    if (_weightHistory.length >= 2) {
      final firstEntry = _weightHistory.first;
      final lastEntry = _weightHistory.last;
      final daysBetween = lastEntry.date.difference(firstEntry.date).inDays;
      final weightDiff = firstEntry.weight - lastEntry.weight;

      _totalWeightLoss = weightDiff;
      if (daysBetween > 0) {
        _projectedWeightLoss =
            (weightDiff / daysBetween) * 7; // Weekly projection
      }
    }
  }
}
