import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class CustomBackButton extends StatelessWidget {
  final String? label;
  final VoidCallback? onPressed;
  final Color? color;

  const CustomBackButton({
    super.key,
    this.label,
    this.onPressed,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onPressed ?? () => Navigator.of(context).pop(),
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: Colors.grey[100],
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.arrow_back_ios_rounded,
              size: 20,
              color: color ?? Colors.black,
            ),
            if (label != null) ...[
              const SizedBox(width: 8),
              Text(
                label!,
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: color ?? Colors.black,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
