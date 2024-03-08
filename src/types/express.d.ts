declare namespace Express {
  interface Request {
    user: {
      userId: string,
      email: string;
      firstName: string;
      lastName?: string;
      picture: string;
    };
  }
}
