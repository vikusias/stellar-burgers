import { userReducer, initialState, setUser } from './UserSlice';
import {
  registerUserThunk,
  loginUserThunk,
  updateUserThunk,
  logoutUserThunk,
  checkUserAuth,
  setIsAuthChecked
} from './actions';
import { testUser, testLoginResponse } from '../../constants/test-user';

describe('userSlice', () => {
  it('должен возвращать initialState', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('setIsAuthChecked', () => {
    it('устанавливает isAuthChecked в true', () => {
      const state = userReducer(initialState, setIsAuthChecked(true));
      expect(state.isAuthChecked).toBe(true);
    });

    it('устанавливает isAuthChecked в false', () => {
      const state = userReducer(initialState, setIsAuthChecked(false));
      expect(state.isAuthChecked).toBe(false);
    });
  });

  describe('setUser', () => {
    it('устанавливает пользователя', () => {
      const state = userReducer(initialState, setUser(testUser));
      expect(state.user).toEqual(testUser);
    });

    it('устанавливает пользователя в null', () => {
      const prevState = { ...initialState, user: testUser };
      const state = userReducer(prevState, setUser(null));
      expect(state.user).toBeNull();
    });
  });

  describe('registerUserThunk', () => {
    it('pending', () => {
      const action = { type: registerUserThunk.pending.type };
      const state = userReducer(initialState, action);
      expect(state).toEqual({ ...initialState, loading: true, error: null });
    });

    it('fulfilled', () => {
      const action = {
        type: registerUserThunk.fulfilled.type,
        payload: testLoginResponse
      };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        user: testLoginResponse.user,
        isAuthChecked: true
      });
    });

    it('rejected', () => {
      const error = 'Ошибка регистрации';
      const action = { type: registerUserThunk.rejected.type, payload: error };
      const state = userReducer(initialState, action);
      expect(state).toEqual({ ...initialState, loading: false, error });
    });
  });

  describe('loginUserThunk', () => {
    it('pending', () => {
      const action = { type: loginUserThunk.pending.type };
      const state = userReducer(initialState, action);
      expect(state).toEqual({ ...initialState, loading: true, error: null });
    });

    it('fulfilled', () => {
      const action = {
        type: loginUserThunk.fulfilled.type,
        payload: testLoginResponse
      };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        user: testLoginResponse.user,
        isAuthChecked: true
      });
    });

    it('rejected', () => {
      const error = 'Ошибка входа';
      const action = { type: loginUserThunk.rejected.type, payload: error };
      const state = userReducer(initialState, action);
      expect(state).toEqual({ ...initialState, loading: false, error });
    });
  });

  describe('updateUserThunk', () => {
    it('pending', () => {
      const action = { type: updateUserThunk.pending.type };
      const state = userReducer(initialState, action);
      expect(state).toEqual({ ...initialState, loading: true, error: null });
    });

    it('fulfilled', () => {
      const action = {
        type: updateUserThunk.fulfilled.type,
        payload: testLoginResponse
      };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        user: testLoginResponse.user
      });
    });

    it('rejected', () => {
      const error = 'Ошибка обновления';
      const action = { type: updateUserThunk.rejected.type, payload: error };
      const state = userReducer(initialState, action);
      expect(state).toEqual({ ...initialState, loading: false, error });
    });
  });

  describe('logoutUserThunk', () => {
    it('pending', () => {
      const action = { type: logoutUserThunk.pending.type };
      const state = userReducer(initialState, action);
      expect(state).toEqual({ ...initialState, loading: true, error: null });
    });

    it('fulfilled', () => {
      const prevState = { ...initialState, user: testUser };
      const action = { type: logoutUserThunk.fulfilled.type };
      const state = userReducer(prevState, action);
      expect(state).toEqual({ ...initialState, loading: false, user: null });
    });

    it('rejected', () => {
      const error = 'Ошибка выхода';
      const action = { type: logoutUserThunk.rejected.type, payload: error };
      const state = userReducer(initialState, action);
      expect(state).toEqual({ ...initialState, loading: false, error });
    });
  });

  describe('checkUserAuth', () => {
    it('pending', () => {
      const action = { type: checkUserAuth.pending.type };
      const state = userReducer(initialState, action);
      expect(state).toEqual({ ...initialState, loading: true, error: null });
    });

    it('fulfilled', () => {
      const action = {
        type: checkUserAuth.fulfilled.type,
        payload: { user: testUser }
      };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        user: testUser,
        isAuthChecked: true
      });
    });

    it('rejected', () => {
      const error = 'Ошибка проверки';
      const action = { type: checkUserAuth.rejected.type, payload: error };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error,
        isAuthChecked: true,
        user: null
      });
    });
  });
});
