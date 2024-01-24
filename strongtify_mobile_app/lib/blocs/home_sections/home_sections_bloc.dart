import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/blocs/home_sections/bloc.dart';
import 'package:strongtify_mobile_app/models/section.dart';
import 'package:strongtify_mobile_app/services/api/home_service.dart';

@lazySingleton
class HomeSectionsBloc extends Bloc<HomeSectionsEvent, HomeSectionsState> {
  HomeSectionsBloc(this._homeService) : super(HomeSectionsState(sections: [])) {
    on<GetHomeSectionsEvent>(_onGetSections);
  }

  final HomeService _homeService;

  Future<void> _onGetSections(GetHomeSectionsEvent event, Emitter<HomeSectionsState> emit) async {
    emit(state.copyWith(isLoading: true));

    List<Section> sections = await _homeService.getHomeSections();

    emit(state.copyWith(isLoading: false, sections: sections));
  }
}