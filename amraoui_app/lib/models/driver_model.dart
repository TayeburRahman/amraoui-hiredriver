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
  final String? licenseDocumentFront;
  final String? licenseDocumentBack;
  final String? idDocument;
  final String? idDocumentFront;
  final String? idDocumentBack;
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
    this.licenseDocumentFront,
    this.licenseDocumentBack,
    this.idDocument,
    this.idDocumentFront,
    this.idDocumentBack,
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
      licenseDocumentFront: json['license_document_front']?.toString(),
      licenseDocumentBack: json['license_document_back']?.toString(),
      idDocument: json['id_document']?.toString(),
      idDocumentFront: json['id_document_front']?.toString(),
      idDocumentBack: json['id_document_back']?.toString(),
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
        'license_document_front': licenseDocumentFront,
        'license_document_back': licenseDocumentBack,
        'id_document': idDocument,
        'id_document_front': idDocumentFront,
        'id_document_back': idDocumentBack,
        'contract_document': contractDocument,
        'decline_reason': declineReason,
      };
}
