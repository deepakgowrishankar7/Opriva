import 'dart:async';
import 'package:flutter/material.dart';
import '../core/theme/opriva_theme.dart';
import '../models/hospital_model.dart';
import '../core/services/local_ticket_storage_service.dart';
import 'live_queue_tracker_screen.dart';

class UpiQrPaymentScreen extends StatefulWidget {
  final HospitalModel hospital;
  final OpRegistrationTypeModel cardType;
  final String patientName;
  final String patientPhone;
  final String slotTime;
  final String bookingFor;

  const UpiQrPaymentScreen({
    Key? key,
    required this.hospital,
    required this.cardType,
    required this.patientName,
    required this.patientPhone,
    required this.slotTime,
    required this.bookingFor,
  }) : super(key: key);

  @override
  State<UpiQrPaymentScreen> createState() => _UpiQrPaymentScreenState();
}

class _UpiQrPaymentScreenState extends State<UpiQrPaymentScreen> {
  int _secondsLeft = 600; // 10 minutes anti-overbooking hold
  Timer? _timer;
  bool _verifying = false;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  void _startTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_secondsLeft > 0) {
        setState(() => _secondsLeft--);
      } else {
        _timer?.cancel();
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  String get _formattedTime {
    final m = (_secondsLeft ~/ 60).toString().padLeft(2, '0');
    final s = (_secondsLeft % 60).toString().padLeft(2, '0');
    return '$m:$s';
  }

  void _simulateConfirmPayment() async {
    setState(() => _verifying = true);
    await Future.delayed(const Duration(seconds: 2));

    if (!mounted) return;

    // Issue confirmed token based on card type
    final isSpecial = widget.cardType.typeCode == 'SPECIAL';
    final tokenNo = isSpecial ? 'S-205' : 'N-108';
    final opRegNo = 'OPR-${DateTime.now().year}${(DateTime.now().month).toString().padLeft(2, '0')}${(DateTime.now().day).toString().padLeft(2, '0')}-${(1000 + (DateTime.now().millisecond % 9000))}';

    // Save ticket directly to THIS device's local storage
    LocalTicketStorageService.saveTicket(
      LocalPatientTicket(
        hospitalId: widget.hospital.id,
        hospitalName: widget.hospital.name,
        branchName: widget.hospital.locality,
        opRegistrationNumber: opRegNo,
        tokenNumber: tokenNo,
        cardTypeName: widget.cardType.displayName,
        patientName: widget.patientName,
        feePaid: widget.cardType.feeAmount,
        currentTokenCalled: isSpecial ? 'S-202' : 'N-103',
        patientsAhead: isSpecial ? 2 : 4,
        estWaitMinutes: isSpecial ? 12 : 24,
        receptionistPhone: widget.hospital.receptionistPhone ?? '+91-40-2360-7777',
        latitude: widget.hospital.latitude ?? 17.4156,
        longitude: widget.hospital.longitude ?? 78.4121,
        address: widget.hospital.address,
        bookedAt: DateTime.now(),
      ),
    );

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (ctx) => LiveQueueTrackerScreen(
          hospitalName: widget.hospital.name,
          opRegistrationNumber: opRegNo,
          tokenNumber: tokenNo,
          cardTypeName: widget.cardType.displayName,
          patientName: widget.patientName,
          feePaid: widget.cardType.feeAmount,
          currentTokenCalled: isSpecial ? 'S-202' : 'N-103',
          patientsAhead: isSpecial ? 2 : 4,
          estWaitMinutes: isSpecial ? 12 : 24,
          receptionistPhone: widget.hospital.receptionistPhone ?? '+91-40-2360-7777',
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('UPI QR Payment'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // 10-minute hold banner
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: Colors.amber.shade50,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.amber.shade300),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.timer_outlined, color: Colors.amber, size: 20),
                  const SizedBox(width: 8),
                  Text(
                    'OP Slot Reserved. Pay within: $_formattedTime',
                    style: TextStyle(
                      color: Colors.amber.shade900,
                      fontWeight: FontWeight.bold,
                      fontSize: 13,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // UPI QR Container
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.grey.shade200),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.04),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Image.asset('assets/images/opriva_symbol.png', width: 22, height: 22),
                      const SizedBox(width: 6),
                      const Text(
                        'Opriva Verified Healthcare UPI',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: OprivaTheme.navyDark,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Interactive QR Representation
                  Container(
                    width: 200,
                    height: 200,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.grey.shade300, width: 2),
                    ),
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        // Stylized QR pattern box
                        Container(
                          margin: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            border: Border.all(color: Colors.black, width: 3),
                          ),
                          child: Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Icon(Icons.qr_code_2, size: 130, color: Colors.black87),
                                Text(
                                  'SCAN WITH ANY UPI APP',
                                  style: TextStyle(
                                    fontSize: 9,
                                    fontWeight: FontWeight.w900,
                                    color: Colors.grey.shade700,
                                    letterSpacing: 0.5,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),
                  Text(
                    '₹${widget.cardType.feeAmount.toInt()}',
                    style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.w900,
                      color: OprivaTheme.navyDark,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'To: ${widget.hospital.name}',
                    style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'UPI ID: opriva.${widget.hospital.id}@hdfcbank',
                    style: TextStyle(color: Colors.grey.shade500, fontSize: 11),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Supported UPI logos row
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildPaymentBadge('GPay'),
                const SizedBox(width: 8),
                _buildPaymentBadge('PhonePe'),
                const SizedBox(width: 8),
                _buildPaymentBadge('Paytm'),
                const SizedBox(width: 8),
                _buildPaymentBadge('BHIM UPI'),
              ],
            ),

            const SizedBox(height: 24),

            // Confirm payment button
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: OprivaTheme.healthcareTeal,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                onPressed: _verifying ? null : _simulateConfirmPayment,
                child: _verifying
                    ? const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                          ),
                          SizedBox(width: 12),
                          Text('Verifying Bank Payment & Issuing Token...'),
                        ],
                      )
                    : const Text(
                        'I Have Paid via UPI — Verify & Get Token',
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPaymentBadge(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.grey.shade100,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey.shade300),
      ),
      child: Text(
        label,
        style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.black87),
      ),
    );
  }
}
