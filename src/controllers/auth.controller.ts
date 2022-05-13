import { catchAsync } from '../utils/catchAsync';
import { authService } from '../services';
import jwt from 'jsonwebtoken';

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const jwtToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'tuandeptrai123'
  );
  return res.json({ info: user, token: jwtToken });
});

export { login };
