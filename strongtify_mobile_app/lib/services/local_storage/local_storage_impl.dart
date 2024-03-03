import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:injectable/injectable.dart';
import 'local_storage.dart';

@Injectable(as: LocalStorage)
class LocalStorageImpl implements LocalStorage {
  late final FlutterSecureStorage _storage;

  LocalStorageImpl() {
    _storage = const FlutterSecureStorage();
  }

  @override
  Future<DateTime?> getDateTime(String key) async {
    String? dateTimeStr = await _storage.read(key: key);

    return dateTimeStr != null ? DateTime.parse(dateTimeStr) : null;
  }

  @override
  Future<String?> getString(String key) async {
    return await _storage.read(key: key);
  }

  @override
  Future<void> setDateTime({required String key, DateTime? value}) async {
    await _storage.write(key: key, value: value!.toIso8601String());
  }

  @override
  Future<void> setString({required String key, String? value}) async {
    await _storage.write(key: key, value: value);
  }

  @override
  Future<void> delete(String key) async {
    await _storage.delete(key: key);
  }

  @override
  Future<void> deleteAll() async {
    await _storage.deleteAll();
  }
}
