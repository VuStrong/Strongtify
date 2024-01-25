import 'package:strongtify_mobile_app/utils/enums.dart';

abstract class RankEvent {}

class GetRankEvent extends RankEvent {
  GetRankEvent({required this.time});

  final RankTime time;
}