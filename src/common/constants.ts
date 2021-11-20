export class Constants {
  // BCRYPT ROUNDS
  public static rounds = 10;

  //HTTP STATUS
  public static httpStatus200 = 200;
  public static httpStatus202 = 202;
  public static httpStatus400 = 400;
  public static httpStatus403 = 403;
  public static httpStatus404 = 404;

  //EXCEPTION MESSAGES
  public static userAlreadyExists = 'User already exists';
  public static userDoesNotExists = 'User does not exists';
  public static userWithThisEmail = 'Email is already used';
  public static userNotFound = 'User not found';
  public static userUpdated = 'User updated';
  public static userNotUpdated = 'User not updated';
  public static userDeleted = 'User deleted';
  public static bookAlreadyExists = 'Book already exists';
  public static bookToUpdateNotTheSame = 'Book to update is not the same';
  public static bookNotFound = 'Book not found';
  public static bookUpdated = 'Book updated';
  public static bookNotUpdated = 'Book not updated';
  public static bookDeleted = 'Book deleted';
  public static authorAlreadyExists = 'Author already exists';
  public static authorWithTheSameName = 'Already exists an author with the same name';
  public static authorNotFound = 'Author not found';
  public static authorUpdated = 'Author updated';
  public static authorNotUpdated = 'Author not updated';
  public static authorDeleted = 'Author deleted';
}
