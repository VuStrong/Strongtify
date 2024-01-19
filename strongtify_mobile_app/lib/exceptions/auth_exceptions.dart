import 'base_exception.dart';

class WrongCredentialException extends BaseException {
  WrongCredentialException({super.message});
}

class UserIsLockedOutException extends BaseException {
  UserIsLockedOutException({super.message});
}

class EmailAlreadyExistsException extends BaseException {
  EmailAlreadyExistsException({super.message});
}

class EmailNotFoundException extends BaseException {
  EmailNotFoundException({super.message});
}