

class UserRepository {
  // // User Repo
  // // Make Product Like
  // // Future<dynamic> makeProductLike() async {
  // //   try {
  // //     var response = await ApiPostServices().apiPostServices(url: AppApiUrl.userMakeProductLikeUrl);

  // //     if (response["success"] != null) {
  // //       if (response["message"] == "Liked Successfully") {
  // //         return true;
  // //       } else if (response["message"] == "UnLiked Successfully") {
  // //         return false;
  // //       }
  // //     }
  // //   } catch (e) {
  // //     appLog("Error in Make Product Like : $e");
  // //   }

  // //   return null;
  // // }

  // // Get Closet Collection list
  // Future<List<ClosetCollectionModel>> getClosetCollectionList() async {
  //   List<ClosetCollectionModel> dataList = <ClosetCollectionModel>[];

  //   try {
  //     var response = await ApiGetServices().apiGetServices(AppApiUrl.userGetClosetCollectionUrl, statusCode: 201);

  //     if (response["data"].runtimeType != Null) {
  //       for (var element in response["data"]) {
  //         dataList.add(ClosetCollectionModel.fromJson(element));
  //       }
  //     }

  //     return dataList;
  //   } catch (e) {
  //     appLog("Error in get Closet Collection List: $e");
  //   }

  //   return dataList;
  // }

  // // Get Closet Collection Product list
  // Future<List<ClosetProductModel>> getClosetCollectionProductList({String? id}) async {
  //   List<ClosetProductModel> dataList = <ClosetProductModel>[];

  //   try {
  //     var response = await ApiGetServices().apiGetServices("${AppApiUrl.userGetClosetCollectionProductListUrl}$id", statusCode: 201);

  //     if (response["data"] != null) {
  //       final findData = response["data"];
  //       if (findData["closets"] != null && findData["closets"] is List) {
  //         for (var element in findData["closets"]) {
  //           dataList.add(ClosetProductModel.fromJson(element));
  //         }
  //       }
  //     }

  //     return dataList;
  //   } catch (e) {
  //     appLog("Error in get Closet Collection Product List: $e");
  //   }

  //   return dataList;
  // }

  // // Get User Search Product Api Call
  // Future<List<SellerSearchListModel>> getUserSearchProductList({
  //   String? searchTerm,
  //   String? category,
  //   double? maxPrice,
  //   double? minPrice,
  //   int page = 1,
  // }) async {
  //   appLog("Category : $category");
  //   Map<String, dynamic> param = {
  //     "page": page,
  //     "limit": 10,
  //   };

  //   /// add parameters
  //   if (searchTerm != null) {
  //     param["searchTerm"] = searchTerm;
  //   }
  //   if (category != "") {
  //     param["category"] = category;
  //   }
  //   if (minPrice != null) {
  //     param["minPrice"] = minPrice;
  //   }
  //   if (maxPrice != null) {
  //     param["maxPrice"] = maxPrice;
  //   }

  //   List<SellerSearchListModel> dataList = <SellerSearchListModel>[];

  //   try {
  //     var response = await NonAuthApi().sendRequest.get(AppApiUrl.userSearchProductUrl, queryParameters: param);

  //     // var response = await ApiGetServices().apiGetServices(AppApiUrl.userSearchProductUrl, queryParameters: param);

  //     if (response.data != null) {
  //       final findData = response.data["data"];
  //       if (findData["products"] != null && findData["products"] is List) {
  //         for (var element in findData["products"]) {
  //           dataList.add(SellerSearchListModel.fromJson(element));
  //         }
  //       }
  //     }
  //   } catch (e) {
  //     appLog("Error in get search Product List: $e");
  //   }

  //   return dataList;
  // }

  // // Get Cart list
  // Future<List<CartProductModel>> getCartList() async {
  //   List<CartProductModel> dataList = <CartProductModel>[];

  //   try {
  //     var response = await ApiGetServices().apiGetServices(AppApiUrl.userGetCartListUrl);

  //     if (response != null) {
  //       if (response["data"] != null && response["data"] is List) {
  //         for (var element in response["data"]) {
  //           dataList.add(CartProductModel.fromJson(element));
  //         }
  //       }
  //     }

  //     return dataList;
  //   } catch (e) {
  //     appLog("Error in get Cart List: $e");
  //   }

  //   return dataList;
  // }

  // // Get Order History list
  // Future<List<OrdeHistoryListModel>> getOrderHistoryList({int page = 1, int limit = 10}) async {
  //   List<OrdeHistoryListModel> dataList = <OrdeHistoryListModel>[];

  //   try {
  //     var response = await ApiGetServices().apiGetServices(
  //       "${AppApiUrl.userOrderHistoryListUrl}?page=$page&limit=$limit",
  //     );

  //     if (response != null && response["data"] is List) {
  //       for (var element in response["data"]) {
  //         dataList.add(OrdeHistoryListModel.fromJson(element));
  //       }
  //     } else {
  //       appLog("No data found");
  //     }
  //   } catch (e) {
  //     appLog("Error in get Order History List: $e");
  //   }

  //   return dataList;
  // }

  // // Get Bannar list
  // Future<List<ExchangeOrdeHistoryListModel>> getExchangeOrderHistoryList() async {
  //   List<ExchangeOrdeHistoryListModel> dataList = <ExchangeOrdeHistoryListModel>[];

  //   try {
  //     var response = await ApiGetServices().apiGetServices(
  //       AppApiUrl.userExchangeOrderListUrl,
  //     );

  //     if (response != null && response["data"] is List) {
  //       for (var element in response["data"]) {
  //         dataList.add(ExchangeOrdeHistoryListModel.fromJson(element));
  //       }
  //       appLog(response["data"]);
  //     } else {
  //       appLog("No data found");
  //     }
  //     return dataList;
  //   } catch (e) {
  //     appLog("Error in get Order History List: $e");
  //   }

  //   return dataList;
  // }

  // // Get Bannar list
  // Future<List<BannarModel>> getBannarList() async {
  //   List<BannarModel> dataList = <BannarModel>[];

  //   try {
  //     var response = await ApiGetServices().apiGetServices(
  //       AppApiUrl.userGetBannarListUrl,
  //     );

  //     if (response != null && response["data"] is List) {
  //       for (var element in response["data"]) {
  //         dataList.add(BannarModel.fromJson(element));
  //       }
  //     }
  //     return dataList;
  //   } catch (e) {
  //     appLog("Error in get Order History List: $e");
  //   }

  //   return dataList;
  // }

  // // Get HomePage Product list with Pagination
  // Future<List<UserProductModel>> getHomePageProductList({required int categoryIndex}) async {
  //   appLog("✅ Access Token ${AppStorage().getToken()}");
  //   List<UserProductModel> dataList = <UserProductModel>[];
  //   Map<String, dynamic> param = {};
  //   if (categoryIndex == 1) {
  //     param["gender"] = "Male";
  //   } else if (categoryIndex == 2) {
  //     param["gender"] = "Female";
  //   } else if (categoryIndex == 3) {
  //     param["gender"] = "Kids";
  //   }

  //   try {
  //     Map<String, dynamic> header = {
  //       "Authorization": AppStorage().getToken(),
  //     };
  //     var response = await NonAuthApi().sendRequest.get(
  //           AppApiUrl.userSearchProductUrl,
  //           options: Options(headers: header),
  //           queryParameters: param,
  //         );
  //     if (response.data != null) {
  //       final findData = response.data["data"];
  //       if (findData["products"] != null && findData["products"] is List) {
  //         for (var element in findData["products"]) {
  //           dataList.add(UserProductModel.fromJson(element));
  //         }
  //       }
  //     }

  //     return dataList;
  //   } catch (e) {
  //     appLog("Error in get Product List: $e");
  //   }

  //   return dataList;
  // }

  // // Get Category Product list with Pagination
  // Future<List<UserProductModel>> getCategoryProductList({required String categoryId}) async {
  //   appLog("✅ Access Token ${AppStorage().getToken()}");
  //   List<UserProductModel> dataList = <UserProductModel>[];
  //   Map<String, dynamic> param = {};
  //   if (categoryId != "") {
  //     param["category"] = categoryId;
  //   }

  //   try {
  //     Map<String, dynamic> header = {
  //       "Authorization": AppStorage().getToken(),
  //     };
  //     var response = await NonAuthApi().sendRequest.get(
  //           AppApiUrl.userSearchProductUrl,
  //           options: Options(headers: header),
  //           queryParameters: param,
  //         );
  //     if (response.data != null) {
  //       final findData = response.data["data"];
  //       if (findData["products"] != null && findData["products"] is List) {
  //         for (var element in findData["products"]) {
  //           dataList.add(UserProductModel.fromJson(element));
  //         }
  //       }
  //     }

  //     return dataList;
  //   } catch (e) {
  //     appLog("Error in get Product List: $e");
  //   }

  //   return dataList;
  // }

  // // Get Profile data
  // Future<OrderDetailsModel?> getOrderDetailsData(String id) async {
  //   try {
  //     // Api Call
  //     var response = await ApiGetServices().apiGetServices(
  //       "${AppApiUrl.userOrderHistoryDetailsUrl}$id",
  //     );
  //     if (response != null) {
  //       return OrderDetailsModel.fromJson(response["data"]);
  //     }
  //   } catch (e) {
  //     appLog('Get Order Details Data : $e');
  //   }
  //   return null;
  // }

  // // Get Product Details data
  // Future<UserProductDetailsModel?> getProductDetailsData({required String id}) async {
  //   try {
  //     // Api Call
  //     var response = await NonAuthApi().sendRequest.get(
  //           "${AppApiUrl.getSellerProductDetailsUrl}$id",
  //         );
  //     if (response.data != null) {
  //       return UserProductDetailsModel.fromJson(response.data["data"]);
  //     }
  //   } catch (e) {
  //     appLog('error comes form User Repository method: $e');
  //   }
  //   return null;
  // }
}
