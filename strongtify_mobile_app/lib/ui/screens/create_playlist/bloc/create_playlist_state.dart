enum CreatePlaylistStatus {
  pending,
  processing,
  success,
  error,
}

class CreatePlaylistState {
  final CreatePlaylistStatus status;
  final String? errorMessage;

  CreatePlaylistState({
    this.status = CreatePlaylistStatus.pending,
    this.errorMessage,
  });
}
