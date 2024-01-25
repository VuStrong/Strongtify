import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shimmer/shimmer.dart';
import 'package:strongtify_mobile_app/blocs/rank/bloc.dart';
import 'package:strongtify_mobile_app/ui/widgets/appbar_account.dart';
import 'package:strongtify_mobile_app/ui/widgets/placeholders.dart';
import 'package:strongtify_mobile_app/ui/widgets/song/song_list.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';
import 'package:strongtify_mobile_app/utils/enums.dart';

class RankScreen extends StatefulWidget {
  const RankScreen({super.key});

  @override
  State<RankScreen> createState() => _RankScreenState();
}

class _RankScreenState extends State<RankScreen> {
  @override
  void initState() {
    BlocProvider.of<RankBloc>(context).add(GetRankEvent(time: RankTime.day));

    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Bảng xếp hạng',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: ColorConstants.background,
        leading: const AppbarAccount(),
      ),
      body: BlocBuilder<RankBloc, RankState>(
        builder: (context, RankState state) {
          if (state is LoadedRankState) {
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
                        GestureDetector(
                          onTap: () {
                            if (state.time != RankTime.day) {
                              context
                                  .read<RankBloc>()
                                  .add(GetRankEvent(time: RankTime.day));
                            }
                          },
                          child: Padding(
                            padding: const EdgeInsets.only(right: 5, left: 5),
                            child: Container(
                              padding: const EdgeInsets.only(
                                  top: 10, bottom: 10, right: 20, left: 20),
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(10),
                                color: state.time == RankTime.day
                                    ? ColorConstants.primary
                                    : Colors.grey.shade900,
                              ),
                              child: const Center(
                                child: Text(
                                  'Ngày',
                                  style: TextStyle(color: Colors.white),
                                ),
                              ),
                            ),
                          ),
                        ),
                        GestureDetector(
                          onTap: () {
                            if (state.time != RankTime.week) {
                              context
                                  .read<RankBloc>()
                                  .add(GetRankEvent(time: RankTime.week));
                            }
                          },
                          child: Padding(
                            padding: const EdgeInsets.only(right: 5, left: 5),
                            child: Container(
                              padding: const EdgeInsets.only(
                                  top: 10, bottom: 10, right: 20, left: 20),
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(10),
                                color: state.time == RankTime.week
                                    ? ColorConstants.primary
                                    : Colors.grey.shade900,
                              ),
                              child: const Center(
                                child: Text(
                                  'Tuần',
                                  style: TextStyle(color: Colors.white),
                                ),
                              ),
                            ),
                          ),
                        ),
                        GestureDetector(
                          onTap: () {
                            if (state.time != RankTime.month) {
                              context
                                  .read<RankBloc>()
                                  .add(GetRankEvent(time: RankTime.month));
                            }
                          },
                          child: Padding(
                            padding: const EdgeInsets.only(right: 5, left: 5),
                            child: Container(
                              padding: const EdgeInsets.only(
                                  top: 10, bottom: 10, right: 20, left: 20),
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(10),
                                color: state.time == RankTime.month
                                    ? ColorConstants.primary
                                    : Colors.grey.shade900,
                              ),
                              child: const Center(
                                child: Text(
                                  'Tháng',
                                  style: TextStyle(color: Colors.white),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 25),
                  Padding(
                    padding: const EdgeInsets.only(right: 5, left: 5),
                    child: SongList(
                      songs: state.songs,
                      showOrder: true,
                    ),
                  ),
                ],
              ),
            );
          }

          return _buildShimmer();
        },
      ),
    );
  }

  Widget _buildShimmer() {
    return Shimmer.fromColors(
      baseColor: Colors.black12,
      highlightColor: ColorConstants.primary,
      enabled: true,
      child: const SingleChildScrollView(
        physics: NeverScrollableScrollPhysics(),
        child: Column(
          children: [
            SizedBox(height: 40.0),
            SongItemPlaceholder(),
            SizedBox(height: 12.0),
            SongItemPlaceholder(),
            SizedBox(height: 12.0),
            SongItemPlaceholder(),
            SizedBox(height: 12.0),
            SongItemPlaceholder(),
            SizedBox(height: 12.0),
            SongItemPlaceholder(),
            SizedBox(height: 12.0),
            SongItemPlaceholder(),
            SizedBox(height: 12.0),
            SongItemPlaceholder(),
          ],
        ),
      ),
    );
  }
}
