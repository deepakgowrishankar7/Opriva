import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'core/theme/opriva_theme.dart';
import 'core/localization/app_localizations.dart';
import 'screens/splash_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const OprivaApp());
}

class OprivaApp extends StatefulWidget {
  const OprivaApp({Key? key}) : super(key: key);

  static void setLocale(BuildContext context, Locale newLocale) {
    _OprivaAppState? state = context.findAncestorStateOfType<_OprivaAppState>();
    state?.setLocale(newLocale);
  }

  @override
  State<OprivaApp> createState() => _OprivaAppState();
}

class _OprivaAppState extends State<OprivaApp> {
  Locale _locale = const Locale('en');

  void setLocale(Locale locale) {
    setState(() {
      _locale = locale;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Opriva',
      debugShowCheckedModeBanner: false,
      theme: OprivaTheme.lightTheme,
      locale: _locale,
      supportedLocales: AppLocalizations.supportedLocales,
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      localeResolutionCallback: (locale, supportedLocales) {
        if (locale == null) return supportedLocales.first;
        for (var supportedLocale in supportedLocales) {
          if (supportedLocale.languageCode == locale.languageCode) {
            return supportedLocale;
          }
        }
        return supportedLocales.first;
      },
      home: const SplashScreen(),
    );
  }
}
