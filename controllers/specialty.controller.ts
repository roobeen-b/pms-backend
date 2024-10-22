import { Request, Response } from "express";
import SpecialtyService from "../services/specialty.service";

export const getAllSpecialties = async (req: Request, res: Response) => {
  try {
    const allSpecialties = await SpecialtyService.getAllSpecialties();
    res.status(200).json({
      message: "Successful",
      status: 200,
      data: allSpecialties,
    });
  } catch (error) {
    res.status(500).json({
      message: (error as Error).message,
      status: 500,
    });
  }
};
