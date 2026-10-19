import 'package:flutter/material.dart';
import '../core/theme/opriva_theme.dart';
import '../models/hospital_model.dart';
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Enter Patient Details'),
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
              const Text(
                'Who is this consultation for?',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: OprivaTheme.navyDark),
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
                        fontSize: 12,
                      ),
                    ),
                  );
                }).toList(),
              ),

              const SizedBox(height: 18),
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'Patient Full Name *',
                  prefixIcon: Icon(Icons.person_outline),
                ),
                validator: (val) => val == null || val.isEmpty ? 'Please enter patient name' : null,
              ),

              const SizedBox(height: 14),
              Row(
                children: [
                  Expanded(
                    flex: 1,
                    child: TextFormField(
                      controller: _ageController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(
                        labelText: 'Age *',
                        prefixIcon: Icon(Icons.cake_outlined),
                      ),
                      validator: (val) => val == null || val.isEmpty ? 'Required' : null,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    flex: 2,
                    child: DropdownButtonFormField<String>(
                      value: _selectedGender,
                      decoration: const InputDecoration(
                        labelText: 'Gender *',
                        prefixIcon: Icon(Icons.wc_outlined),
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
                decoration: const InputDecoration(
                  labelText: 'Mobile Number for SMS/Queue Token *',
                  prefixIcon: Icon(Icons.phone_outlined),
                ),
                validator: (val) =>
                    val == null || val.length < 10 ? 'Enter valid 10-digit number' : null,
              ),

              const SizedBox(height: 14),
              TextFormField(
                controller: _symptomsController,
                maxLines: 2,
                decoration: const InputDecoration(
                  labelText: 'Reason for Visit / Symptoms (Optional)',
                  prefixIcon: Icon(Icons.healing_outlined),
                ),
              ),

              const SizedBox(height: 18),

              // Old medical reports upload attachment option
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: Colors.grey.shade300),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: Colors.blue.shade50,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.upload_file, color: Colors.blue, size: 22),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Attach Previous Medical Report',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            _attachedOldReport
                              ? 'Document attached: Blood_Report_Oct2026.pdf'
                              : 'Upload old prescriptions or lab tests for doctor preview.',
                            style: TextStyle(
                              fontSize: 11,
                              color: _attachedOldReport ? Colors.green.shade700 : Colors.grey.shade600,
                              fontWeight: _attachedOldReport ? FontWeight.bold : FontWeight.normal,
                            ),
                          ),
                        ],
                      ),
                    ),
                    TextButton(
                      onPressed: () {
                        setState(() => _attachedOldReport = !_attachedOldReport);
                      },
                      child: Text(_attachedOldReport ? 'Remove' : 'Upload'),
                    ),
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
                    'Proceed to Pay ₹${widget.cardType.feeAmount.toInt()} via UPI QR',
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
