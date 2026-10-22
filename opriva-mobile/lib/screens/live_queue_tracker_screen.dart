import 'package:flutter/material.dart';
import '../core/theme/opriva_theme.dart';
import 'medical_reports_screen.dart';
import 'hospital_map_screen.dart';

class LiveQueueTrackerScreen extends StatefulWidget {
  final String hospitalName;
  final String opRegistrationNumber;
  final String tokenNumber;
  final String cardTypeName;
  final String patientName;
  final double feePaid;
  final String currentTokenCalled;
  final int patientsAhead;
  final int estWaitMinutes;
  final String receptionistPhone;

  const LiveQueueTrackerScreen({
    Key? key,
    required this.hospitalName,
    required this.opRegistrationNumber,
    required this.tokenNumber,
    required this.cardTypeName,
    required this.patientName,
    required this.feePaid,
    required this.currentTokenCalled,
    required this.patientsAhead,
    required this.estWaitMinutes,
    required this.receptionistPhone,
  }) : super(key: key);

  @override
  State<LiveQueueTrackerScreen> createState() => _LiveQueueTrackerScreenState();
}

class _LiveQueueTrackerScreenState extends State<LiveQueueTrackerScreen> {
  late int _ahead;
  late int _wait;
  late String _calling;

  @override
  void initState() {
    super.initState();
    _ahead = widget.patientsAhead;
    _wait = widget.estWaitMinutes;
    _calling = widget.currentTokenCalled;
  }

  void _simulateRefresh() {
    setState(() {
      if (_ahead > 0) {
        _ahead--;
        _wait = (_ahead * 6);
        _calling = 'S-203';
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final isSpecial = widget.cardTypeName.toLowerCase().contains('special');

    return Scaffold(
      appBar: AppBar(
        title: const Text('Live Queue Tracker'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _simulateRefresh,
            tooltip: 'Refresh Queue',
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Success alert banner
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.green.shade50,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.green.shade200),
              ),
              child: Row(
                children: [
                  const Icon(Icons.check_circle, color: Colors.green, size: 20),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Payment Verified (₹${widget.feePaid.toInt()}) • Token Allocated',
                      style: TextStyle(
                        color: Colors.green.shade900,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Token Hero Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: isSpecial
                      ? [const Color(0xFF2C1052), const Color(0xFF4A1E7A)]
                      : [OprivaTheme.navyDark, const Color(0xFF1E3A5F)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.12),
                    blurRadius: 16,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          isSpecial ? 'PRIORITY SPECIAL OP' : 'NORMAL OP',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ),
                      Text(
                        widget.opRegistrationNumber,
                        style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 11),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'YOUR OP TOKEN NUMBER',
                    style: TextStyle(
                      color: Color(0xFF00D4B2),
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    widget.tokenNumber,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 48,
                      fontWeight: FontWeight.w900,
                      fontFamily: 'monospace',
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    widget.hospitalName,
                    style: TextStyle(color: Colors.white.withOpacity(0.9), fontSize: 13),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'Patient: ${widget.patientName}',
                    style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 12),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Live Queue Metrics Grid
            Row(
              children: [
                Expanded(
                  child: _buildMetricTile(
                    title: 'Currently Calling',
                    value: _calling,
                    color: Colors.purple.shade700,
                    icon: Icons.campaign_outlined,
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _buildMetricTile(
                    title: 'Patients Ahead',
                    value: '$_ahead',
                    color: Colors.blue.shade700,
                    icon: Icons.people_outline,
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _buildMetricTile(
                    title: 'Est. Wait Time',
                    value: '~$_wait m',
                    color: OprivaTheme.healthcareTeal,
                    icon: Icons.timer_outlined,
                  ),
                ),
              ],
            ),

            const SizedBox(height: 20),

            // Help & Contact Receptionist Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.teal.shade50,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.phone_in_talk, color: OprivaTheme.healthcareTeal, size: 20),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Hospital OP Reception Desk',
                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                            ),
                            Text(
                              widget.receptionistPhone,
                              style: TextStyle(fontSize: 12, color: Colors.grey.shade700),
                            ),
                          ],
                        ),
                      ),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.teal.shade50,
                          foregroundColor: OprivaTheme.healthcareTeal,
                          elevation: 0,
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        ),
                        onPressed: () {},
                        child: const Text('Call Desk', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 14),

            // View Medical Reports Button
            // Navigation Map & Records Buttons
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                icon: const Icon(Icons.navigation_outlined, size: 18),
                label: const Text('Open Hospital GPS Route & Map'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: OprivaTheme.healthcareTeal,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (ctx) => HospitalMapScreen(
                        hospitalName: widget.hospitalName,
                        locality: 'Central Facility',
                        city: 'Hyderabad',
                        latitude: 17.4156,
                        longitude: 78.4121,
                        receptionistPhone: widget.receptionistPhone,
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 10),

            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                icon: const Icon(Icons.folder_shared_outlined),
                label: const Text('View My Medical Records & Prescriptions'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: OprivaTheme.navyDark,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (ctx) => const MedicalReportsScreen(),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricTile({
    required String title,
    required String value,
    required Color color,
    required IconData icon,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(height: 6),
          Text(
            value,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w900,
              color: color,
              fontFamily: 'monospace',
            ),
          ),
          const SizedBox(height: 4),
          Text(
            title,
            style: TextStyle(color: Colors.grey.shade600, fontSize: 10, fontWeight: FontWeight.w600),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
