import { sign } from 'jsonwebtoken';

interface IPayload {
  sub: string;
  name: string;
  email: string;
}

export function jwtGenerator(data: IPayload) {
  const token = sign({ ...data }, process.env.JWT_KEY as string, {
    expiresIn: '7 days',
  });

  return token;
}
