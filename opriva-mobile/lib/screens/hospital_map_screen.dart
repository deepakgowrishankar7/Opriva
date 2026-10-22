import 'package:flutter/material.dart';
import '../core/theme/opriva_theme.dart';

class HospitalMapScreen extends StatelessWidget {
  final String hospitalName;
  final String locality;
  final String city;
  final double latitude;
  final double longitude;
  final String receptionistPhone;

  const HospitalMapScreen({
    Key? key,
    required this.hospitalName,
    required this.locality,
    required this.city,
    required this.latitude,
    required this.longitude,
    required this.receptionistPhone,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        title: Text('Navigation to $hospitalName'),
        elevation: 0,
      ),
      body: Column(
        children: [
          // Interactive Map Simulation Area
          Expanded(
            flex: 3,
            child: Stack(
              children: [
                // Stylized Vector Map Canvas
                Container(
                  width: double.infinity,
                  decoration: const BoxDecoration(
                    color: Color(0xFFE2E8F0),
                    image: DecorationImage(
                      image: AssetImage('assets/images/opriva_symbol.png'),
                      opacity: 0.05,
                      fit: BoxFit.contain,
                    ),
                  ),
                  child: CustomPaint(
                    painter: _MapGridPainter(),
                  ),
                ),

                // Map Pins & Route Line
                Positioned(
                  left: 60,
                  bottom: 80,
                  child: Column(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: OprivaTheme.navyDark,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: const Text(
                          'Your Location',
                          style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Icon(Icons.my_location, size: 28, color: Color(0xFF2563EB)),
                    ],
                  ),
                ),

                // Destination Hospital Pin
                Positioned(
                  right: 80,
                  top: 90,
                  child: Column(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(
                          color: Colors.red.shade700,
                          borderRadius: BorderRadius.circular(8),
                          boxShadow: const [
                            BoxShadow(color: Colors.black26, blurRadius: 6, offset: Offset(0, 3)),
                          ],
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.local_hospital, color: Colors.white, size: 14),
                            const SizedBox(width: 4),
                            Text(
                              hospitalName,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 4),
                      Icon(Icons.location_on, size: 42, color: Colors.red.shade600),
                    ],
                  ),
                ),

                // Turn Direction Floating Badge
                Positioned(
                  top: 16,
                  left: 16,
                  right: 16,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: const [
                        BoxShadow(color: Colors.black12, blurRadius: 10, offset: Offset(0, 4)),
                      ],
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEFF6FF),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(Icons.directions_outlined, color: Color(0xFF2563EB), size: 24),
                        ),
                        const SizedBox(width: 12),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Turn right on Hospital Boulevard',
                                style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13),
                              ),
                              Text(
                                'In 350 meters • Fastest route based on traffic',
                                style: TextStyle(fontSize: 11, color: Colors.black54),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Bottom Navigation Card & Details
          Container(
            padding: const EdgeInsets.all(20),
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              boxShadow: [
                BoxShadow(color: Colors.black12, blurRadius: 12, offset: Offset(0, -3)),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          hospitalName,
                          style: const TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.w900,
                            color: OprivaTheme.navyDark,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '$locality, $city',
                          style: const TextStyle(fontSize: 12, color: Colors.black54),
                        ),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF0FDF4),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: const Color(0xFFBBF7D0)),
                      ),
                      child: const Column(
                        children: [
                          Text('14 MIN', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 14, color: Color(0xFF15803D))),
                          Text('3.2 km', style: TextStyle(fontSize: 10, color: Color(0xFF166534))),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // GPS Coordinates & OP Reception Call
                Row(
                  children: [
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.gps_fixed, size: 16, color: OprivaTheme.healthcareTeal),
                            const SizedBox(width: 8),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('GPS Location', style: TextStyle(fontSize: 10, color: Colors.grey)),
                                Text(
                                  '${latitude.toStringAsFixed(4)}, ${longitude.toStringAsFixed(4)}',
                                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, fontFamily: 'monospace'),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),

                    // Reception phone call
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.phone_in_talk, size: 16, color: OprivaTheme.healthcareTeal),
                          const SizedBox(width: 6),
                          Text(
                            receptionistPhone,
                            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Action: Start In-App Guidance
                ElevatedButton.icon(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Starting live GPS navigation to $hospitalName OP building...'),
                        backgroundColor: OprivaTheme.healthcareTeal,
                      ),
                    );
                  },
                  icon: const Icon(Icons.navigation),
                  label: const Text('Start Turn-by-Turn Directions'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: OprivaTheme.healthcareTeal,
                    minimumSize: const Size(double.infinity, 48),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
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

// Custom Painter to render simulated map roads and blocks
class _MapGridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final roadPaint = Paint()
      ..color = Colors.white
      ..strokeWidth = 14
      ..style = PaintingStyle.stroke;

    final routePaint = Paint()
      ..color = const Color(0xFF3B82F6)
      ..strokeWidth = 6
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final buildingPaint = Paint()
      ..color = const Color(0xFFCBD5E1)
      ..style = PaintingStyle.fill;

    // Draw grid blocks
    for (double i = 20; i < size.width; i += 80) {
      for (double j = 40; j < size.height; j += 70) {
        canvas.drawRRect(
          RRect.fromRectAndRadius(
            Rect.fromLTWH(i, j, 60, 50),
            const Radius.circular(8),
          ),
          buildingPaint,
        );
      }
    }

    // Draw main roads
    final roadPath = Path()
      ..moveTo(60, size.height - 80)
      ..lineTo(60, size.height * 0.45)
      ..lineTo(size.width * 0.6, size.height * 0.45)
      ..lineTo(size.width * 0.6, 90)
      ..lineTo(size.width - 80, 90);

    canvas.drawPath(roadPath, roadPaint);
    canvas.drawPath(roadPath, routePaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
