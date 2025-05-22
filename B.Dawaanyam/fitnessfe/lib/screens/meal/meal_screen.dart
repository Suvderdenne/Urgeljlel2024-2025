import 'package:flutter/material.dart';

class MealScreen extends StatelessWidget {
  const MealScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Meal Recommendations')),
      body: ListView(
        padding: const EdgeInsets.all(16.0),
        children: [
          _buildMealCard(
            'Breakfast',
            'High Protein Breakfast',
            [
              '2 eggs (scrambled or boiled)',
              '1 slice whole grain toast',
              '1/2 avocado',
              '1 cup green tea',
            ],
            450,
          ),
          const SizedBox(height: 16),
          _buildMealCard(
            'Lunch',
            'Balanced Lunch',
            [
              'Grilled chicken breast (150g)',
              '1 cup brown rice',
              'Steamed vegetables (broccoli, carrots)',
              '1 tbsp olive oil',
            ],
            600,
          ),
          const SizedBox(height: 16),
          _buildMealCard(
            'Dinner',
            'Light Dinner',
            [
              'Baked salmon (150g)',
              'Quinoa salad with mixed greens',
              '1 tbsp balsamic vinaigrette',
              '1 cup herbal tea',
            ],
            500,
          ),
          const SizedBox(height: 16),
          _buildMealCard(
            'Snacks',
            'Healthy Snacks',
            [
              'Greek yogurt with berries',
              'Handful of almonds',
              'Carrot and celery sticks',
              'Protein shake (optional)',
            ],
            300,
          ),
        ],
      ),
    );
  }

  Widget _buildMealCard(
    String mealType,
    String title,
    List<String> items,
    int calories,
  ) {
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  mealType,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.blue,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.orange.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    '$calories kcal',
                    style: const TextStyle(
                      color: Colors.orange,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              title,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'Ingredients:',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 8),
            ...items.map((item) => Padding(
                  padding: const EdgeInsets.only(left: 8.0, bottom: 4.0),
                  child: Row(
                    children: [
                      const Icon(Icons.fiber_manual_record, size: 8),
                      const SizedBox(width: 8),
                      Expanded(child: Text(item)),
                    ],
                  ),
                )),
          ],
        ),
      ),
    );
  }
}
