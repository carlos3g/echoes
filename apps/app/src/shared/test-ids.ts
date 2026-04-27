/**
 * Centralized test IDs for Maestro E2E testing.
 * Use these constants instead of hardcoded strings to ensure consistency.
 */

export const TestIds = {
  // Navigation
  tabs: {
    feed: 'feed-tab-button',
    manageTags: 'manage-tags-tab-button',
    settings: 'settings-tab-button',
  },

  // Screen components
  screen: {
    backButton: 'screen-back-button',
  },

  // Auth - Sign In
  signIn: {
    emailInput: 'signin-email-input',
    passwordInput: 'signin-password-input',
    submitButton: 'signin-button',
    forgotPasswordButton: 'go-to-forgot-password-button',
    signUpButton: 'go-to-sign-up-button',
  },

  // Auth - Sign Up
  signUp: {
    nameInput: 'signup-name-input',
    usernameInput: 'signup-username-input',
    emailInput: 'signup-email-input',
    passwordInput: 'signup-password-input',
    passwordConfirmationInput: 'signup-password-confirmation-input',
    submitButton: 'signup-button',
  },

  // Auth - Forgot Password
  forgotPassword: {
    emailInput: 'forgot-password-email-input',
    submitButton: 'forgot-password-button',
  },

  // Auth - Reset Password
  resetPassword: {
    emailInput: 'reset-password-email-input',
    passwordInput: 'reset-password-password-input',
    passwordConfirmationInput: 'reset-password-confirmation-input',
    submitButton: 'reset-password-button',
  },

  // Settings
  settings: {
    editProfileButton: 'edit-profile-button',
    changePasswordButton: 'go-to-change-password-button',
    logoutButton: 'logout-button',
    userAvatar: 'user-avatar',
    userName: 'user-name',
    userUsername: 'user-username',
  },

  // Change Password
  changePassword: {
    currentPasswordInput: 'current-password-input',
    newPasswordInput: 'new-password-input',
    newPasswordConfirmationInput: 'new-password-confirmation-input',
    submitButton: 'change-password-button',
  },

  // Quotes
  quotes: {
    list: 'quotes-list',
    filterBadge: 'quotes-filter-badge',
    clearFilterButton: 'quotes-clear-filter-button',
  },

  // Quote Card
  quoteCard: {
    container: (uuid: string) => `quote-card-${uuid}`,
    body: (uuid: string) => `quote-body-${uuid}`,
    author: (uuid: string) => `quote-author-${uuid}`,
    favoriteButton: 'toggle-favorite-button',
    tagButton: 'toggle-tag-button',
    shareButton: 'share-button',
  },

  // Tags
  tags: {
    list: 'tags-list',
    fab: 'tags-fab',
    emptyState: 'tags-empty-state',
  },

  // Tag Card
  tagCard: {
    container: (uuid: string) => `tag-card-${uuid}`,
    title: (uuid: string) => `tag-title-${uuid}`,
    count: (uuid: string) => `tag-count-${uuid}`,
  },

  // Create Tag Bottom Sheet
  createTag: {
    titleInput: 'tag-title-input',
    submitButton: 'create-tag-button',
  },

  // Tag Quote Bottom Sheet
  tagQuote: {
    list: 'tag-quote-list',
    createButton: 'create-tag-button',
  },

  // Common UI components
  ui: {
    button: 'button',
    textInput: 'text-input',
    passwordInput: 'password-input',
    passwordToggle: 'password-toggle-visibility',
  },
} as const;
