import { Request, Response, Router } from 'express';
import passport from './passportConfig';
import { IUser } from '../user/userModel';

const router = Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

router.get(
  '/google/callback',
  passport.authenticate('google'),
  setUserIDResponseCookie,
  (req: Request, res: Response, next) => {
    // if success
    if (req.user) {
      res.redirect(`${process.env.REACT_APP_URL}/login-success`);
    } else {
      res.redirect(`${process.env.REACT_APP_URL}/login-failed`);
    }
    next();
  },
);

router.delete('/cookie', (req: Request, res: Response) => {
  res.clearCookie('myapp-userid');
  res.sendStatus(200);
});

function setUserIDResponseCookie(req: Request, res: Response, next: Function) {
  // if user-id cookie is out of date, update it
  const user = req.user as IUser;
  if (user.id != req.cookies['myapp-userid']) {
    // if user successfully signed in, store user-id in cookie
    if (req.user) {
      res.cookie('myapp-userid', user.id, {
        // expire in year 9999 (from: https://stackoverflow.com/a/28289961)
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // expires 3 days from now
      });
    } else {
      res.clearCookie('myapp-userid');
    }
  }
  next();
}

// router.get(
//   '/facebook',
//   passport.authenticate('facebook', { scope: ['email'] }),
// );
// router.get(
//   '/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/' }),
//   (req: Request, res: Response) => {
//     res.redirect('/');
//   },
// );

// router.get('/apple', passport.authenticate('apple'));
// router.post(
//   '/apple/callback',
//   passport.authenticate('apple', { failureRedirect: '/' }),
//   (req: Request, res: Response) => {
//     res.redirect('/');
//   },
// );

export default router;
