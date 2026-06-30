// Augment Express namespace so multer types are available globally
import 'multer';

declare global {
  namespace Express {
    interface Request {
      user?: import('./index').AuthenticatedUser;
    }
  }
}
