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
      'hash': '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    },
    {
      'title': 'Chest X-Ray Digital Scan',
      'hospital': 'KIMS Hospitals',
      'date': '05 Aug 2026',
      'category': 'RADIOLOGY',
      'fileSize': '4.2 MB DICOM/PDF',
      'verified': true,
      'hash': '3a5b88c7d9e11f0a4b7c29e19d38f877c8e9b0d1e345f6a7b8c9d0e1f2a3b4c5',
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

  void _showUploadReportDialog() {
    final titleController = TextEditingController(text: 'Thyroid Function Profile (T3, T4, TSH)');
    final hospitalController = TextEditingController(text: 'Apollo Health City');
    String selectedCategory = 'LAB_REPORT';
    String selectedSize = '2.1 MB PDF';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (modalCtx, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                left: 20,
                right: 20,
                top: 20,
                bottom: MediaQuery.of(modalCtx).viewInsets.bottom + 24,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Upload Medical Report to Vault',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: OprivaTheme.navyDark,
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close),
                        onPressed: () => Navigator.pop(modalCtx),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  TextField(
                    controller: titleController,
                    decoration: const InputDecoration(
                      labelText: 'Report / Investigation Title *',
                      prefixIcon: Icon(Icons.description_outlined),
                    ),
                  ),
                  const SizedBox(height: 12),

                  TextField(
                    controller: hospitalController,
                    decoration: const InputDecoration(
                      labelText: 'Issuing Hospital / Diagnostic Lab *',
                      prefixIcon: Icon(Icons.local_hospital_outlined),
                    ),
                  ),
                  const SizedBox(height: 12),

                  DropdownButtonFormField<String>(
                    value: selectedCategory,
                    decoration: const InputDecoration(
                      labelText: 'Category',
                      prefixIcon: Icon(Icons.category_outlined),
                    ),
                    items: const [
                      DropdownMenuItem(value: 'LAB_REPORT', child: Text('Lab Investigation (Blood/Urine/Biopsy)')),
                      DropdownMenuItem(value: 'RADIOLOGY', child: Text('Radiology / Scan (X-Ray, CT, MRI)')),
                      DropdownMenuItem(value: 'PRESCRIPTION', child: Text('Doctor Prescription / Clinical Note')),
                      DropdownMenuItem(value: 'DISCHARGE_SUMMARY', child: Text('Hospital Discharge Summary')),
                    ],
                    onChanged: (val) {
                      if (val != null) setModalState(() => selectedCategory = val);
                    },
                  ),
                  const SizedBox(height: 16),

                  // Quick File Selection
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.grey.shade50,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.grey.shade300),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.picture_as_pdf, color: Colors.red, size: 28),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Selected File from Device:', style: TextStyle(fontSize: 11, color: Colors.grey)),
                              Text(
                                '${titleController.text.replaceAll(' ', '_')}.pdf',
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.blue.shade50,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(selectedSize, style: TextStyle(fontSize: 11, color: Colors.blue.shade800, fontWeight: FontWeight.bold)),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: OprivaTheme.healthcareTeal,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: () {
                        if (titleController.text.trim().isEmpty) return;

                        final newDoc = {
                          'title': titleController.text.trim(),
                          'hospital': hospitalController.text.trim().isEmpty ? 'Apollo Health City' : hospitalController.text.trim(),
                          'date': 'Today, 1:30 PM',
                          'category': selectedCategory,
                          'fileSize': selectedSize,
                          'verified': true,
                          'hash': 'c8e9b0d1e345f6a7b8c9d0e1f2a3b4c57f83b1657ff1fc53b92dc18148a1d65d',
                        };

                        setState(() {
                          _reports.insert(0, newDoc);
                        });

                        Navigator.pop(modalCtx);

                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            backgroundColor: Colors.green.shade800,
                            content: Text('✓ Uploaded "${newDoc['title']}" to Medical Records Vault.'),
                          ),
                        );
                      },
                      child: const Text('Save & Secure in Health Locker', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _showReportViewer(Map<String, dynamic> r) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.picture_as_pdf, color: Colors.red, size: 28),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    r['title'],
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text('Hospital: ${r['hospital']}', style: const TextStyle(fontSize: 13, color: Colors.black87)),
            const SizedBox(height: 4),
            Text('Date: ${r['date']} • Size: ${r['fileSize']}', style: TextStyle(fontSize: 12, color: Colors.grey.shade700)),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.grey.shade100,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                'Integrity Hash (SHA-256): ${r['hash'] ?? 'Verified'}',
                style: const TextStyle(fontFamily: 'monospace', fontSize: 10, color: Colors.grey),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    icon: const Icon(Icons.download),
                    label: const Text('Download'),
                    onPressed: () {
                      Navigator.pop(ctx);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Downloaded ${r['title']} to your device Downloads folder.')),
                      );
                    },
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: OprivaTheme.healthcareTeal,
                      foregroundColor: Colors.white,
                    ),
                    onPressed: () => Navigator.pop(ctx),
                    child: const Text('Close'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

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
              onPressed: _showUploadReportDialog,
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
        return InkWell(
          onTap: () => _showReportViewer(r),
          child: Container(
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
                  onPressed: () => _showReportViewer(r),
                ),
              ],
            ),
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
