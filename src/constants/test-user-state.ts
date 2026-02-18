import { UserState } from '../services/user/UserSlice';

export const userTestInitialState: UserState = {
  user: null,
  isAuthChecked: false,
  loading: false,
  error: null
};
