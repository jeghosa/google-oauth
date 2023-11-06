const Uschma = require("../middleware/uerms")

declare global {
  namespace Express {
    interface User extends Uschma {}
  }
}