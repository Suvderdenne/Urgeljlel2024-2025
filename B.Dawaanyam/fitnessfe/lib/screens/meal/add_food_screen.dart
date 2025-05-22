import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../widgets/custom_back_button.dart';
import '../../providers/auth_provider.dart';

class AddFoodScreen extends StatefulWidget {
  const AddFoodScreen({super.key});

  @override
  State<AddFoodScreen> createState() => _AddFoodScreenState();
}

class _AddFoodScreenState extends State<AddFoodScreen> {
  String _selectedMeal = 'Lunch';
  final _foodNameController = TextEditingController();
  final _quantityController = TextEditingController();
  final _caloriesController = TextEditingController();
  String _selectedUnit = 'g';
  final List<MealType> _mealTypes = [
    MealType(name: 'Breakfast', emoji: '🍳'),
    MealType(name: 'Lunch', emoji: '🍔'),
    MealType(name: 'Dinner', emoji: '🍝'),
    MealType(name: 'Snack', emoji: '🍌'),
  ];

  List<FoodItem> _recentFoods = [];
  int _totalCaloriesToday = 0;
  int _calorieGoal = 2000;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final recentFoodsResponse =
          await authProvider.get('/api/get_recent_foods/');
      final dailyCaloriesResponse =
          await authProvider.get('/api/get_daily_calories/');

      setState(() {
        _recentFoods = (recentFoodsResponse['recent_foods'] as List)
            .map((food) => FoodItem(
                  name: food['name'],
                  calories: food['calories'],
                  quantity: food['quantity'],
                  unit: food['unit'],
                  mealType: food['meal_type'],
                ))
            .toList();

        _totalCaloriesToday = dailyCaloriesResponse['total_calories'];
        _calorieGoal = dailyCaloriesResponse['calorie_goal'];
        _isLoading = false;
      });
    } catch (e) {
      // Handle error
      setState(() {
        _isLoading = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error loading data: $e')),
        );
      }
    }
  }

  Future<void> _addFood() async {
    if (_foodNameController.text.isEmpty) return;

    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final response = await authProvider.post('/api/add_food/', {
        'food_name': _foodNameController.text,
        'quantity': double.parse(_quantityController.text),
        'unit': _selectedUnit,
        'calories': int.parse(_caloriesController.text),
        'meal_type': _selectedMeal,
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Food added successfully')),
        );
      }

      setState(() {
        _foodNameController.clear();
        _quantityController.clear();
        _caloriesController.clear();
      });

      // Reload data
      await _loadData();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error adding food: $e')),
        );
      }
    }
  }

  Future<void> _searchFoods(String query) async {
    if (query.isEmpty) return;

    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final response =
          await authProvider.get('/api/search_foods/?query=$query');
      setState(() {
        _recentFoods = (response['results'] as List)
            .map((food) => FoodItem(
                  name: food['name'],
                  calories: food['calories'],
                  quantity: food['quantity'],
                  unit: food['unit'],
                ))
            .toList();
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error searching foods: $e')),
        );
      }
    }
  }

  @override
  void dispose() {
    _foodNameController.dispose();
    _quantityController.dispose();
    _caloriesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const CustomBackButton(),
                  const SizedBox(height: 20),
                  Text(
                    'Track what you eat today',
                    style: GoogleFonts.poppins(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 20),
                  // Search Bar
                  TextField(
                    onChanged: _searchFoods,
                    decoration: InputDecoration(
                      hintText: 'Search food...',
                      hintStyle: GoogleFonts.poppins(
                        color: Colors.grey[400],
                        fontSize: 16,
                      ),
                      prefixIcon: const Icon(Icons.search),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(15),
                        borderSide: BorderSide.none,
                      ),
                      filled: true,
                      fillColor: Colors.grey[100],
                    ),
                  ),
                  const SizedBox(height: 20),
                  // Meal Type Tabs
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: _mealTypes.map((type) {
                        bool isSelected = _selectedMeal == type.name;
                        return Padding(
                          padding: const EdgeInsets.only(right: 20),
                          child: GestureDetector(
                            onTap: () =>
                                setState(() => _selectedMeal = type.name),
                            child: Column(
                              children: [
                                Row(
                                  children: [
                                    Text(
                                      type.emoji,
                                      style: const TextStyle(fontSize: 20),
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      type.name,
                                      style: GoogleFonts.poppins(
                                        fontSize: 18,
                                        fontWeight: isSelected
                                            ? FontWeight.w600
                                            : FontWeight.normal,
                                        color: isSelected
                                            ? Colors.black
                                            : Colors.grey,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 5),
                                if (isSelected)
                                  Container(
                                    height: 3,
                                    width: 30,
                                    decoration: BoxDecoration(
                                      color: Theme.of(context).primaryColor,
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                  ),
                              ],
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : SingleChildScrollView(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 20.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Quick Add / Recently Added',
                              style: GoogleFonts.poppins(
                                fontSize: 18,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(height: 15),
                            // Recent Foods List
                            ListView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemCount: _recentFoods.length,
                              itemBuilder: (context, index) =>
                                  _buildFoodItem(_recentFoods[index]),
                            ),
                            const SizedBox(height: 30),
                            Text(
                              'Add Food Manually',
                              style: GoogleFonts.poppins(
                                fontSize: 18,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(height: 15),
                            _buildManualAddSection(),
                            const SizedBox(height: 20),
                          ],
                        ),
                      ),
                    ),
            ),
            _buildBottomSummary(),
          ],
        ),
      ),
    );
  }

  Widget _buildFoodItem(FoodItem food) {
    return Container(
      margin: const EdgeInsets.only(bottom: 15),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: Theme.of(context).primaryColor.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.add,
              color: Theme.of(context).primaryColor,
            ),
          ),
          const SizedBox(width: 15),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  food.name,
                  style: GoogleFonts.poppins(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  '${food.quantity} ${food.unit}',
                  style: GoogleFonts.poppins(
                    fontSize: 14,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 10),
          Text(
            '${food.calories} kcal',
            style: GoogleFonts.poppins(
              fontSize: 14,
              color: Colors.grey[600],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildManualAddSection() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.grey[100],
        borderRadius: BorderRadius.circular(15),
      ),
      child: Column(
        children: [
          // Food Name Field
          Row(
            children: [
              const Text('🥗', style: TextStyle(fontSize: 24)),
              const SizedBox(width: 10),
              Expanded(
                child: TextField(
                  controller: _foodNameController,
                  decoration: InputDecoration(
                    hintText: 'Food name',
                    hintStyle: TextStyle(color: Colors.grey[400]),
                    border: const UnderlineInputBorder(),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          // Quantity Field
          Row(
            children: [
              const Text('⚖️', style: TextStyle(fontSize: 24)),
              const SizedBox(width: 10),
              Expanded(
                child: TextField(
                  controller: _quantityController,
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(
                    hintText: 'Quantity',
                    hintStyle: TextStyle(color: Colors.grey[400]),
                    border: const UnderlineInputBorder(),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Container(
                width: 80,
                child: DropdownButton<String>(
                  value: _selectedUnit,
                  isExpanded: true,
                  items: ['g', 'piece', 'cup'].map((String value) {
                    return DropdownMenuItem<String>(
                      value: value,
                      child: Text(value),
                    );
                  }).toList(),
                  onChanged: (String? newValue) {
                    if (newValue != null) {
                      setState(() => _selectedUnit = newValue);
                    }
                  },
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          // Calories Field
          Row(
            children: [
              const Text('🔢', style: TextStyle(fontSize: 24)),
              const SizedBox(width: 10),
              Expanded(
                child: TextField(
                  controller: _caloriesController,
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(
                    hintText: 'Calories (optional)',
                    hintStyle: TextStyle(color: Colors.grey[400]),
                    border: const UnderlineInputBorder(),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 25),
          // Add Button
          SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton(
              onPressed: _addFood,
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).primaryColor,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              child: Text(
                'Add Food',
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomSummary() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            spreadRadius: 0,
            blurRadius: 10,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Total Calories Today',
                  style: GoogleFonts.poppins(
                    fontSize: 14,
                    color: Colors.grey[600],
                  ),
                ),
                Text(
                  '$_totalCaloriesToday kcal',
                  style: GoogleFonts.poppins(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Remaining',
                  style: GoogleFonts.poppins(
                    fontSize: 14,
                    color: Colors.grey[600],
                  ),
                ),
                Text(
                  '${_calorieGoal - _totalCaloriesToday} kcal',
                  style: GoogleFonts.poppins(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: Theme.of(context).primaryColor,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class FoodItem {
  final String name;
  final int calories;
  final double quantity;
  final String unit;
  final String? mealType;

  FoodItem({
    required this.name,
    required this.calories,
    required this.quantity,
    required this.unit,
    this.mealType,
  });
}

class MealType {
  final String name;
  final String emoji;

  MealType({required this.name, required this.emoji});
}
