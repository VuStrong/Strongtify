import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shimmer/shimmer.dart';
import 'package:strongtify_mobile_app/blocs/home_sections/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/models/album/album.dart';
import 'package:strongtify_mobile_app/models/artist/artist.dart';
import 'package:strongtify_mobile_app/models/playlist/playlist.dart';
import 'package:strongtify_mobile_app/models/section.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';
import 'package:strongtify_mobile_app/ui/widgets/album/album_list.dart';
import 'package:strongtify_mobile_app/ui/widgets/app_drawer.dart';
import 'package:strongtify_mobile_app/ui/widgets/appbar_account.dart';
import 'package:strongtify_mobile_app/ui/widgets/artist/artist_list.dart';
import 'package:strongtify_mobile_app/ui/widgets/placeholders.dart';
import 'package:strongtify_mobile_app/ui/widgets/playlist/playlist_list.dart';
import 'package:strongtify_mobile_app/ui/widgets/song/song_list.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  Widget build(BuildContext context) {
    return BlocProvider<HomeSectionsBloc>(
      create: (context) => getIt<HomeSectionsBloc>()..add(GetHomeSectionsEvent()),
      child: Scaffold(
        appBar: AppBar(
          title: const Text(
            'Trang chủ',
            style: TextStyle(color: Colors.white),
          ),
          backgroundColor: ColorConstants.background,
          leading: const AppbarAccount(),
        ),
        drawer: const AppDrawer(),
        body: BlocBuilder<HomeSectionsBloc, HomeSectionsState>(
          builder: (context, HomeSectionsState state) {
            if (state.isLoading) {
              return _buildShimmer();
            } else {
              return _buildHomePage(state.sections);
            }
          },
        ),
      ),
    );
  }

  Widget _buildShimmer() {
    return Shimmer.fromColors(
      baseColor: Colors.black12,
      highlightColor: ColorConstants.primary,
      enabled: true,
      child: SingleChildScrollView(
        physics: const NeverScrollableScrollPhysics(),
        child: Column(
          children: [
            SizedBox(
              height: 670.0,
              child: GridView.builder(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  mainAxisExtent: 230,
                ),
                shrinkWrap: true,
                padding: EdgeInsets.zero,
                itemCount: 5,
                physics: const NeverScrollableScrollPhysics(),
                itemBuilder: (_, position) => const AlbumItemPlaceholder(),
              ),
            ),
            const SizedBox(height: 40.0),
            const SongItemPlaceholder(),
          ],
        ),
      ),
    );
  }

  Widget _buildHomePage(List<Section> sections) {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: ListView.builder(
        itemCount: sections.length,
        itemBuilder: (BuildContext context, int index) {
          return _buildSection(sections[index]);
        },
      ),
    );
  }

  Widget _buildSection(Section section) {
    Widget sectionItemsWidget = const Placeholder();

    if (section.type == 'songs') {
      List<Song> songs = section.items as List<Song>;

      sectionItemsWidget = SongList(songs: songs);
    } else if (section.type == 'albums') {
      List<Album> albums = section.items as List<Album>;

      sectionItemsWidget = AlbumList(albums: albums);
    } else if (section.type == 'playlists') {
      List<Playlist> playlists = section.items as List<Playlist>;

      sectionItemsWidget = PlaylistList(playlists: playlists);
    } else if (section.type == 'artists') {
      List<Artist> artists = section.items as List<Artist>;

      sectionItemsWidget = ArtistList(artists: artists);
    }

    return Padding(
      padding: const EdgeInsets.only(top: 20, bottom: 20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            section.title,
            textAlign: TextAlign.start,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w700,
              fontSize: 20,
            ),
          ),
          const SizedBox(height: 16),
          sectionItemsWidget,
        ],
      ),
    );
  }
}
