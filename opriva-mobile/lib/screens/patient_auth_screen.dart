import 'package:flutter/material.dart';
import '../core/theme/opriva_theme.dart';
import '../core/services/local_ticket_storage_service.dart';

class PatientAuthScreen extends StatefulWidget {
  final VoidCallback? onAuthSuccess;

  const PatientAuthScreen({Key? key, this.onAuthSuccess}) : super(key: key);

  @override
  State<PatientAuthScreen> createState() => _PatientAuthScreenState();
}

class _PatientAuthScreenState extends State<PatientAuthScreen> {
  bool _isSignUp = false;

  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  String? _errorMsg;
  bool _loading = false;

  void _handleSubmit() async {
    setState(() {
      _errorMsg = null;
      _loading = true;
    });

    await Future.delayed(const Duration(milliseconds: 300));

    if (_isSignUp) {
      if (_nameController.text.trim().isEmpty ||
          _phoneController.text.trim().isEmpty ||
          _passwordController.text.isEmpty) {
        setState(() {
          _errorMsg = 'Please enter name, phone number, and password.';
          _loading = false;
        });
        return;
      }

      final success = LocalTicketStorageService.register(
        fullName: _nameController.text,
        phone: _phoneController.text,
        email: _emailController.text,
        password: _passwordController.text,
      );

      if (!success) {
        setState(() {
          _errorMsg = 'Phone number is already registered. Please log in.';
          _loading = false;
        });
        return;
      }
    } else {
      // Login
      if (_phoneController.text.trim().isEmpty || _passwordController.text.isEmpty) {
        setState(() {
          _errorMsg = 'Please enter your registered phone/email and password.';
          _loading = false;
        });
        return;
      }

      final ok = LocalTicketStorageService.login(
        _phoneController.text,
        _passwordController.text,
      );

      if (!ok) {
        setState(() {
          _errorMsg = 'Invalid credentials. Use demo: 9876543210 / password123';
          _loading = false;
        });
        return;
      }
    }

    setState(() => _loading = false);
    if (widget.onAuthSuccess != null) {
      widget.onAuthSuccess!();
    } else {
      Navigator.pop(context, true);
    }
  }

  void _quickDemoFill() {
    setState(() {
      _isSignUp = false;
      _phoneController.text = '9876543210';
      _passwordController.text = 'password123';
      _errorMsg = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(_isSignUp ? 'Create Patient Account' : 'Patient Sign In'),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header Emblem
            Center(
              child: Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: const Color(0xFFF0FDF4),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFBBF7D0)),
                ),
                child: const Icon(
                  Icons.person_pin,
                  size: 44,
                  color: OprivaTheme.healthcareTeal,
                ),
              ),
            ),
            const SizedBox(height: 16),

            Text(
              _isSignUp
                  ? 'Join Opriva Patient Care'
                  : 'Welcome Back to Opriva',
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w900,
                color: OprivaTheme.navyDark,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              _isSignUp
                  ? 'Save and sync your OP registration tickets, view past consultation history, and navigate to hospitals.'
                  : 'Log in to view your booked active tokens, medical prescriptions, and navigation maps.',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 12, color: Colors.black54),
            ),
            const SizedBox(height: 24),

            // Tab Switcher
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: InkWell(
                      onTap: () => setState(() => _isSignUp = false),
                      borderRadius: BorderRadius.circular(12),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        decoration: BoxDecoration(
                          color: !_isSignUp ? Colors.white : Colors.transparent,
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: !_isSignUp
                              ? [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.05),
                                    blurRadius: 4,
                                  )
                                ]
                              : null,
                        ),
                        child: Text(
                          'Sign In',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: !_isSignUp
                                ? OprivaTheme.healthcareTeal
                                : Colors.black54,
                          ),
                        ),
                      ),
                    ),
                  ),
                  Expanded(
                    child: InkWell(
                      onTap: () => setState(() => _isSignUp = true),
                      borderRadius: BorderRadius.circular(12),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        decoration: BoxDecoration(
                          color: _isSignUp ? Colors.white : Colors.transparent,
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: _isSignUp
                              ? [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.05),
                                    blurRadius: 4,
                                  )
                                ]
                              : null,
                        ),
                        child: Text(
                          'Register (Sign Up)',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: _isSignUp
                                ? OprivaTheme.healthcareTeal
                                : Colors.black54,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            if (_isSignUp) ...[
              TextField(
                controller: _nameController,
                decoration: InputDecoration(
                  labelText: 'Patient Full Name',
                  prefixIcon: const Icon(Icons.badge_outlined),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                ),
              ),
              const SizedBox(height: 12),
            ],

            TextField(
              controller: _phoneController,
              keyboardType: TextInputType.phone,
              decoration: InputDecoration(
                labelText: _isSignUp ? 'Mobile Phone Number' : 'Registered Phone or Email',
                prefixIcon: const Icon(Icons.phone_outlined),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              ),
            ),
            const SizedBox(height: 12),

            if (_isSignUp) ...[
              TextField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: InputDecoration(
                  labelText: 'Email Address (Optional)',
                  prefixIcon: const Icon(Icons.email_outlined),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                ),
              ),
              const SizedBox(height: 12),
            ],

            TextField(
              controller: _passwordController,
              obscureText: true,
              decoration: InputDecoration(
                labelText: 'Account Password',
                prefixIcon: const Icon(Icons.lock_outline),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              ),
            ),
            const SizedBox(height: 16),

            if (_errorMsg != null)
              Container(
                margin: const EdgeInsets.only(bottom: 14),
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF2F2),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: const Color(0xFFFECACA)),
                ),
                child: Text(
                  _errorMsg!,
                  style: const TextStyle(fontSize: 12, color: Color(0xFFB91C1C), fontWeight: FontWeight.bold),
                ),
              ),

            ElevatedButton(
              onPressed: _loading ? null : _handleSubmit,
              style: ElevatedButton.styleFrom(
                backgroundColor: OprivaTheme.healthcareTeal,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: _loading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                    )
                  : Text(
                      _isSignUp ? 'Create Account & Continue' : 'Sign In to My OP Cards',
                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900),
                    ),
            ),
            const SizedBox(height: 14),

            // Demo Login Button
            OutlinedButton.icon(
              onPressed: _quickDemoFill,
              icon: const Icon(Icons.bolt, color: OprivaTheme.healthcareTeal, size: 18),
              label: const Text('1-Click Demo Patient Fill (9876543210)'),
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: Color(0xFF99F6E4)),
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
