/* eslint-disable no-undef */

// Test user credentials (existing user in database)
output.EMAIL = 'test@gmail.com';
output.PASSWORD = 'p@ss9ord1!';

// Invalid credentials for error testing
output.INVALID_EMAIL = 'invalid@email.com';
output.INVALID_PASSWORD = 'wrong123';

// Sign up test data (new user registration)
output.SIGNUP_NAME = 'Test User';
output.SIGNUP_USERNAME = 'testuser' + Date.now(); // Unique username
output.SIGNUP_EMAIL = 'test' + Date.now() + '@gmail.com'; // Unique email
output.SIGNUP_PASSWORD = 'p@ss9ord1!';
output.SIGNUP_PASSWORD_CONFIRMATION = 'p@ss9ord1!';

// Change password test data
output.CURRENT_PASSWORD = 'p@ss9ord1!';
output.NEW_PASSWORD = 'p@ss9ord1!1';

// Forgot password test data
output.FORGOT_PASSWORD_EMAIL = 'test@gmail.com';

// Tags test data
output.TAG_TITLE = 'Test Tag ' + Date.now();

// Folder test data
output.FOLDER_NAME = 'Test Folder ' + Date.now();
output.FOLDER_DESCRIPTION = 'Folder criada para testes automatizados';

// Edit profile test data
output.EDIT_NAME = 'Test User Edited';
output.EDIT_USERNAME = 'testedited' + Date.now();
output.EDIT_BIO = 'Bio de teste automatizado';
output.EDIT_EMAIL = 'edited' + Date.now() + '@gmail.com';

// Search test data
output.SEARCH_QUERY = 'amor';
output.USER_SEARCH_QUERY = 'test';
