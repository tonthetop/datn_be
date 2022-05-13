import { catchAsync } from '../utils/catchAsync';
import { authService } from '../services';
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  res.send({ user });
});

export { login };
