import 'package:flutter/material.dart';

class OprivaTheme {
  // Brand Healthcare Palette
  static const Color navyPrimary = Color(0xFF0B2545);
  static const Color navyDark = Color(0xFF0F172A);
  static const Color healthcareTeal = Color(0xFF0D9488);
  static const Color tealAccent = Color(0xFF14B8A6);
  static const Color softGreen = Color(0xFF10B981);
  static const Color amberWarning = Color(0xFFF59E0B);
  static const Color redError = Color(0xFFEF4444);
  static const Color backgroundLight = Color(0xFFF8FAFC);
  static const Color cardSurface = Colors.white;

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: healthcareTeal,
        primary: navyPrimary,
        secondary: healthcareTeal,
        tertiary: softGreen,
        surface: cardSurface,
        background: backgroundLight,
        error: redError,
      ),
      scaffoldBackgroundColor: backgroundLight,
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.white,
        foregroundColor: navyDark,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: navyDark,
          fontSize: 18,
          fontWeight: FontWeight.w700,
        ),
      ),
      cardTheme: CardTheme(
        color: Colors.white,
        elevation: 1,
        shadowColor: Colors.black.withOpacity(0.04),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: Color(0xFFE2E8F0)),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: healthcareTeal,
          foregroundColor: Colors.white,
          elevation: 1,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          textStyle: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
    );
  }
}
