import 'package:flutter/material.dart';
import '../core/theme/opriva_theme.dart';

class MedicalReportsScreen extends StatefulWidget {
  const MedicalReportsScreen({Key? key}) : super(key: key);

  @override
  State<MedicalReportsScreen> createState() => _MedicalReportsScreenState();
}

class _MedicalReportsScreenState extends State<MedicalReportsScreen> {
  int _activeTab = 0; // 0: Reports, 1: Prescriptions

  final List<Map<String, dynamic>> _reports = [
    {
      'title': 'Complete Blood Count (CBC) & Lipid Profile',
      'hospital': 'Apollo Health City',
      'date': '12 Oct 2026',
      'category': 'LAB_REPORT',
      'fileSize': '1.8 MB PDF',
      'verified': true,
    },
    {
      'title': 'Chest X-Ray Digital Scan',
      'hospital': 'KIMS Hospitals',
      'date': '05 Aug 2026',
      'category': 'RADIOLOGY',
      'fileSize': '4.2 MB DICOM/PDF',
      'verified': true,
    },
  ];

  final List<Map<String, dynamic>> _prescriptions = [
    {
      'doctor': 'Dr. Rajesh Sharma, MD',
      'hospital': 'Apollo Health City',
      'date': 'Today, 10:15 AM',
      'diagnosis': 'Acute Upper Respiratory Tract Infection',
      'signature': 'SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      'medicines': [
        'Amoxicillin 500mg (1 TDS x 5 days)',
        'Paracetamol 650mg (1 SOS x 3 days)',
      ],
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Medical Records & Prescriptions'),
      ),
      body: Column(
        children: [
          // Sub-tabs
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _activeTab == 0 ? OprivaTheme.healthcareTeal : Colors.grey.shade100,
                      foregroundColor: _activeTab == 0 ? Colors.white : Colors.black87,
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    onPressed: () => setState(() => _activeTab = 0),
                    child: const Text('Lab & Diagnostic Reports', style: TextStyle(fontSize: 12)),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _activeTab == 1 ? OprivaTheme.healthcareTeal : Colors.grey.shade100,
                      foregroundColor: _activeTab == 1 ? Colors.white : Colors.black87,
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    onPressed: () => setState(() => _activeTab = 1),
                    child: const Text('Digital Prescriptions', style: TextStyle(fontSize: 12)),
                  ),
                ),
              ],
            ),
          ),

          Expanded(
            child: _activeTab == 0 ? _buildReportsList() : _buildPrescriptionsList(),
          ),
        ],
      ),
      floatingActionButton: _activeTab == 0
          ? FloatingActionButton.extended(
              backgroundColor: OprivaTheme.healthcareTeal,
              foregroundColor: Colors.white,
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Select PDF or Image from device to upload...')),
                );
              },
              icon: const Icon(Icons.upload_file),
              label: const Text('Upload Report'),
            )
          : null,
    );
  }

  Widget _buildReportsList() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _reports.length,
      itemBuilder: (ctx, idx) {
        final r = _reports[idx];
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.grey.shade200),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.red.shade50,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.picture_as_pdf, color: Colors.red, size: 28),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      r['title'],
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                    const SizedBox(height: 3),
                    Text(
                      '${r['hospital']} • ${r['date']}',
                      style: TextStyle(color: Colors.grey.shade600, fontSize: 11),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      r['fileSize'],
                      style: TextStyle(color: Colors.grey.shade400, fontSize: 10),
                    ),
                  ],
                ),
              ),
              IconButton(
                icon: const Icon(Icons.download, color: OprivaTheme.healthcareTeal),
                onPressed: () {},
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildPrescriptionsList() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _prescriptions.length,
      itemBuilder: (ctx, idx) {
        final p = _prescriptions[idx];
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.teal.shade200),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    p['doctor'],
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: OprivaTheme.navyDark),
                  ),
                  Text(
                    p['date'],
                    style: TextStyle(color: Colors.grey.shade500, fontSize: 11),
                  ),
                ],
              ),
              Text(
                p['hospital'],
                style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
              ),
              const Divider(height: 20),
              Text(
                'Diagnosis: ${p['diagnosis']}',
                style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12),
              ),
              const SizedBox(height: 6),
              ...((p['medicines'] as List).map((m) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 2),
                  child: Row(
                    children: [
                      const Icon(Icons.medication, size: 14, color: OprivaTheme.healthcareTeal),
                      const SizedBox(width: 6),
                      Text(m, style: const TextStyle(fontSize: 12)),
                    ],
                  ),
                );
              })),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.grey.shade50,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  p['signature'],
                  style: const TextStyle(fontFamily: 'monospace', fontSize: 9, color: Colors.grey),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
