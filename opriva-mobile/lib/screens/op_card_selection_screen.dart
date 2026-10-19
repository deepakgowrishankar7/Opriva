import 'package:flutter/material.dart';
import '../core/theme/opriva_theme.dart';
import '../models/hospital_model.dart';
import '../core/localization/app_localizations.dart';
import 'patient_details_screen.dart';

class OpCardSelectionScreen extends StatefulWidget {
  final HospitalModel hospital;

  const OpCardSelectionScreen({Key? key, required this.hospital}) : super(key: key);

  @override
  State<OpCardSelectionScreen> createState() => _OpCardSelectionScreenState();
}

class _OpCardSelectionScreenState extends State<OpCardSelectionScreen> {
  String? _selectedTypeId;
  String _selectedSlot = '09:30 - 10:30 AM';

  final List<String> _slots = [
    '09:00 - 10:00 AM',
    '10:00 - 11:00 AM',
    '11:00 - 12:00 PM',
    '02:00 - 03:00 PM',
    '03:00 - 04:00 PM',
  ];

  @override
  void initState() {
    super.initState();
    if (widget.hospital.availableRegistrationTypes.isNotEmpty) {
      _selectedTypeId = widget.hospital.availableRegistrationTypes.first.id;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(AppLocalizations.tr(context, 'selectCardType', fallback: 'Select OP Registration Card')),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hospital summary header
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          widget.hospital.name,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: OprivaTheme.navyDark,
                          ),
                        ),
                      ),
                      if (widget.hospital.verified)
                        const Chip(
                          label: Text(
                            'Verified',
                            style: TextStyle(
                              fontSize: 10,
                              color: OprivaTheme.healthcareTeal,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          backgroundColor: Color(0xFFE6FAF7),
                          visualDensity: VisualDensity.compact,
                        ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${widget.hospital.locality}, ${widget.hospital.city}',
                    style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.star, color: Colors.amber, size: 16),
                      const SizedBox(width: 4),
                      Text(
                        '${widget.hospital.googleRating ?? 4.0} (${widget.hospital.googleReviewCount ?? 0} reviews)',
                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),
            Text(
              AppLocalizations.tr(context, 'consultationWindow', fallback: '1. Choose OP Consultation Window'),
              style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: OprivaTheme.navyDark),
            ),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _slots.map((slot) {
                final isSelected = _selectedSlot == slot;
                return ChoiceChip(
                  label: Text(slot),
                  selected: isSelected,
                  onSelected: (selected) {
                    if (selected) setState(() => _selectedSlot = slot);
                  },
                  selectedColor: OprivaTheme.healthcareTeal.withOpacity(0.15),
                  labelStyle: TextStyle(
                    color: isSelected ? OprivaTheme.healthcareTeal : Colors.black87,
                    fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                    fontSize: 12,
                  ),
                );
              }).toList(),
            ),

            const SizedBox(height: 24),
            Text(
              AppLocalizations.tr(context, 'selectCardType', fallback: '2. Select OP Registration Card Type'),
              style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: OprivaTheme.navyDark),
            ),
            const SizedBox(height: 12),

            // OP Cards list
            ...widget.hospital.availableRegistrationTypes.map((type) {
              final isSelected = _selectedTypeId == type.id;
              final isSpecial = type.typeCode == 'SPECIAL';

              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: isSelected ? OprivaTheme.healthcareTeal : Colors.grey.shade200,
                    width: isSelected ? 2 : 1,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.03),
                      blurRadius: 6,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: RadioListTile<String>(
                  value: type.id,
                  groupValue: _selectedTypeId,
                  activeColor: OprivaTheme.healthcareTeal,
                  onChanged: (val) {
                    setState(() => _selectedTypeId = val);
                  },
                  title: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Expanded(
                        child: Wrap(
                          crossAxisAlignment: WrapCrossAlignment.center,
                          spacing: 6,
                          runSpacing: 4,
                          children: [
                            Text(
                              isSpecial
                                  ? AppLocalizations.tr(context, 'specialCard', fallback: type.displayName)
                                  : AppLocalizations.tr(context, 'normalCard', fallback: type.displayName),
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                            ),
                            if (isSpecial)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: Colors.purple.shade50,
                                  borderRadius: BorderRadius.circular(4),
                                  border: Border.all(color: Colors.purple.shade200),
                                ),
                                child: Text(
                                  AppLocalizations.tr(context, 'priorityQueue', fallback: 'PRIORITY QUEUE'),
                                  style: const TextStyle(
                                    fontSize: 9,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.purple,
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        '₹${type.feeAmount.toInt()}',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                          color: OprivaTheme.navyDark,
                        ),
                      ),
                    ],
                  ),
                  subtitle: Padding(
                    padding: const EdgeInsets.only(top: 6),
                    child: Text(
                      type.description ??
                          (isSpecial
                              ? 'Priority expedited consultation card with dedicated queue access.'
                              : 'Standard outpatient consultation card with general queue sequence.'),
                      style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                    ),
                  ),
                ),
              );
            }).toList(),

            const SizedBox(height: 24),

            // Proceed Button
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
                onPressed: _selectedTypeId == null
                    ? null
                    : () {
                        final chosenType = widget.hospital.availableRegistrationTypes
                            .firstWhere((t) => t.id == _selectedTypeId);
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (ctx) => PatientDetailsScreen(
                              hospital: widget.hospital,
                              cardType: chosenType,
                              slotTime: _selectedSlot,
                            ),
                          ),
                        );
                      },
                child: Text(
                  AppLocalizations.tr(context, 'continueToPatientDetails', fallback: 'Continue to Patient Details'),
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
