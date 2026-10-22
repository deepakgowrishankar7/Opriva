import 'package:flutter/material.dart';
import '../core/theme/opriva_theme.dart';
import '../core/services/local_ticket_storage_service.dart';
import 'hospital_map_screen.dart';
import 'live_queue_tracker_screen.dart';

class PatientOpHistoryScreen extends StatefulWidget {
  const PatientOpHistoryScreen({Key? key}) : super(key: key);

  @override
  State<PatientOpHistoryScreen> createState() => _PatientOpHistoryScreenState();
}

class _PatientOpHistoryScreenState extends State<PatientOpHistoryScreen> {
  @override
  Widget build(BuildContext context) {
    final patient = LocalTicketStorageService.currentPatient;
    final tickets = LocalTicketStorageService.getDeviceTickets();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('My Registered OP Cards'),
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => setState(() {}),
          ),
        ],
      ),
      body: Column(
        children: [
          // User Profile Card
          if (patient != null)
            Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [OprivaTheme.healthcareTeal, Color(0xFF0F766E)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: OprivaTheme.healthcareTeal.withOpacity(0.2),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  )
                ],
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 26,
                    backgroundColor: Colors.white,
                    child: Text(
                      patient.fullName.isNotEmpty ? patient.fullName[0].toUpperCase() : 'P',
                      style: const TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: OprivaTheme.healthcareTeal,
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          patient.fullName,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Phone: +91 ${patient.phone}',
                          style: const TextStyle(color: Colors.white70, fontSize: 12),
                        ),
                        Text(
                          'Total Bookings: ${tickets.length}',
                          style: const TextStyle(
                            color: Color(0xFF99F6E4),
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                  OutlinedButton(
                    onPressed: () {
                      LocalTicketStorageService.logout();
                      Navigator.pop(context);
                    },
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.white,
                      side: const BorderSide(color: Colors.white54),
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    ),
                    child: const Text('Log Out', style: TextStyle(fontSize: 11)),
                  ),
                ],
              ),
            ),

          // OP Cards List Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Saved OP Consultation Slips',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: OprivaTheme.navyDark,
                  ),
                ),
                Text(
                  '${tickets.length} Registered',
                  style: const TextStyle(fontSize: 12, color: Colors.black54),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),

          // Tickets List or Empty State
          Expanded(
            child: tickets.isEmpty
                ? Center(
                    child: Padding(
                      padding: const EdgeInsets.all(32),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(20),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF1F5F9),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.confirmation_number_outlined,
                                size: 54, color: Colors.grey),
                          ),
                          const SizedBox(height: 16),
                          const Text(
                            'No Registered OP Cards Yet',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w800,
                              color: OprivaTheme.navyDark,
                            ),
                          ),
                          const SizedBox(height: 6),
                          const Text(
                            'When you book an OP card at any partnered hospital, your confirmed token and hospital route map will stay saved here.',
                            textAlign: TextAlign.center,
                            style: TextStyle(fontSize: 12, color: Colors.black54),
                          ),
                        ],
                      ),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: tickets.length,
                    itemBuilder: (ctx, idx) {
                      final ticket = tickets[idx];
                      return _buildTicketCard(context, ticket);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildTicketCard(BuildContext context, LocalPatientTicket ticket) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Badge & Token No
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFFE0F2FE),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    ticket.cardTypeName,
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF0369A1),
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                  decoration: BoxDecoration(
                    color: OprivaTheme.healthcareTeal,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    'TOKEN ${ticket.tokenNumber}',
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w900,
                      fontSize: 13,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Hospital Name & Locality
            Text(
              ticket.hospitalName,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w800,
                color: OprivaTheme.navyDark,
              ),
            ),
            if (ticket.branchName.isNotEmpty) ...[
              const SizedBox(height: 2),
              Row(
                children: [
                  const Icon(Icons.location_on, size: 14, color: Colors.grey),
                  const SizedBox(width: 4),
                  Text(
                    ticket.branchName,
                    style: const TextStyle(fontSize: 12, color: Colors.black54),
                  ),
                ],
              ),
            ],
            const Divider(height: 20),

            // Metadata Grid
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Patient Name', style: TextStyle(fontSize: 11, color: Colors.grey)),
                    Text(ticket.patientName,
                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('OP Reg Number', style: TextStyle(fontSize: 11, color: Colors.grey)),
                    Text(ticket.opRegistrationNumber,
                        style: const TextStyle(
                            fontSize: 12, fontWeight: FontWeight.bold, fontFamily: 'monospace')),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    const Text('Fee Paid', style: TextStyle(fontSize: 11, color: Colors.grey)),
                    Text('₹${ticket.feePaid.toStringAsFixed(0)}',
                        style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w900,
                            color: OprivaTheme.healthcareTeal)),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 14),

            // Action Buttons: Track Queue & Show Map
            Row(
              children: [
                // Track Turn Button
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (c) => LiveQueueTrackerScreen(
                            hospitalName: ticket.hospitalName,
                            opRegistrationNumber: ticket.opRegistrationNumber,
                            tokenNumber: ticket.tokenNumber,
                            cardTypeName: ticket.cardTypeName,
                            patientName: ticket.patientName,
                            feePaid: ticket.feePaid,
                            currentTokenCalled: ticket.currentTokenCalled,
                            patientsAhead: ticket.patientsAhead,
                            estWaitMinutes: ticket.estWaitMinutes,
                            receptionistPhone: ticket.receptionistPhone,
                          ),
                        ),
                      );
                    },
                    icon: const Icon(Icons.speed, size: 16),
                    label: const Text('Live Turn Queue', style: TextStyle(fontSize: 12)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: OprivaTheme.healthcareTeal,
                      padding: const EdgeInsets.symmetric(vertical: 10),
                    ),
                  ),
                ),
                const SizedBox(width: 8),

                // Navigate Map Button
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (c) => HospitalMapScreen(
                            hospitalName: ticket.hospitalName,
                            locality: ticket.branchName,
                            city: 'Hyderabad',
                            latitude: ticket.latitude ?? 17.4156,
                            longitude: ticket.longitude ?? 78.4121,
                            receptionistPhone: ticket.receptionistPhone,
                          ),
                        ),
                      );
                    },
                    icon: const Icon(Icons.map_outlined, size: 16, color: OprivaTheme.navyDark),
                    label: const Text(
                      'Hospital Map',
                      style: TextStyle(fontSize: 12, color: OprivaTheme.navyDark),
                    ),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      side: const BorderSide(color: Color(0xFFCBD5E1)),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
