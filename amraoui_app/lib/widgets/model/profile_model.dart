class ProfileModel {
  final AppLocation location;
  final Preferences preferences;
  final String serviceProviderProfileStatus;
  final String id;
  final String serviceId;
  final String name;
  final String role;
  final String email;
  final String dateOfBirth;
  final String countryCode;
  final String phone;
  final String status;
  final bool verified;
  final String createdAt;
  final String updatedAt;
  final String profileImage;
  final String gender;
  final String bio;
  final String userName;
  final String address;
  final int followerCount;
  final int followingCount;
  final int totalFriendCount;
  final int realsCount;
  final bool isFollowing;
  final bool isFollower;
  final bool isFriend;
  final bool iRequestedToHim;
  final bool heRequestedToMe;

  ProfileModel({
    this.location = const AppLocation(),
    this.preferences = const Preferences(),
    this.serviceProviderProfileStatus = "",
    this.id = "",
    this.serviceId = "",
    this.name = "",
    this.role = "",
    this.email = "",
    this.dateOfBirth = "",
    this.countryCode = "",
    this.phone = "",
    this.status = "",
    this.verified = false,
    this.createdAt = "",
    this.updatedAt = "",
    this.profileImage = "",
    this.gender = "",
    this.bio = "",
    this.userName = "",
    this.address = "",
    this.followerCount = 0,
    this.followingCount = 0,
    this.realsCount = 0,
    this.totalFriendCount = 0,
    this.isFollowing = false,
    this.isFollower = false,
    this.isFriend = false,
    this.iRequestedToHim = false,
    this.heRequestedToMe = false,
  });

  factory ProfileModel.fromJson(Map<String, dynamic> json) => ProfileModel(
        location: json["location"] != null && json["location"] is Map ? AppLocation.fromJson(json["location"]) : const AppLocation(),
        preferences: json["preferences"] != null && json["preferences"] is Map ? Preferences.fromJson(json["preferences"]) : const Preferences(),
        serviceProviderProfileStatus: "${json["serviceProviderProfileStatus"] ?? ""}",
        id: "${json["_id"] ?? ""}",
        serviceId: "${json["serviceId"] ?? ""}",
        name: "${json["name"] ?? ""}",
        role: "${json["role"] ?? ""}",
        email: "${json["email"] ?? ""}",
        dateOfBirth: "${json["dateOfBirth"] ?? ""}",
        countryCode: "${json["countryCode"] ?? ""}",
        phone: "${json["phone"] ?? ""}",
        status: "${json["status"] ?? ""}",
        verified: json["verified"] != null && json["verified"] is bool ? json["verified"] : false,
        createdAt: "${json["createdAt"] ?? ""}",
        updatedAt: "${json["updatedAt"] ?? ""}",
        profileImage: "${json["profileImage"] ?? ""}",
        gender: "${json["gender"] ?? ""}",
        bio: "${json["bio"] ?? ""}",
        userName: "${json["userName"] ?? ""}",
        address: "${json["address"] ?? ""}",
        followerCount: json["followerCount"] != null && json["followerCount"] is num ? int.tryParse(json["followerCount"].toString()) ?? 0 : 0,
        followingCount: json["followingCount"] != null && json["followingCount"] is num ? int.tryParse(json["followingCount"].toString()) ?? 0 : 0,
        totalFriendCount: json["totalFriendCount"] != null && json["totalFriendCount"] is num ? int.tryParse(json["totalFriendCount"].toString()) ?? 0 : 0,
        realsCount: json["realsCount"] != null && json["realsCount"] is num ? int.tryParse(json["realsCount"].toString()) ?? 0 : 0,
        isFollowing: json["isFollowing"] is bool ? json["isFollowing"] : false,
        isFollower: json["isFollower"] is bool ? json["isFollower"] : false,
        isFriend: json["isFriend"] is bool ? json["isFriend"] : false,
        iRequestedToHim: json["iRequestedToHim"] is bool ? json["iRequestedToHim"] : false,
        heRequestedToMe: json["heRequestedToMe"] is bool ? json["heRequestedToMe"] : false,
      );

  ProfileModel copyWith({
    AppLocation? location,
    Preferences? preferences,
    String? serviceProviderProfileStatus,
    String? id,
    String? serviceId,
    String? name,
    String? role,
    String? email,
    String? dateOfBirth,
    String? countryCode,
    String? phone,
    String? status,
    bool? verified,
    String? createdAt,
    String? updatedAt,
    String? profileImage,
    String? gender,
    String? bio,
    String? userName,
    String? address,
    int? followerCount,
    int? followingCount,
    int? realsCount,
    int? totalFriendCount,
    bool? isFollowing,
    bool? isFollower,
    bool? isFriend,
    bool? iRequestedToHim,
    bool? heRequestedToMe,
  }) {
    return ProfileModel(
      location: location ?? this.location,
      preferences: preferences ?? this.preferences,
      serviceProviderProfileStatus: serviceProviderProfileStatus ?? this.serviceProviderProfileStatus,
      id: id ?? this.id,
      serviceId: serviceId ?? this.serviceId,
      name: name ?? this.name,
      role: role ?? this.role,
      email: email ?? this.email,
      dateOfBirth: dateOfBirth ?? this.dateOfBirth,
      countryCode: countryCode ?? this.countryCode,
      phone: phone ?? this.phone,
      status: status ?? this.status,
      verified: verified ?? this.verified,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      profileImage: profileImage ?? this.profileImage,
      gender: gender ?? this.gender,
      bio: bio ?? this.bio,
      userName: userName ?? this.userName,
      address: address ?? this.address,
      followerCount: followerCount ?? this.followerCount,
      followingCount: followingCount ?? this.followingCount,
      realsCount: realsCount ?? this.realsCount,
      totalFriendCount: totalFriendCount ?? this.totalFriendCount,
      isFollowing: isFollowing ?? this.isFollowing,
      isFollower: isFollower ?? this.isFollower,
      isFriend: isFriend ?? this.isFriend,
      iRequestedToHim: iRequestedToHim ?? this.iRequestedToHim,
      heRequestedToMe: heRequestedToMe ?? this.heRequestedToMe,
    );
  }
}

class AppLocation {
  final String type;
  final List<double> coordinates;

  const AppLocation({
    this.type = "",
    this.coordinates = const <double>[],
  });

  factory AppLocation.fromJson(Map<String, dynamic> json) => AppLocation(
        type: "${json["type"] ?? ""}",
        coordinates: json["coordinates"] is List ? (json["coordinates"] as List).map((e) => double.tryParse(e.toString()) ?? 0).toList() : <double>[],
      );

  Map<String, dynamic> toJson() => {
        "type": type,
        "coordinates": List<dynamic>.from(coordinates.map((x) => x)),
      };
  AppLocation copyWith({
    String? type,
    List<double>? coordinates,
  }) {
    return AppLocation(
      type: type ?? this.type,
      coordinates: coordinates ?? this.coordinates,
    );
  }
}

class Preferences {
  final List<String> eventCategory;
  final List<String> serviceCategory;

  const Preferences({
    this.eventCategory = const <String>[],
    this.serviceCategory = const <String>[],
  });

  factory Preferences.fromJson(Map<String, dynamic> json) => Preferences(
        eventCategory: json["eventCategory"] != null && json["eventCategory"] is List ? (json["eventCategory"] as List).map((e) => e.toString()).toList() : <String>[],
        serviceCategory: json["serviceCategory"] != null && json["serviceCategory"] is List ? (json["serviceCategory"] as List).map((e) => e.toString()).toList() : <String>[],
      );

  Map<String, dynamic> toJson() => {
        "eventCategory": eventCategory.map((e) => e).toList(),
        "serviceCategory": serviceCategory.map((e) => e).toList(),
      };

  Preferences copyWith({
    List<String>? eventCategory,
    List<String>? serviceCategory,
  }) {
    return Preferences(
      eventCategory: eventCategory ?? this.eventCategory,
      serviceCategory: serviceCategory ?? this.serviceCategory,
    );
  }
}
