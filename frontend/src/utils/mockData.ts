/**
 * Shape of the student-specific profile information that is exposed while the
 * application is operating in demo mode.
 */
export interface MockStudentInfo {
  avatarUri: string;
  studentName: string;
  studentId: string;
}

/**
 * Describes the mock user entity leveraged in demo mode to simulate connected
 * wallet state and associated profile details.
 */
export interface MockUserData {
  address: string;
  hasNFT: boolean;
  balance: string;
  studentInfo: MockStudentInfo;
}

/**
 * Public URL for an avatar image that can be substituted when the demo user is
 * displayed with default imagery.
 */
export type AvatarUri = string;

/**
 * Single source of truth for user metadata displayed when the dApp is in demo
 * mode instead of a connected StarkNet wallet.
 */
export const MOCK_USER_DATA: MockUserData = {
  address: '0x1234...5678',
  hasNFT: false,
  balance: '0',
  studentInfo: {
    avatarUri: '',
    studentName: '',
    studentId: '',
  },
};

/**
 * Curated list of avatar options that can accompany the mock user profile when
 * rendering demo experiences.
 */
export const DEMO_AVATARS: ReadonlyArray<AvatarUri> = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasmine',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucy',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
];
