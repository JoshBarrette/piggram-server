import { AuthedGuard } from './authed.guard';

describe('AuthedGuard', () => {
  it('should be defined', () => {
    expect(new AuthedGuard()).toBeDefined();
  });
});
