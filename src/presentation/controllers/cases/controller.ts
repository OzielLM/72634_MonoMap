import { Request, Response } from "express";
import { CaseModel } from "../../../data/models/case.model";
import { EmailService } from "../../../domain/services/email.service";

export class CaseController{
    public getCases = async(req: Request, res: Response) => {
        try {
            const cases = await CaseModel.find();
            return res.json(cases);
        } catch (error) {
            return res.json([])
        }
    }

    public createCase = async(req: Request, res: Response) => {
        try {
            const { lat, lng, genre, age } = req.body;
            const newCase = await CaseModel.create({
                lat,
                lng,
                genre,
                age
            });
            const emailService = new EmailService();
            res.json(newCase);
        } catch (error) {
            res.json({message:"Error creando registro"});
        }
    }

    public getCasesFromLastWeek = async (req: Request, res: Response) => {
        try {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            const cases = await CaseModel.find({
                creationDate: { $gte: oneWeekAgo }
            });

            return res.json(cases);
        } catch (error) {
            return res.json({ message: 'Ocurrió un error al obtener los casos', error });
        }
    }

    public updateCase = async(req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { lat, lng, genre, age } = req.body;

            await CaseModel.findByIdAndUpdate(id, {
                lat,
                lng,
                genre,
                age
            });

            const updatedCase = await CaseModel.findById(id);

            return res.json(updatedCase)
        } catch (error) {
            return res.json({message:"Ocurrio un error al actualizar un casee"});
        }
    }

    public deleteCase = async(req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await CaseModel.findByIdAndDelete(id);
            return res.json({message:"Casee Eliminado"})
        } catch (error) {
            return res.json({message:"Ocurrio un error al eliminar un casee"});
        }
    }
}