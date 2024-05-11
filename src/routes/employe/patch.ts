import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Employe } from '../../database/entities/Employe';
import { updateEmployeValidation } from '../../handlers/validators/employe-validators';
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message';
import { hash } from 'bcrypt';
import { authAdmin } from '../../middlewares/authAdmin';

export const updateEmploye = (app: Express) => {
/**
 * @openapi
 * /employes/{id}:
 *   patch:
 *     tags:
 *       - Employes
 *     summary: Mettre à jour un employé par son identifiant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant de l'employé à mettre à jour
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Employe'
 *     responses:
 *       200:
 *         description: Employé mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employe'
 *       400:
 *         description: Erreur de validation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur
 *
 * components:
 *   schemas:
 *     Employe:
 *       type: object
 *       properties:
 *         idEmploye:
 *           type: integer
 *           description: Identifiant de l'employé
 *         nom:
 *           type: string
 *           description: Nom de l'employé
 *           example: Dupont
 *         prenom:
 *           type: string
 *           description: Prénom de l'employé
 *           example: Jean
 *         email:
 *           type: string
 *           description: Adresse email de l'employé
 *           example: example@example.com
 *         mdp:
 *           type: string
 *           description: Mot de passe de l'employé
 *           example: password
 *         role:
 *           type: string
 *           description: Rôle de l'employé
 *           example: admin
 *         poste:
 *           type: string
 *           description: Poste de l'employé
 */


    app.patch('/employes/:id', authAdmin ,async (req: Request, res: Response) => {
        const validation = updateEmployeValidation.validate({...req.body, idEmploye: req.params.id});
        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        let employeRequest = validation.value;
        if(employeRequest.mdp) employeRequest = { ...employeRequest, mdp: await hash(employeRequest.mdp, 10) };
        const employeRepo = AppDataSource.getRepository(Employe);

        try {
            const employeUpdated = await employeRepo.update(req.params.id, employeRequest);
            res.status(200).send(employeUpdated);
        } catch (error) {
            res.status(500).send({ error: 'Internal error' });
        }
    });
}