abstract class AppBottomNavigationEvent {}

class AppBottomNavigationTapped extends AppBottomNavigationEvent {
  AppBottomNavigationTapped({required this.index});

  final int index;
}