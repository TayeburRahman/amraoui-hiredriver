void main() {
  String dateStr = "05/07/2026";
  try {
    print(DateTime.parse(dateStr));
  } catch (e) {
    print("Failed parse");
  }
}
