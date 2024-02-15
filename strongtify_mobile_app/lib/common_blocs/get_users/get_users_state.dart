import 'package:strongtify_mobile_app/models/api_responses/paged_response.dart';
import 'package:strongtify_mobile_app/models/user/user.dart';

enum LoadUsersStatus {
  loading,
  loadingMore,
  loaded,
}

class GetUsersState {
  final List<User>? users;
  final LoadUsersStatus status;
  final int skip;
  final int take;
  final bool end;
  final Future<PagedResponse<User>> Function(int skip)? loadBySkip;

  GetUsersState({
    this.users,
    this.status = LoadUsersStatus.loaded,
    this.skip = 0,
    this.take = 10,
    this.end = false,
    this.loadBySkip,
  });

  GetUsersState copyWith({
    LoadUsersStatus? status,
    List<User>? Function()? users,
    int? skip,
    int? take,
    bool? end,
  }) {
    return GetUsersState(
      status: status ?? this.status,
      users: users != null ? users() : this.users,
      skip: skip ?? this.skip,
      take: take ?? this.take,
      end: end ?? this.end,
      loadBySkip: loadBySkip,
    );
  }
}