import 'package:strongtify_mobile_app/models/section.dart';

class HomeSectionsState {
  final bool isLoading;
  final List<Section> sections;

  HomeSectionsState({
    this.isLoading = true,
    required this.sections,
  });

  HomeSectionsState copyWith({
    bool? isLoading,
    List<Section>? sections,
  }) {
    return HomeSectionsState(
      isLoading: isLoading ?? this.isLoading,
      sections: sections ?? this.sections
    );
  }
}
