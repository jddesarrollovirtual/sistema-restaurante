import { Request, Response } from 'express';
import * as reportService from '../services/reportService.js';
import DailyReport from '../models/DailyReport.js';

export const closeDay = async (req: Request, res: Response) => {
    try {
        const report = await reportService.generateDailyReport();
        res.status(201).json({ message: 'Cierre de caja exitoso', report });
    } catch (error: any) {
        console.error('Error en closeDay:', error);
        res.status(400).json({ error: error.message });
    }
};

export const getReports = async (req: Request, res: Response) => {
    try {
        const reports = await DailyReport.find().sort({ date: -1 });
        res.json(reports);
    } catch (error: any) {
        console.error('Error en getReports:', error);
        res.status(500).json({ error: 'Error al obtener reportes', details: error.message });
    }
};
