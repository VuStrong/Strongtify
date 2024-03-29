import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:strongtify_mobile_app/ui/screens/rank/bloc/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/ui/widgets/app_drawer.dart';
import 'package:strongtify_mobile_app/ui/widgets/appbar_account.dart';
import 'package:strongtify_mobile_app/ui/widgets/clickable_item.dart';
import 'package:strongtify_mobile_app/ui/widgets/song/song_rank_list.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';
import 'package:strongtify_mobile_app/utils/enums.dart';

class RankScreen extends StatefulWidget {
  const RankScreen({super.key});

  @override
  State<RankScreen> createState() => _RankScreenState();
}

class _RankScreenState extends State<RankScreen> {
  @override
  Widget build(BuildContext context) {
    return BlocProvider<RankBloc>(
      create: (context) =>
          getIt<RankBloc>()..add(GetRankEvent(time: RankTime.day)),
      child: Scaffold(
        appBar: AppBar(
          title: const Text(
            'Bảng xếp hạng',
            style: TextStyle(color: Colors.white),
          ),
          backgroundColor: ColorConstants.background,
          leading: const AppbarAccount(),
        ),
        drawer: const AppDrawer(),
        body: BlocBuilder<RankBloc, RankState>(
          builder: (context, RankState state) {
            return SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 25),
                  SizedBox(
                    height: 50,
                    child: ListView(
                      scrollDirection: Axis.horizontal,
                      shrinkWrap: true,
                      children: [
                        ClickableItem(
                          title: 'Ngày',
                          isActive: state.time == RankTime.day,
                          onClick: () {
                            if (state.time != RankTime.day &&
                                state.status != RankStatus.loading) {
                              context
                                  .read<RankBloc>()
                                  .add(GetRankEvent(time: RankTime.day));
                            }
                          },
                        ),
                        ClickableItem(
                          title: 'Tuần',
                          isActive: state.time == RankTime.week,
                          onClick: () {
                            if (state.time != RankTime.week &&
                                state.status != RankStatus.loading) {
                              context
                                  .read<RankBloc>()
                                  .add(GetRankEvent(time: RankTime.week));
                            }
                          },
                        ),
                        ClickableItem(
                          title: 'Tháng',
                          isActive: state.time == RankTime.month,
                          onClick: () {
                            if (state.time != RankTime.month &&
                                state.status != RankStatus.loading) {
                              context
                                  .read<RankBloc>()
                                  .add(GetRankEvent(time: RankTime.month));
                            }
                          },
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 25),
                  state.status == RankStatus.loading
                      ? const Center(
                          child: CircularProgressIndicator(
                            color: ColorConstants.primary,
                          ),
                        )
                      : Padding(
                          padding: const EdgeInsets.only(right: 5, left: 5),
                          child: SongRankList(
                            songs: state.songs,
                          ),
                        ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}
