import 'package:flutter/material.dart';
import '../core/theme/opriva_theme.dart';
import '../models/hospital_model.dart';
import '../core/localization/app_localizations.dart';
import 'upi_qr_payment_screen.dart';

class PatientDetailsScreen extends StatefulWidget {
  final HospitalModel hospital;
  final OpRegistrationTypeModel cardType;
  final String slotTime;

  const PatientDetailsScreen({
    Key? key,
    required this.hospital,
    required this.cardType,
    required this.slotTime,
  }) : super(key: key);

  @override
  State<PatientDetailsScreen> createState() => _PatientDetailsScreenState();
}

class _PatientDetailsScreenState extends State<PatientDetailsScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _nameController = TextEditingController(text: 'Ananya Reddy');
  final TextEditingController _ageController = TextEditingController(text: '28');
  final TextEditingController _phoneController = TextEditingController(text: '9876543212');
  final TextEditingController _symptomsController = TextEditingController();
  String _selectedGender = 'Female';
  String _bookingFor = 'Self';
  
  bool _attachedOldReport = false;
  String _attachedFileName = 'Blood_Investigation_Report_Oct2026.pdf';
  String _attachedFileSize = '1.8 MB PDF';
  bool _isUploading = false;

  final List<Map<String, String>> _availableDocs = [
    {
      'name': 'Blood_Investigation_Report_Oct2026.pdf',
      'size': '1.8 MB PDF',
      'type': 'Lab Test Report',
      'icon': 'pdf'
    },
    {
      'name': 'Chest_XRay_Radiology_Report.pdf',
      'size': '3.4 MB PDF',
      'type': 'Radiology Scan',
      'icon': 'pdf'
    },
    {
      'name': 'Dr_Sharma_Previous_Prescription.jpg',
      'size': '850 KB JPEG',
      'type': 'Prescription Image',
      'icon': 'image'
    },
  ];

  void _showDocumentUploadPicker() {
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
                        'Upload Medical Document',
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
                  const SizedBox(height: 4),
                  Text(
                    'Attach previous lab reports or prescriptions for doctor consultation review.',
                    style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                  ),
                  const SizedBox(height: 16),

                  if (_isUploading) ...[
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: OprivaTheme.healthcareTeal.withOpacity(0.08),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Column(
                        children: [
                          LinearProgressIndicator(color: OprivaTheme.healthcareTeal),
                          SizedBox(height: 12),
                          Text(
                            'Encrypting and attaching document...',
                            style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                  ] else ...[
                    // Source selection tiles
                    Row(
                      children: [
                        Expanded(
                          child: InkWell(
                            onTap: () => _selectDocument(modalCtx, _availableDocs[0]),
                            child: _buildPickerOption(
                              icon: Icons.file_present_rounded,
                              color: Colors.blue,
                              title: 'Files & PDFs',
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: InkWell(
                            onTap: () => _selectDocument(modalCtx, _availableDocs[2]),
                            child: _buildPickerOption(
                              icon: Icons.camera_alt_rounded,
                              color: Colors.purple,
                              title: 'Camera Scan',
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: InkWell(
                            onTap: () => _selectDocument(modalCtx, _availableDocs[1]),
                            child: _buildPickerOption(
                              icon: Icons.folder_shared_rounded,
                              color: OprivaTheme.healthcareTeal,
                              title: 'Health Locker',
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 18),
                    const Text(
                      'Or Select from Device Documents:',
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: OprivaTheme.navyDark),
                    ),
                    const SizedBox(height: 8),

                    ..._availableDocs.map((doc) {
                      final isPdf = doc['icon'] == 'pdf';
                      return Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.grey.shade200),
                          color: Colors.grey.shade50,
                        ),
                        child: ListTile(
                          leading: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: isPdf ? Colors.red.shade50 : Colors.purple.shade50,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Icon(
                              isPdf ? Icons.picture_as_pdf : Icons.image,
                              color: isPdf ? Colors.red : Colors.purple,
                              size: 20,
                            ),
                          ),
                          title: Text(
                            doc['name']!,
                            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                          ),
                          subtitle: Text(
                            '${doc['type']} • ${doc['size']}',
                            style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
                          ),
                          trailing: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: OprivaTheme.healthcareTeal,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              elevation: 0,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                            ),
                            onPressed: () => _selectDocument(modalCtx, doc),
                            child: const Text('Attach', style: TextStyle(fontSize: 12)),
                          ),
                        ),
                      );
                    }).toList(),
                  ],
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildPickerOption({
    required IconData icon,
    required Color color,
    required String title,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
      decoration: BoxDecoration(
        color: color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 28),
          const SizedBox(height: 6),
          Text(
            title,
            style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: color),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  void _selectDocument(BuildContext modalCtx, Map<String, String> doc) async {
    setState(() => _isUploading = true);
    Navigator.pop(modalCtx);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Attaching ${doc['name']}...'),
        duration: const Duration(seconds: 1),
      ),
    );

    await Future.delayed(const Duration(milliseconds: 600));

    if (mounted) {
      setState(() {
        _isUploading = false;
        _attachedOldReport = true;
        _attachedFileName = doc['name']!;
        _attachedFileSize = doc['size']!;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: Colors.green.shade800,
          content: Text('✓ Successfully attached ${_attachedFileName}'),
          action: SnackBarAction(
            label: 'View',
            textColor: Colors.amber,
            onPressed: _showDocumentPreview,
          ),
        ),
      );
    }
  }

  void _showDocumentPreview() {
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
                const Icon(Icons.verified_user, color: OprivaTheme.healthcareTeal),
                const SizedBox(width: 8),
                const Text(
                  'Attached Medical Record',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.grey.shade50,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Row(
                children: [
                  const Icon(Icons.picture_as_pdf, color: Colors.red, size: 36),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(_attachedFileName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                        const SizedBox(height: 2),
                        Text('Size: $_attachedFileSize • Ready for Doctor Review', style: TextStyle(color: Colors.grey.shade600, fontSize: 11)),
                        const SizedBox(height: 4),
                        const Text('SHA-256: 7f83b1657ff1fc53b92dc18148a1d65d...', style: TextStyle(fontFamily: 'monospace', color: Colors.grey, fontSize: 9)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(ctx),
                child: const Text('Done'),
              ),
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
        title: Text(AppLocalizations.tr(context, 'enterPatientDetails', fallback: 'Enter Patient Details')),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Summary card
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: OprivaTheme.healthcareTeal.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: OprivaTheme.healthcareTeal.withOpacity(0.2)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.cardType.displayName,
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          widget.slotTime,
                          style: TextStyle(fontSize: 12, color: Colors.grey.shade700),
                        ),
                      ],
                    ),
                    Text(
                      '₹${widget.cardType.feeAmount.toInt()}',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                        color: OprivaTheme.navyDark,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),
              Text(
                AppLocalizations.tr(context, 'whoIsConsultationFor', fallback: 'Who is this consultation for?'),
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: OprivaTheme.navyDark),
              ),
              const SizedBox(height: 8),
              Row(
                children: ['Self', 'Parent', 'Child', 'Spouse'].map((rel) {
                  final isSelected = _bookingFor == rel;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text(rel),
                      selected: isSelected,
                      onSelected: (val) {
                        if (val) setState(() => _bookingFor = rel);
                      },
                      selectedColor: OprivaTheme.healthcareTeal.withOpacity(0.2),
                      labelStyle: TextStyle(
                        color: isSelected ? OprivaTheme.healthcareTeal : Colors.black87,
                        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                        fontSize: 13,
                      ),
                    ),
                  );
                }).toList(),
              ),

              const SizedBox(height: 18),
              TextFormField(
                controller: _nameController,
                decoration: InputDecoration(
                  labelText: AppLocalizations.tr(context, 'patientFullName', fallback: 'Patient Full Name *'),
                  prefixIcon: const Icon(Icons.person_outline),
                ),
                validator: (val) => val == null || val.trim().isEmpty ? 'Please enter patient name' : null,
              ),

              const SizedBox(height: 14),
              Row(
                children: [
                  Expanded(
                    flex: 1,
                    child: TextFormField(
                      controller: _ageController,
                      keyboardType: TextInputType.number,
                      decoration: InputDecoration(
                        labelText: AppLocalizations.tr(context, 'age', fallback: 'Age *'),
                        prefixIcon: const Icon(Icons.calendar_today_outlined),
                      ),
                      validator: (val) => val == null || val.isEmpty ? 'Required' : null,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    flex: 2,
                    child: DropdownButtonFormField<String>(
                      value: _selectedGender,
                      decoration: InputDecoration(
                        labelText: AppLocalizations.tr(context, 'gender', fallback: 'Gender *'),
                        prefixIcon: const Icon(Icons.wc_outlined),
                      ),
                      items: ['Female', 'Male', 'Other'].map((g) {
                        return DropdownMenuItem(value: g, child: Text(g));
                      }).toList(),
                      onChanged: (val) {
                        if (val != null) setState(() => _selectedGender = val);
                      },
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 14),
              TextFormField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                decoration: InputDecoration(
                  labelText: AppLocalizations.tr(context, 'mobileNumber', fallback: 'Mobile Number for SMS/Queue Token *'),
                  prefixIcon: const Icon(Icons.phone_outlined),
                ),
                validator: (val) =>
                    val == null || val.length < 10 ? 'Enter valid 10-digit number' : null,
              ),

              const SizedBox(height: 14),
              TextFormField(
                controller: _symptomsController,
                maxLines: 2,
                decoration: InputDecoration(
                  labelText: AppLocalizations.tr(context, 'reasonForVisit', fallback: 'Reason for Visit / Symptoms (Optional)'),
                  prefixIcon: const Icon(Icons.healing_outlined),
                ),
              ),

              const SizedBox(height: 18),

              // Interactive Medical Report Attachment Card
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: _attachedOldReport ? const Color(0xFFF0FDF4) : Colors.white,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: _attachedOldReport ? Colors.green.shade400 : Colors.grey.shade300,
                    width: _attachedOldReport ? 1.5 : 1,
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: _attachedOldReport ? Colors.green.shade100 : Colors.blue.shade50,
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        _attachedOldReport ? Icons.check_circle : Icons.upload_file,
                        color: _attachedOldReport ? Colors.green.shade700 : Colors.blue,
                        size: 22,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                _attachedOldReport ? 'Report Attached' : 'Attach Medical Report',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 13,
                                  color: _attachedOldReport ? Colors.green.shade900 : OprivaTheme.navyDark,
                                ),
                              ),
                              if (_attachedOldReport) ...[
                                const SizedBox(width: 6),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                                  decoration: BoxDecoration(
                                    color: Colors.green.shade200,
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: const Text('READY', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.green)),
                                ),
                              ],
                            ],
                          ),
                          const SizedBox(height: 2),
                          Text(
                            _attachedOldReport
                                ? '$_attachedFileName ($_attachedFileSize)'
                                : 'Upload old prescriptions, blood tests or scans for doctor preview.',
                            style: TextStyle(
                              fontSize: 11,
                              color: _attachedOldReport ? Colors.green.shade800 : Colors.grey.shade600,
                              fontWeight: _attachedOldReport ? FontWeight.w600 : FontWeight.normal,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                    if (_attachedOldReport) ...[
                      IconButton(
                        icon: const Icon(Icons.remove_red_eye, color: OprivaTheme.healthcareTeal, size: 20),
                        tooltip: 'Preview Document',
                        onPressed: _showDocumentPreview,
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, color: Colors.red, size: 20),
                        tooltip: 'Remove',
                        onPressed: () {
                          setState(() => _attachedOldReport = false);
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Attached document removed.')),
                          );
                        },
                      ),
                    ] else ...[
                      ElevatedButton.icon(
                        icon: const Icon(Icons.add, size: 16),
                        label: const Text('Upload', style: TextStyle(fontSize: 12)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: OprivaTheme.healthcareTeal,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          elevation: 0,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        onPressed: _showDocumentUploadPicker,
                      ),
                    ],
                  ],
                ),
              ),

              const SizedBox(height: 28),

              // Pay button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: OprivaTheme.healthcareTeal,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    elevation: 2,
                  ),
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (ctx) => UpiQrPaymentScreen(
                            hospital: widget.hospital,
                            cardType: widget.cardType,
                            patientName: _nameController.text,
                            patientPhone: _phoneController.text,
                            slotTime: widget.slotTime,
                            bookingFor: _bookingFor,
                          ),
                        ),
                      );
                    }
                  },
                  child: Text(
                    '${AppLocalizations.tr(context, 'proceedToPayUpi', fallback: 'Proceed to Pay via UPI QR')} (₹${widget.cardType.feeAmount.toInt()})',
                    style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
