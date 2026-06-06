import { Request, Response } from 'express';

export const IdentityController = {
  consultaDni: async (req: Request, res: Response) => {
    // Mock data
    res.json({
      nombres: "JUAN PABLO",
      apellidoPaterno: "PEREZ",
      apellidoMaterno: "GOMEZ"
    });
  },
  consultaRuc: async (req: Request, res: Response) => {
    // Mock data
    res.json({
      razonSocial: "RESTAURANTE EL SABOR SAC"
    });
  }
};
