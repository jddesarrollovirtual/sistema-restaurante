import { Request, Response } from 'express';
import User from '../models/User';

export const getWaiters = async (req: Request, res: Response) => {
  try {
    const waiters = await User.find({ role: 'mesero' }, 'username _id');
    res.json(waiters);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch waiters' });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, 'username _id role');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};
