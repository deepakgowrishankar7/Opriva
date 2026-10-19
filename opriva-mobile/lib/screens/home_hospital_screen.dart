import 'package:flutter/material.dart';
import '../core/theme/opriva_theme.dart';
import '../models/hospital_model.dart';
import '../core/services/api_service.dart';
import 'op_card_selection_screen.dart';

class HomeHospitalScreen extends StatefulWidget {
  const HomeHospitalScreen({Key? key}) : super(key: key);

  @override
  State<HomeHospitalScreen> createState() => _HomeHospitalScreenState();
}

class _HomeHospitalScreenState extends State<HomeHospitalScreen> {
  List<HospitalModel> _hospitals = [];
  bool _loading = true;
  String _selectedLanguage = 'English';
  final TextEditingController _searchController = TextEditingController();

  final List<String> _indianLanguages = [
    'English',
    'తెలుగు (Telugu)',
    'हिन्दी (Hindi)',
    'বাংলা (Bengali)',
    'मराठी (Marathi)',
    'தமிழ் (Tamil)',
    'اردو (Urdu)',
    'ગુજરાતી (Gujarati)',
    'ಕನ್ನಡ (Kannada)',
    'മലയാളം (Malayalam)',
    'ଓଡ଼ିଆ (Odia)',
    'ਪੰਜਾਬੀ (Punjabi)',
  ];

  @override
  void initState() {
    super.initState();
    _loadHospitals();
  }

  Future<void> _loadHospitals([String? query]) async {
    setState(() => _loading = true);
    final data = await ApiService.fetchHospitals(keyword: query);
    setState(() {
      _hospitals = data;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Image.asset(
              'assets/images/opriva_symbol.png',
              width: 28,
              height: 28,
              fit: BoxFit.contain,
            ),
            const SizedBox(width: 8),
            const Text(
              'Opriva',
              style: TextStyle(
                fontWeight: FontWeight.w900,
                color: OprivaTheme.navyDark,
              ),
            ),
          ],
        ),
        actions: [
          // Language Selector Dropdown
          PopupMenuButton<String>(
            icon: const Icon(Icons.language, color: OprivaTheme.healthcareTeal),
            onSelected: (val) {
              setState(() => _selectedLanguage = val);
            },
            itemBuilder: (ctx) => _indianLanguages.map((lang) {
              return PopupMenuItem(
                value: lang,
                child: Text(lang, style: const TextStyle(fontSize: 13)),
              );
            }).toList(),
          ),
          IconButton(
            icon: const Icon(Icons.notifications_none, color: OprivaTheme.navyDark),
            onPressed: () {},
          ),
        ],
      ),
      body: Column(
        children: [
          // Search & Location Bar
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: TextField(
              controller: _searchController,
              onChanged: (val) => _loadHospitals(val),
              decoration: InputDecoration(
                hintText: 'Search hospital, locality, or city...',
                hintStyle: const TextStyle(fontSize: 13, color: Colors.grey),
                prefixIcon: const Icon(Icons.search, size: 20, color: OprivaTheme.healthcareTeal),
                filled: true,
                fillColor: const Color(0xFFF1F5F9),
                contentPadding: const EdgeInsets.symmetric(vertical: 0),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ),

          // Sub-header Banner
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            color: const Color(0xFFF8FAFC),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Verified OP Hospitals Nearby',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: OprivaTheme.navyDark,
                  ),
                ),
                Text(
                  _selectedLanguage,
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: OprivaTheme.healthcareTeal,
                  ),
                ),
              ],
            ),
          ),

          // Hospital List
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator(color: OprivaTheme.healthcareTeal))
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _hospitals.length,
                    itemBuilder: (ctx, idx) {
                      final hosp = _hospitals[idx];
                      return _buildHospitalCard(hosp);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildHospitalCard(HospitalModel hosp) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Flexible(
                            child: Text(
                              hosp.name,
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                                color: OprivaTheme.navyDark,
                              ),
                            ),
                          ),
                          if (hosp.verified) ...[
                            const SizedBox(width: 6),
                            const Icon(Icons.verified, size: 16, color: OprivaTheme.healthcareTeal),
                          ]
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${hosp.locality}, ${hosp.city}',
                        style: const TextStyle(fontSize: 12, color: Colors.black54),
                      ),
                    ],
                  ),
                ),
                if (hosp.distanceKm != null)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      '${hosp.distanceKm} km',
                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 12),

            // Google Rating & Review Count
            Row(
              children: [
                if (hosp.googleRating != null) ...[
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFEF3C7),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.star, size: 14, color: Color(0xFFF59E0B)),
                        const SizedBox(width: 4),
                        Text(
                          '${hosp.googleRating}',
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF92400E),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 6),
                  Text(
                    '(${hosp.googleReviewCount} reviews)',
                    style: const TextStyle(fontSize: 11, color: Colors.grey),
                  ),
                  const SizedBox(width: 8),
                ],
                Text(
                  hosp.ratingAttribution,
                  style: const TextStyle(fontSize: 10, color: Colors.black38),
                ),
              ],
            ),
            const Divider(height: 24),

            // Available OP Cards
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Normal OP Card', style: TextStyle(fontSize: 11, color: Colors.grey)),
                    const Text('₹350.00', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700)),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Special Priority Card', style: TextStyle(fontSize: 11, color: Colors.grey)),
                    const Text('₹750.00', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: OprivaTheme.healthcareTeal)),
                  ],
                ),
                ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (ctx) => OpCardSelectionScreen(hospital: hosp),
                      ),
                    );
                  },
                  child: const Text('Book OP'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showBookingSheet(HospitalModel hosp) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Select OP Registration at ${hosp.name}',
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
              ),
              const SizedBox(height: 12),
              ...hosp.availableRegistrationTypes.map((type) {
                final isSpecial = type.typeCode == 'SPECIAL';
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: isSpecial ? OprivaTheme.healthcareTeal : const Color(0xFFE2E8F0),
                    ),
                    color: isSpecial ? const Color(0xFFF0FDFA) : Colors.white,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(type.displayName, style: const TextStyle(fontWeight: FontWeight.w700)),
                          Text('Fee: ₹${type.feeAmount.toStringAsFixed(2)}', style: const TextStyle(fontSize: 13, color: Colors.grey)),
                        ],
                      ),
                      ElevatedButton(
                        onPressed: () {
                          Navigator.pop(ctx);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text('Held slot for ${type.displayName}. Proceeding to verified payment...')),
                          );
                        },
                        child: const Text('Pay Online'),
                      ),
                    ],
                  ),
                );
              }),
            ],
          ),
        );
      },
    );
  }
}
