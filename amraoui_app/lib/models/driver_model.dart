class DriverModel {
  final String id;
  final String name;
  final String email;
  final String? phoneNumber;
  final String? address;
  final String? profileImage;
  final String? licenseNumber;
  final String? vehicleType;
  final String? vehiclePlate;
  final String status;
  final bool documentsSubmitted;
  final String? licenseDocument;
  final String? idDocument;
  final String? contractDocument;
  final String? declineReason;

  DriverModel({
    required this.id,
    required this.name,
    required this.email,
    this.phoneNumber,
    this.address,
    this.profileImage,
    this.licenseNumber,
    this.vehicleType,
    this.vehiclePlate,
    required this.status,
    this.documentsSubmitted = false,
    this.licenseDocument,
    this.idDocument,
    this.contractDocument,
    this.declineReason,
  });

  bool get isApproved => status == 'approved';
  bool get isPending => status == 'pending';
  bool get isDeclined => status == 'declined';

  factory DriverModel.fromJson(Map<String, dynamic> json) {
    return DriverModel(
      id: json['_id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      phoneNumber: json['phone_number']?.toString(),
      address: json['address']?.toString(),
      profileImage: json['profile_image']?.toString(),
      licenseNumber: json['license_number']?.toString(),
      vehicleType: json['vehicle_type']?.toString(),
      vehiclePlate: json['vehicle_plate']?.toString(),
      status: json['status']?.toString() ?? 'pending',
      documentsSubmitted: json['documents_submitted'] == true,
      licenseDocument: json['license_document']?.toString(),
      idDocument: json['id_document']?.toString(),
      contractDocument: json['contract_document']?.toString(),
      declineReason: json['decline_reason']?.toString(),
    );
  }

  Map<String, dynamic> toJson() => {
        '_id': id,
        'name': name,
        'email': email,
        'phone_number': phoneNumber,
        'address': address,
        'profile_image': profileImage,
        'license_number': licenseNumber,
        'vehicle_type': vehicleType,
        'vehicle_plate': vehiclePlate,
        'status': status,
        'documents_submitted': documentsSubmitted,
        'license_document': licenseDocument,
        'id_document': idDocument,
        'contract_document': contractDocument,
        'decline_reason': declineReason,
      };
}
