// import 'package:socket_io_client/socket_io_client.dart' as io;
// import '../../const/api_url/api_url.dart';
// import '../../widgets/log_print/app_log.dart';
// import '../../widgets/log_print/error_log.dart';

// class AppSocketAllOperation {
//   io.Socket? appRootSocket;

//   AppSocketAllOperation() {
//     _connectSocketToServer();
//   }

//   bool _isSocketConnected() => appRootSocket != null && appRootSocket?.connected == true;

//   void readEvent({
//     required String event,
//     required void Function(dynamic) handler,
//   }) {
//     try {
//       if (_isSocketConnected()) {
//         appRootSocket?.on(event, handler);
//       }
//     } catch (e) {
//       errorLog("readEvent ($event)", e);
//     }
//   }

//   void emitEvent(String event, dynamic data) {
//     try {
//       if (_isSocketConnected()) {
//         appRootSocket?.emit(event, data);
//       }
//     } catch (e) {
//       errorLog("emitEvent ($event)", e);
//     }
//   }

//   void onEvent(String event, dynamic data) {
//     try {
//       if (_isSocketConnected()) {
//         appRootSocket?.on(event, data);
//       }
//     } catch (e) {
//       errorLog("On Event ($event)", e);
//     }
//   }

//   void _connectSocketToServer() {
//     try {
//       if (_isSocketConnected()) return;

//       appRootSocket = io.io(
//         AppApiUrl.soketUrl,
//         io.OptionBuilder()
//             .setTransports([
//               'websocket'
//             ])
//             .disableAutoConnect()
//             .setExtraHeaders({
//               'Authorization': 'Bearer token'
//             }) // Example header
//             .build(),
//       );

//       appRootSocket?.connect();

//       // Event listeners
//       appRootSocket?.onConnect((_) => appLog("Socket connected"));
//       appRootSocket?.onDisconnect((data) => errorLog("Socket disconnected", data));
//       appRootSocket?.onConnectError((data) => errorLog("Connect error", data));
//       appRootSocket?.onError((data) => errorLog("Error", data));
//       appRootSocket?.onReconnect((_) => appLog("Socket reconnected"));
//     } catch (e) {
//       errorLog("_connectSocketToServer", e);
//     }
//   }

//   void dispose() {
//     if (appRootSocket != null) {
//       appRootSocket?.dispose();
//       appRootSocket = null;
//     }
//   }
// }
