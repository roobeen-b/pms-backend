import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { userSchema } from "../schemas/userSchema";
import bcrypt from "bcryptjs";
import {
  createTable,
  checkRecordExists,
  insertRecord,
} from "../utils/sqlFunctions";

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
    });
    return;
  }

  if (!fullname || !phone) {
    res.status(400).json({
      message: "Required fields cannot be empty.",
    });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({ message: "Passwords do not match" });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);
  const user = {
    userId: uuidv4(),
    fullname,
    phone,
    email,
    password: hashedpassword,
  };

  try {
    await createTable(userSchema);
    const userAlreadyExists = await checkRecordExists("users", "email", email);
    if (userAlreadyExists) {
      res.status(409).json({ message: "Email already exists" });
    } else {
      await insertRecord("users", user);
      res.status(201).json({ message: "User created successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res
      .status(400)
      .json({ message: "Email or Password fields cannot be empty" });
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
            accessToken,
            data: {
              userId: existingUser.userId,
              fullname: existingUser.fullname,
              phone: existingUser.phone,
              email: existingUser.email,
            },
          });
        } else {
          res
            .status(500)
            .json({ message: "Some error occured. Please try again!" });
        }
      } else {
        res.status(401).json({ message: "Email or Password does not match" });
      }
    } else {
      res.status(401).json({ message: "Email or Password does not match" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
