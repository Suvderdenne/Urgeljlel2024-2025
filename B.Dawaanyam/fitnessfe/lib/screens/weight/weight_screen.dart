import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../providers/weight_provider.dart';

class WeightScreen extends StatefulWidget {
  const WeightScreen({super.key});

  @override
  State<WeightScreen> createState() => _WeightScreenState();
}

class _WeightScreenState extends State<WeightScreen> {
  final _weightController = TextEditingController();
  final _dateController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _dateController.text = DateFormat('yyyy-MM-dd').format(DateTime.now());
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<WeightProvider>(context, listen: false).loadWeightHistory();
    });
  }

  @override
  void dispose() {
    _weightController.dispose();
    _dateController.dispose();
    super.dispose();
  }

  Future<void> _addWeightEntry() async {
    if (_weightController.text.isNotEmpty) {
      final weight = double.tryParse(_weightController.text);
      if (weight != null) {
        final entry = WeightEntry(
          date: DateTime.parse(_dateController.text),
          weight: weight,
        );
        final success =
            await Provider.of<WeightProvider>(context, listen: false)
                .addWeightEntry(entry);
        if (success) {
          _weightController.clear();
        } else {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Failed to add weight entry')),
            );
          }
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Weight Tracker')),
      body: Consumer<WeightProvider>(
        builder: (context, weightProvider, child) {
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      children: [
                        TextFormField(
                          controller: _weightController,
                          decoration: const InputDecoration(
                            labelText: 'Weight (kg)',
                            suffixText: 'kg',
                          ),
                          keyboardType: TextInputType.number,
                        ),
                        const SizedBox(height: 16),
                        TextFormField(
                          controller: _dateController,
                          decoration: const InputDecoration(
                            labelText: 'Date',
                            suffixIcon: Icon(Icons.calendar_today),
                          ),
                          readOnly: true,
                          onTap: () async {
                            final date = await showDatePicker(
                              context: context,
                              initialDate: DateTime.now(),
                              firstDate: DateTime(2000),
                              lastDate: DateTime.now(),
                            );
                            if (date != null) {
                              _dateController.text =
                                  DateFormat('yyyy-MM-dd').format(date);
                            }
                          },
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed:
                              weightProvider.isLoading ? null : _addWeightEntry,
                          child: weightProvider.isLoading
                              ? const CircularProgressIndicator()
                              : const Text('Add Weight Entry'),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                if (weightProvider.weightHistory.isNotEmpty) ...[
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Progress Summary',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 8),
                          if (weightProvider.totalWeightLoss != null)
                            Text(
                              'Total Weight Loss: ${weightProvider.totalWeightLoss!.toStringAsFixed(1)} kg',
                              style: const TextStyle(fontSize: 16),
                            ),
                          if (weightProvider.projectedWeightLoss != null)
                            Text(
                              'Weekly Projection: ${weightProvider.projectedWeightLoss!.toStringAsFixed(1)} kg',
                              style: const TextStyle(fontSize: 16),
                            ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    height: 200,
                    child: LineChart(
                      LineChartData(
                        gridData: const FlGridData(show: false),
                        titlesData: FlTitlesData(
                          leftTitles: const AxisTitles(
                            sideTitles: SideTitles(showTitles: true),
                          ),
                          topTitles: const AxisTitles(
                            sideTitles: SideTitles(showTitles: false),
                          ),
                          rightTitles: const AxisTitles(
                            sideTitles: SideTitles(showTitles: false),
                          ),
                          bottomTitles: AxisTitles(
                            sideTitles: SideTitles(
                              showTitles: true,
                              getTitlesWidget: (value, meta) {
                                if (value.toInt() <
                                    weightProvider.weightHistory.length) {
                                  return Text(
                                    DateFormat('MM/dd').format(
                                      weightProvider
                                          .weightHistory[value.toInt()].date,
                                    ),
                                  );
                                }
                                return const Text('');
                              },
                            ),
                          ),
                        ),
                        borderData: FlBorderData(show: true),
                        lineBarsData: [
                          LineChartBarData(
                            spots: List.generate(
                              weightProvider.weightHistory.length,
                              (index) => FlSpot(
                                index.toDouble(),
                                weightProvider.weightHistory[index].weight,
                              ),
                            ),
                            isCurved: true,
                            color: Colors.blue,
                            dotData: const FlDotData(show: true),
                            belowBarData: BarAreaData(show: false),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Weight History',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  ...weightProvider.weightHistory.reversed.map((entry) => Card(
                        child: ListTile(
                          title: Text('${entry.weight.toStringAsFixed(1)} kg'),
                          subtitle: Text(
                            DateFormat('MMM dd, yyyy').format(entry.date),
                          ),
                        ),
                      )),
                ],
              ],
            ),
          );
        },
      ),
    );
  }
}
