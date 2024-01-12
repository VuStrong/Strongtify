import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/blocs/app_bottom_navigation/app_bottom_navigation_state.dart';
import 'app_bottom_navigation_event.dart';

@injectable
class AppBottomNavigationBloc
    extends Bloc<AppBottomNavigationEvent, AppBottomNavigationState> {
  AppBottomNavigationBloc() : super(AppBottomNavigationState(currentIndex: 0)) {
    on<AppBottomNavigationTapped>(_onPageTapped);
  }

  Future<void> _onPageTapped(AppBottomNavigationTapped event,
      Emitter<AppBottomNavigationState> emit) async {
    emit(AppBottomNavigationState(currentIndex: event.index));
  }
}
