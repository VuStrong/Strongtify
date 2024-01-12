abstract interface class LocalStorage {
  Future<String?> getString(String key);
  Future<void> setString({required String key, String? value});

  Future<DateTime?> getDateTime(String key);
  Future<void> setDateTime({required String key, DateTime? value});

  Future<void> delete(String key);
  Future<void> deleteAll();
}
