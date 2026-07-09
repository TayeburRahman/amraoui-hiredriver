void main() {
  Map<String, dynamic> mission = {
    'myQuoteFuelCost': 50,
    'myQuotePickupDate': '2026-07-09'
  };
  
  print(mission['myQuoteFuelCost']?.toString() ?? '0');
  print(mission['myQuotePickupDate']?.toString() ?? '');
}
