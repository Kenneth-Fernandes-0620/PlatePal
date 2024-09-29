/**
 * Function to validate the email entered by the user
 * @param email Email entered by the user
 * @returns If the email is valid or not
 */
export function validateEmail(email: string): boolean {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

/**
 * Function to validate the password entered by the user
 * @param password Password entered by the user. Password must be at least 8 characters long,
 * include at least one uppercase letter, one lowercase letter, one number, and one special character.
 * @returns If the password is valid or not
 */
export function validatePassword(password: string) {
  const passwordPattern =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordPattern.test(password);
}

/**
 * Function to validate if the password and repeat passwords match.
 * @param password The Password Entered by the user the first time
 * @param repeatPassword The password entered by the user again
 * @returns if the two passwords match or not
 */
export function validateRepeatPassword(
  password: string,
  repeatPassword: string,
) {
  return password === repeatPassword;
}
