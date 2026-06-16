import 'package:amraoui_app/screens/account/account_screen.dart';
import 'package:amraoui_app/screens/home/home_screen.dart';
import 'package:amraoui_app/screens/missions/missions_screen.dart';
import 'package:amraoui_app/screens/navigation/controllers/navigation_controller.dart';
import 'package:amraoui_app/screens/quotes/quotes_screen.dart';
import 'package:amraoui_app/utils/app_size.dart';
import 'package:amraoui_app/utils/auth_navigation.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class NavigationScreen extends StatefulWidget {
  const NavigationScreen({super.key});

  @override
  State<NavigationScreen> createState() => _NavigationScreenState();
}

class _NavigationScreenState extends State<NavigationScreen> {
  @override
  void initState() {
    super.initState();
    // Routing is handled by splash screen — no redirect here
  }

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(NavigationController());
    AppSize.size = MediaQuery.of(context).size;

    final List<Widget> screens = [
      const HomeScreen(),
      const MissionsScreen(),
      const QuotesScreen(),
      const AccountScreen(),
    ];

    return SafeArea(
      top: false,
      child: Scaffold(
        backgroundColor: const Color(0xFFF8FAFC),
        body: Obx(() => screens[controller.currentIndex.value]),
        bottomNavigationBar: Container(
          height: AppSize.height(value: 80),
          margin: EdgeInsets.all(AppSize.width(value: 20)),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(30),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 20,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildNavItem(
                index: 0,
                icon: Icons.home_outlined,
                activeIcon: Icons.home,
                label: 'Home',
                controller: controller,
              ),
              _buildNavItem(
                index: 1,
                icon: Icons.list_alt_outlined,
                activeIcon: Icons.list_alt,
                label: 'Missions',
                controller: controller,
              ),
              _buildNavItem(
                index: 2,
                icon: Icons.description_outlined,
                activeIcon: Icons.description,
                label: 'Quotes',
                controller: controller,
              ),
              _buildNavItem(
                index: 3,
                icon: Icons.person_outline,
                activeIcon: Icons.person,
                label: 'Account',
                controller: controller,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem({
    required int index,
    required IconData icon,
    required IconData activeIcon,
    required String label,
    required NavigationController controller,
  }) {
    return Expanded(
      child: Obx(() {
        final isActive = controller.currentIndex.value == index;
        return GestureDetector(
          onTap: () => controller.changeIndex(index),
          behavior: HitTestBehavior.opaque,
          child: Container(
            height: double.infinity,
            color: Colors.transparent,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  isActive ? activeIcon : icon,
                  color: isActive
                      ? const Color(0xFF2563EB)
                      : const Color(0xFF94A3B8),
                  size: 24,
                ),
                const SizedBox(height: 4),
                AppText(
                  data: label,
                  fontSize: 12,
                  fontWeight: isActive ? FontWeight.w700 : FontWeight.w500,
                  color: isActive
                      ? const Color(0xFF2563EB)
                      : const Color(0xFF94A3B8),
                ),
              ],
            ),
          ),
        );
      }),
    );
  }
}

