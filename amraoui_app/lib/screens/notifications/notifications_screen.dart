import 'package:Vehiqqo/service/repository/notification_repository.dart';
import 'package:Vehiqqo/utils/app_size.dart';
import 'package:Vehiqqo/utils/gap.dart';
import 'package:Vehiqqo/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';

class NotificationsController extends GetxController {
  final NotificationRepository _repo = NotificationRepository();

  var isLoading = true.obs;
  var notifications = [].obs;

  @override
  void onInit() {
    super.onInit();
    fetchNotifications();
  }

  Future<void> fetchNotifications() async {
    isLoading(true);
    try {
      final res = await _repo.getNotifications();
      if (res.data != null && res.data['success'] == true) {
        notifications.value = res.data['data'] ?? [];
      }
    } catch (e) {
      print('Failed to fetch notifications: $e');
    } finally {
      isLoading(false);
    }
  }

  Future<void> markAsRead(String id) async {
    try {
      await _repo.markAsRead(id);
      final index = notifications.indexWhere((n) => n['_id'] == id);
      if (index != -1) {
        final notif = Map<String, dynamic>.from(notifications[index]);
        notif['isRead'] = true;
        notifications[index] = notif;
      }
    } catch (e) {
      print('Failed to mark as read: $e');
    }
  }

  Future<void> markAllAsRead() async {
    try {
      await _repo.markAllAsRead();
      for (int i = 0; i < notifications.length; i++) {
        final notif = Map<String, dynamic>.from(notifications[i]);
        notif['isRead'] = true;
        notifications[i] = notif;
      }
    } catch (e) {
      print('Failed to mark all as read: $e');
    }
  }
}

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(NotificationsController());

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: true,
        iconTheme: const IconThemeData(color: Color(0xFF0F172A)),
        title: const AppText(
          data: 'Notifications',
          fontSize: 18,
          fontWeight: FontWeight.w800,
          color: Color(0xFF0F172A),
        ),
        actions: [
          Obx(() {
            final unreadCount = controller.notifications
                .where((n) => !(n['isRead'] ?? false))
                .length;
            if (unreadCount == 0) return const SizedBox();
            return TextButton(
              onPressed: () => controller.markAllAsRead(),
              child: const AppText(
                data: 'Mark all read',
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: Color(0xFF2563EB),
              ),
            );
          }),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: controller.fetchNotifications,
          color: const Color(0xFF2563EB),
          child: Obx(() {
            if (controller.isLoading.value) {
              return const Center(child: CircularProgressIndicator());
            }

            if (controller.notifications.isEmpty) {
              return const Center(
                child: AppText(
                  data: 'No notifications yet.',
                  color: Color(0xFF94A3B8),
                  fontSize: 15,
                ),
              );
            }

            return ListView.separated(
              padding: EdgeInsets.symmetric(
                horizontal: AppSize.width(value: 20),
                vertical: 16,
              ),
              itemCount: controller.notifications.length,
              separatorBuilder: (context, index) => const Gap(height: 12),
              itemBuilder: (context, index) {
                final notif = controller.notifications[index];
                final isRead = notif['isRead'] ?? false;
                final title = notif['title'] ?? '';
                final message = notif['message'] ?? '';
                final createdAt = notif['createdAt'];

                String timeText = '';
                if (createdAt != null) {
                  try {
                    final date = DateTime.parse(createdAt).toLocal();
                    timeText = DateFormat('dd/MM/yyyy HH:mm').format(date);
                  } catch (_) {}
                }

                return GestureDetector(
                  onTap: () {
                    if (!isRead) {
                      controller.markAsRead(notif['_id']);
                    }
                    // Optionally handle link navigation here
                  },
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: isRead ? Colors.white : const Color(0xFFEFF6FF),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isRead
                            ? const Color(0xFFE2E8F0)
                            : const Color(0xFFBFDBFE),
                      ),
                      boxShadow: isRead
                          ? []
                          : [
                              BoxShadow(
                                color: const Color(
                                  0xFF2563EB,
                                ).withOpacity(0.05),
                                blurRadius: 10,
                                offset: const Offset(0, 4),
                              ),
                            ],
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: isRead
                                ? const Color(0xFFF1F5F9)
                                : const Color(0xFFDBEAFE),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            Icons.notifications_active_outlined,
                            size: 20,
                            color: isRead
                                ? const Color(0xFF64748B)
                                : const Color(0xFF2563EB),
                          ),
                        ),
                        const Gap(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Expanded(
                                    child: AppText(
                                      data: title,
                                      fontSize: 15,
                                      fontWeight: isRead
                                          ? FontWeight.w700
                                          : FontWeight.w800,
                                      color: isRead
                                          ? const Color(0xFF334155)
                                          : const Color(0xFF0F172A),
                                    ),
                                  ),
                                  if (!isRead)
                                    Container(
                                      width: 8,
                                      height: 8,
                                      decoration: const BoxDecoration(
                                        color: Color(0xFF2563EB),
                                        shape: BoxShape.circle,
                                      ),
                                    ),
                                ],
                              ),
                              const Gap(height: 6),
                              AppText(
                                data: message,
                                fontSize: 13,
                                color: isRead
                                    ? const Color(0xFF64748B)
                                    : const Color(0xFF334155),
                              ),
                              if (timeText.isNotEmpty) ...[
                                const Gap(height: 8),
                                AppText(
                                  data: timeText,
                                  fontSize: 11,
                                  color: const Color(0xFF94A3B8),
                                  fontWeight: FontWeight.w500,
                                ),
                              ],
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            );
          }),
        ),
      ),
    );
  }
}
