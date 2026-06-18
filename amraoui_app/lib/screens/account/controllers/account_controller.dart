import 'dart:io';
import 'package:amraoui_app/service/repository/driver_repository.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';

class AccountController extends GetxController {
  final DriverRepository _repository = DriverRepository();
  final ImagePicker _picker = ImagePicker();

  var isLoading = true.obs;
  var isUploading = false.obs;
  var isSavingSkills = false.obs;

  var name = ''.obs;
  var email = ''.obs;
  var phone = ''.obs;
  var address = ''.obs;
  var dateOfBirth = ''.obs;
  var profileImage = ''.obs;
  var completedJobs = 0.obs;
  var rating = 0.0.obs;
  var isVerified = false.obs;
  
  var isUpdatingProfile = false.obs;

  // RxList to hold dynamic skills map
  var skills = <Map<String, dynamic>>[].obs;

  @override
  void onInit() {
    super.onInit();
    fetchProfile();
  }

  Future<void> fetchProfile() async {
    isLoading.value = true;
    final data = await _repository.getMyProfile();
    if (data != null) {
      name.value = data['name'] ?? 'Driver';
      email.value = data['email'] ?? '';
      phone.value = data['phone_number'] ?? '';
      address.value = data['address'] ?? '';
      dateOfBirth.value = data['dateOfBirth'] ?? '';
      profileImage.value = data['profile_image'] ?? '';
      completedJobs.value = data['totalDeliveries'] ?? 0;
      rating.value = (data['rating'] != null) ? (data['rating'] as num).toDouble() : 0.0;
      isVerified.value = data['status'] == 'approved';
      
      if (data['skills'] != null && data['skills'] is List) {
        skills.value = List<Map<String, dynamic>>.from(data['skills']);
      }
    }
    isLoading.value = false;
  }

  Future<void> pickAndUploadImage() async {
    try {
      final XFile? image = await _picker.pickImage(source: ImageSource.gallery);
      if (image != null) {
        isUploading.value = true;
        Get.snackbar('Uploading', 'Uploading profile image...');
        
        final updatedData = await _repository.updateProfileImage(image);
        
        if (updatedData != null) {
          profileImage.value = updatedData['profile_image'] ?? '';
          Get.snackbar('Success', 'Profile image updated');
        }
      }
    } catch (e) {
      final msg = e.toString().replaceAll('Exception: ', '');
      print('Error picking/uploading image: $e');
      Get.snackbar('Upload Failed', msg);
    } finally {
      isUploading.value = false;
    }
  }

  Future<void> addSkill(String skillName, int stars) async {
    final newSkill = {'name': skillName, 'stars': stars};
    final updatedSkills = List<Map<String, dynamic>>.from(skills)..add(newSkill);
    await _syncSkills(updatedSkills);
  }

  Future<void> deleteSkill(int index) async {
    final updatedSkills = List<Map<String, dynamic>>.from(skills)..removeAt(index);
    await _syncSkills(updatedSkills);
  }

  Future<void> _syncSkills(List<Map<String, dynamic>> newSkills) async {
    isSavingSkills.value = true;
    final data = await _repository.updateMySkills(newSkills);
    if (data != null && data['skills'] != null) {
      skills.value = List<Map<String, dynamic>>.from(data['skills']);
    } else {
      Get.snackbar('Error', 'Failed to update skills');
    }
    isSavingSkills.value = false;
  }

  Future<bool> updateProfileDetails(Map<String, dynamic> data) async {
    isUpdatingProfile.value = true;
    try {
      final updatedData = await _repository.updateProfileDetails(data);
      if (updatedData != null) {
        name.value = updatedData['name'] ?? name.value;
        phone.value = updatedData['phone_number'] ?? phone.value;
        address.value = updatedData['address'] ?? address.value;
        dateOfBirth.value = updatedData['dateOfBirth'] ?? dateOfBirth.value;
        
        Get.snackbar('Success', 'Profile updated successfully');
        return true;
      }
    } catch (e) {
      final msg = e.toString().replaceAll('Exception: ', '');
      Get.snackbar('Update Failed', msg);
    } finally {
      isUpdatingProfile.value = false;
    }
    return false;
  }
}
