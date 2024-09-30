import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  createTable,
  checkRecordExists,
  insertRecord,
} from "../utils/sqlFunctions";
import { userSchema } from "../schemas/userSchema";

interface UserModel {
  userId: string;
  fullname: string;
  phone: string;
  email: string;
  password: string;
}

const generateAccessToken = async (userId: string): Promise<string> => {
  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );
};

export const register = async (req: Request, res: Response) => {
  const { email, password, confirmPassword, fullname, phone } = req.body;

  if (!email || !password || !confirmPassword) {
    res.status(400).json({
      message: "Email or Password fields cannot be empty.",
      status: 400,
    });
    return;
  }

  if (!fullname || !phone) {
    res.status(400).json({
      message: "Please fill all the required fields.",
      status: 400,
    });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({ message: "Passwords do not match", status: 400 });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);
  const user: UserModel = {
    userId: uuidv4(),
    fullname,
    phone,
    email,
    password: hashedpassword,
  };

  try {
    await createTable(userSchema);
    const existingUser = await checkRecordExists("users", "email", email);
    if (existingUser) {
      res.status(409).json({ message: "Email already exists", status: 409 });
    } else {
      await insertRecord("users", user);
      res.status(201).json({
        message: "User created successfully",
        status: 201,
        data: {
          userId: user.userId,
          fullname: user.fullname,
          phone: user.phone,
          email: user.email,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message, status: 500 });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      message: "Email or Password fields cannot be empty",
      status: 400,
    });
    return;
  }

  try {
    const existingUser = await checkRecordExists("users", "email", email);
    if (existingUser) {
      const passwordsMatch = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (passwordsMatch) {
        const accessToken = await generateAccessToken(existingUser.userId);
        if (accessToken) {
          res.status(200).json({
            message: "Login Successful",
            status: 200,
            accessToken,
            data: {
              userId: existingUser.userId,
              fullname: existingUser.fullname,
              phone: existingUser.phone,
              email: existingUser.email,
            },
          });
        } else {
          res.status(500).json({
            message: "Some error occured. Please try again!",
            status: 500,
          });
        }
      } else {
        res
          .status(401)
          .json({ message: "Email or Password does not match", status: 401 });
      }
    } else {
      res
        .status(401)
        .json({ message: "Email or Password does not match", status: 401 });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message, status: 500 });
  }
};
