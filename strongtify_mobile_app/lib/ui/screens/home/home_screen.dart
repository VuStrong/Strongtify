import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:strongtify_mobile_app/ui/screens/home/bloc/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/models/album/album.dart';
import 'package:strongtify_mobile_app/models/artist/artist.dart';
import 'package:strongtify_mobile_app/models/playlist/playlist.dart';
import 'package:strongtify_mobile_app/models/section.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';
import 'package:strongtify_mobile_app/ui/widgets/album/album_grid.dart';
import 'package:strongtify_mobile_app/ui/widgets/app_drawer.dart';
import 'package:strongtify_mobile_app/ui/widgets/appbar_account.dart';
import 'package:strongtify_mobile_app/ui/widgets/artist/artist_grid.dart';
import 'package:strongtify_mobile_app/ui/widgets/playlist/playlist_grid.dart';
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
              return const Center(
                child: CircularProgressIndicator(
                  color: ColorConstants.primary,
                ),
              );
            } else {
              return _buildHomePage(state.sections);
            }
          },
        ),
      ),
    );
  }

  Widget _buildHomePage(List<Section> sections) {
    return Padding(
      padding: const EdgeInsets.only(right: 20, left: 20),
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

      sectionItemsWidget = AlbumGrid(albums: albums);
    } else if (section.type == 'playlists') {
      List<Playlist> playlists = section.items as List<Playlist>;

      sectionItemsWidget = PlaylistGrid(playlists: playlists);
    } else if (section.type == 'artists') {
      List<Artist> artists = section.items as List<Artist>;

      sectionItemsWidget = ArtistGrid(artists: artists);
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
