import 'package:flutter/material.dart';

class AppLocalizations {
  final Locale locale;

  AppLocalizations(this.locale);

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const List<Locale> supportedLocales = [
    Locale('en'), // English
    Locale('te'), // Telugu
    Locale('hi'), // Hindi
    Locale('bn'), // Bengali
    Locale('mr'), // Marathi
    Locale('ta'), // Tamil
    Locale('ur'), // Urdu (RTL)
    Locale('gu'), // Gujarati
    Locale('kn'), // Kannada
    Locale('ml'), // Malayalam
    Locale('or'), // Odia
    Locale('pa'), // Punjabi
  ];

  static bool isRtl(String langCode) => langCode == 'ur';

  static final Map<String, Map<String, String>> _localizedValues = {
    'en': {
      'appName': 'Opriva',
      'tagline': 'Healthcare, Without the Wait.',
      'discoverHospitals': 'Discover Verified Hospitals',
      'searchHospitalHint': 'Search hospital name, locality, or city...',
      'normalCard': 'Normal OP Card',
      'specialCard': 'Special Priority OP Card',
      'token': 'Token',
      'liveQueue': 'Live Queue Status',
      'patientsAhead': 'Patients Ahead',
      'estWait': 'Est. Wait Time',
      'callReceptionist': 'Call Reception Desk',
      'digitalReceipt': 'Digital Receipt',
      'uploadReport': 'Upload Medical Report',
      'prescriptions': 'Prescriptions & Visits',
      'familyProfiles': 'Family Member Profiles',
      'payAndConfirm': 'Pay & Confirm Slot',
    },
    'te': {
      'appName': 'Opriva',
      'tagline': 'ఆరోగ్య సంరక్షణ, వేచి చూడకుండానే.',
      'discoverHospitals': 'ధృవీకరించబడిన ఆసుపత్రులు',
      'searchHospitalHint': 'ఆసుపత్రి పేరు లేదా ప్రాంతం శోధించండి...',
      'normalCard': 'సాధారణ OP కార్డు',
      'specialCard': 'ప్రత్యేక ప్రాధాన్యత OP కార్డు',
      'token': 'టోకెన్',
      'liveQueue': 'లైవ్ క్యూ వివరాలు',
      'patientsAhead': 'ముందున్న రోగులు',
      'estWait': 'అంచనా సమయం',
      'callReceptionist': 'రిసెప్షన్ కాల్ చేయండి',
      'digitalReceipt': 'డిజిటల్ రసీదు',
      'uploadReport': 'రిపోర్టు అప్‌లోడ్ చేయండి',
      'prescriptions': 'ప్రిస్క్రిప్షన్లు & సందర్శనలు',
      'familyProfiles': 'కుటుంబ సభ్యుల ప్రొఫైల్స్',
      'payAndConfirm': 'చెల్లించి కన్ఫర్మ్ చేయండి',
    },
    'hi': {
      'appName': 'Opriva',
      'tagline': 'स्वास्थ्य सेवा, बिना किसी इंतज़ार के।',
      'discoverHospitals': 'सत्यापित अस्पताल खोजें',
      'searchHospitalHint': 'अस्पताल का नाम या शहर खोजें...',
      'normalCard': 'सामान्य OP कार्ड',
      'specialCard': 'विशेष प्राथमिकता OP कार्ड',
      'token': 'टोकन',
      'liveQueue': 'लाइव कतार स्थिति',
      'patientsAhead': 'आगे मरीज',
      'estWait': 'अनुमानित समय',
      'callReceptionist': 'रिसेप्शन पर कॉल करें',
      'digitalReceipt': 'डिजिटल रसीद',
      'uploadReport': 'रिपोर्ट अपलोड करें',
      'prescriptions': 'पर्ची और मुलाकात इतिहास',
      'familyProfiles': 'परिवार के सदस्य',
      'payAndConfirm': 'भुगतान करें और पुष्टि करें',
    },
    'bn': {
      'appName': 'Opriva',
      'tagline': 'স্বাস্থ্যসেবা, অপেক্ষা ছাড়াই।',
      'discoverHospitals': 'যাচাইকৃত হাসপাতাল খুঁজুন',
      'searchHospitalHint': 'হাসপাতালের নাম খুঁজুন...',
      'normalCard': 'সাধারণ ওপি কার্ড',
      'specialCard': 'বিশেষ অগ্রাধিকার ওপি কার্ড',
      'token': 'টোকেন',
      'liveQueue': 'লাইভ সারি অবস্থা',
      'patientsAhead': 'আগের রোগী',
      'estWait': 'আনুমানিক সময়',
      'callReceptionist': 'রিসেপশনে কল করুন',
      'digitalReceipt': 'ডিজিটাল রসিদ',
      'uploadReport': 'রিপোর্ট আপলোড করুন',
      'prescriptions': 'প্রেসক্রিপশন ও পরিদর্শন',
      'familyProfiles': 'পরিবারের সদস্য',
      'payAndConfirm': 'পেমেন্ট ও নিশ্চিত করুন',
    },
    'mr': {
      'appName': 'Opriva',
      'tagline': 'आरोग्यसेवा, प्रतिक्षेशिवाय.',
      'discoverHospitals': 'सत्यापित रुग्णालये शोधा',
      'searchHospitalHint': 'रुग्णालयाचे नाव शोधा...',
      'normalCard': 'सामान्य OP कार्ड',
      'specialCard': 'विशेष प्राधान्य OP कार्ड',
      'token': 'टोकन',
      'liveQueue': 'थेट रांग स्थिती',
      'patientsAhead': 'पुढील रुग्ण',
      'estWait': 'अंदाजे वेळ',
      'callReceptionist': 'स्वागत कक्षास कॉल करा',
      'digitalReceipt': 'डिजिटल पावती',
      'uploadReport': 'अहवाल अपलोड करा',
      'prescriptions': 'प्रिस्क्रिप्शन व भेटी',
      'familyProfiles': 'कुटुंबातील सदस्य',
      'payAndConfirm': 'पैसे भरा आणि पुष्टी करा',
    },
    'ta': {
      'appName': 'Opriva',
      'tagline': 'சுகாதாரம், காத்திருப்பு இல்லாமல்.',
      'discoverHospitals': 'சரிபார்க்கப்பட்ட மருத்துவமனைகள்',
      'searchHospitalHint': 'மருத்துவமனை பெயர் தேடவும்...',
      'normalCard': 'சாதாரண OP கார்டு',
      'specialCard': 'சிறப்பு முன்னுரிமை OP கார்டு',
      'token': 'டோக்கன்',
      'liveQueue': 'நேரலை வரிசை நிலை',
      'patientsAhead': 'முந்தைய நோயாளிகள்',
      'estWait': 'மதிப்பிடப்பட்ட நேரம்',
      'callReceptionist': 'வரவேற்பாளரை அழைக்கவும்',
      'digitalReceipt': 'டிஜிட்டல் ரசீது',
      'uploadReport': 'அறிக்கையைப் பதிவேற்றவும்',
      'prescriptions': 'மருந்துச்சீட்டு & வரலாறு',
      'familyProfiles': 'குடும்ப உறுப்பினர்கள்',
      'payAndConfirm': 'பணம் செலுத்தி உறுதிசெய்',
    },
    'ur': {
      'appName': 'Opriva',
      'tagline': 'صحت کی دیکھ بھال، بنا کسی انتظار کے۔',
      'discoverHospitals': 'تصدیق شدہ ہسپتال تلاش کریں',
      'searchHospitalHint': 'ہسپتال کا نام تلاش کریں...',
      'normalCard': 'عام او پی کارڈ',
      'specialCard': 'خصوصی ترجیحی او پی کارڈ',
      'token': 'ٹوکن',
      'liveQueue': 'لائیو قطار کی صورتحال',
      'patientsAhead': 'مریض آگے',
      'estWait': 'متوقع وقت',
      'callReceptionist': 'ریسیپشن پر کال کریں',
      'digitalReceipt': 'ڈیجیٹل رسید',
      'uploadReport': 'رپورٹ اپ لوڈ کریں',
      'prescriptions': 'نسخہ جات اور تاریخ',
      'familyProfiles': 'خاندان کے افراد',
      'payAndConfirm': 'ادائیگی اور تصدیق کریں',
    },
    'gu': {
      'appName': 'Opriva',
      'tagline': 'સ્વાસ્થ્ય સેવા, રાહ જોયા વગર.',
      'discoverHospitals': 'ચકાસાયેલ હોસ્પિટલો શોધો',
      'searchHospitalHint': 'હોસ્પિટલનું નામ શોધો...',
      'normalCard': 'સામાન્ય OP કાર્ડ',
      'specialCard': 'વિશેષ અગ્રતા OP કાર્ડ',
      'token': 'ટોકન',
      'liveQueue': 'લાઇવ કતાર સ્થિતિ',
      'patientsAhead': 'આગળ દર્દીઓ',
      'estWait': 'અંદાજિત સમય',
      'callReceptionist': 'રિસેપ્શન કૉલ કરો',
      'digitalReceipt': 'ડિજિટલ રસીદ',
      'uploadReport': 'રિપોર્ટ અપલોડ કરો',
      'prescriptions': 'પ્રિસ્ક્રિપ્શન અને મુલાકાતો',
      'familyProfiles': 'પરિવારના સભ્યો',
      'payAndConfirm': 'ચુકવણી કરો અને પુષ્ટિ કરો',
    },
    'kn': {
      'appName': 'Opriva',
      'tagline': 'ಆರೋಗ್ಯ ರಕ್ಷಣೆ, ಕಾಯುವಿಕೆಯಿಲ್ಲದೆ.',
      'discoverHospitals': 'ದೃಢೀಕೃತ ಆಸ್ಪತ್ರೆಗಳನ್ನು ಹುಡುಕಿ',
      'searchHospitalHint': 'ಆಸ್ಪತ್ರೆಯ ಹೆಸರು ಹುಡುಕಿ...',
      'normalCard': 'ಸಾಮಾನ್ಯ OP ಕಾರ್ಡ್',
      'specialCard': 'ವಿಶೇಷ ಆದ್ಯತೆ OP ಕಾರ್ಡ್',
      'token': 'ಟೋಕನ್',
      'liveQueue': 'ಲೈವ್ ಕ್ಯೂ ಸ್ಥಿತಿ',
      'patientsAhead': 'ಮುಂದಿನ ರೋಗಿಗಳು',
      'estWait': 'ಅಂದಾಜು ಸಮಯ',
      'callReceptionist': 'ರಿಸೆಪ್ಷನ್‌ಗೆ ಕರೆ ಮಾಡಿ',
      'digitalReceipt': 'ಡಿಜಿಟಲ್ ರಸೀದಿ',
      'uploadReport': 'ವರದಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
      'prescriptions': 'ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಮತ್ತು ಭೇಟಿಗಳು',
      'familyProfiles': 'ಕುಟುಂಬದ ಸದಸ್ಯರು',
      'payAndConfirm': 'ಪಾವತಿಸಿ ಮತ್ತು ಖಚಿತಪಡಿಸಿ',
    },
    'ml': {
      'appName': 'Opriva',
      'tagline': 'ആരോഗ്യ സംരക്ഷണം, കാത്തിരിപ്പില്ലാതെ.',
      'discoverHospitals': 'ആശുപത്രികൾ കണ്ടെത്തുക',
      'searchHospitalHint': 'ആശുപത്രിയുടെ പേര് തിരയുക...',
      'normalCard': 'സാധാരണ ഒപി കാർഡ്',
      'specialCard': 'പ്രത്യേക മുൻഗണന ഒപി കാർഡ്',
      'token': 'ടോക്കൺ',
      'liveQueue': 'തത്സമയ ക്യൂ നില',
      'patientsAhead': 'മുൻപിലുള്ള രോഗികൾ',
      'estWait': 'പ്രതീക്ഷിക്കുന്ന സമയം',
      'callReceptionist': 'റിസപ്ഷനിലേക്ക് വിളിക്കുക',
      'digitalReceipt': 'ഡിജിറ്റൽ രസീത്',
      'uploadReport': 'റിപ്പോർട്ട് അപ്‌ലോഡ് ചെയ്യുക',
      'prescriptions': 'കുറിപ്പടിയും സന്ദർശനങ്ങളും',
      'familyProfiles': 'കുടുംബാംഗങ്ങൾ',
      'payAndConfirm': 'പണമടച്ച് സ്ഥിരീകരിക്കുക',
    },
    'or': {
      'appName': 'Opriva',
      'tagline': 'ସ୍ୱାସ୍ଥ୍ୟସେବା, ବିନା ଅପେକ୍ଷାରେ।',
      'discoverHospitals': 'ଡାକ୍ତରଖାନା ଖୋଜନ୍ତୁ',
      'searchHospitalHint': 'ଡାକ୍ତରଖାନାର ନାମ ଖୋଜନ୍ତୁ...',
      'normalCard': 'ସାଧାରଣ OP କାର୍ଡ',
      'specialCard': 'ସ୍ୱତନ୍ତ୍ର ପ୍ରାଥମିକତା OP କାର୍ଡ',
      'token': 'ଟୋକନ୍',
      'liveQueue': 'ଲାଇଭ୍ ଧାଡ଼ି ସ୍ଥିତି',
      'patientsAhead': 'ଆଗରେ ଥିବା ରୋଗୀ',
      'estWait': 'ଆନୁମାନିକ ସମୟ',
      'callReceptionist': 'ରିସେପସନ୍ କଲ୍ କରନ୍ତୁ',
      'digitalReceipt': 'ଡିଜିଟାଲ୍ ରସିଦ',
      'uploadReport': 'ରିପୋର୍ଟ ଅପଲୋଡ୍ କରନ୍ତୁ',
      'prescriptions': 'ପ୍ରେସକ୍ରିପସନ୍ ଏବଂ ପରିଦର୍ଶନ',
      'familyProfiles': 'ପରିବାର ସଦସ୍ୟ',
      'payAndConfirm': 'ଦେୟ ଦିଅନ୍ତୁ ଏବଂ ନିଶ୍ଚିତ କରନ୍ତୁ',
    },
    'pa': {
      'appName': 'Opriva',
      'tagline': 'ਸਿਹਤ ਸੰਭਾਲ, ਬਿਨਾਂ ਕਿਸੇ ਉਡੀਕ ਦੇ।',
      'discoverHospitals': 'ਹਸਪਤਾਲ ਲੱਭੋ',
      'searchHospitalHint': 'ਹਸਪਤਾਲ ਦਾ ਨਾਮ ਖੋਜੋ...',
      'normalCard': 'ਆਮ OP ਕਾਰਡ',
      'specialCard': 'ਵਿਸ਼ੇਸ਼ ਤਰਜੀਹੀ OP ਕਾਰਡ',
      'token': 'ਟੋਕਨ',
      'liveQueue': 'ਲਾਈਵ ਕਤਾਰ ਸਥਿਤੀ',
      'patientsAhead': 'ਅੱਗੇ ਮਰੀਜ਼',
      'estWait': 'ਅੰਦਾਜ਼ਨ ਸਮਾਂ',
      'callReceptionist': 'ਰਿਸੈਪਸ਼ਨ ਤੇ ਕਾਲ ਕਰੋ',
      'digitalReceipt': 'ਡਿਜੀਟਲ ਰਸੀਦ',
      'uploadReport': 'ਰਿਪੋਰਟ ਅੱਪਲੋਡ ਕਰੋ',
      'prescriptions': 'ਨੁਸਖ਼ੇ ਅਤੇ ਮੁਲਾਕਾਤਾਂ',
      'familyProfiles': 'ਪਰਿਵਾਰਕ ਮੈਂਬਰ',
      'payAndConfirm': 'ਭੁਗਤਾਨ ਕਰੋ ਅਤੇ ਪੁਸ਼ਟੀ ਕਰੋ',
    },
  };

  String translate(String key) {
    final lang = locale.languageCode;
    return _localizedValues[lang]?[key] ?? _localizedValues['en']?[key] ?? key;
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) {
    return [
      'en',
      'te',
      'hi',
      'bn',
      'mr',
      'ta',
      'ur',
      'gu',
      'kn',
      'ml',
      'or',
      'pa'
    ].contains(locale.languageCode);
  }

  @override
  Future<AppLocalizations> load(Locale locale) async {
    return AppLocalizations(locale);
  }

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}
