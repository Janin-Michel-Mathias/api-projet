import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Spectateur } from '../../database/entities/Spectateur';
import { updateSpectateurValidation } from '../../handlers/validators/spectateur-validation';
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message';
import { hash } from 'bcrypt';
import { authSpectateur } from '../../middlewares/authSpectateur';
import { authAdmin } from '../../middlewares/authAdmin';

export const updateSpectateur = (app: Express) => {
    /**
 * @openapi
 * /spectateurs/{id}:
 *   patch:
 *     tags:
 *       - Spectateurs
 *     summary: Mettre à jour les informations d'un spectateur
 *     description: Seuls les administrateurs sont autorisés à effectuer cette action.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du spectateur à mettre à jour
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Données du spectateur à mettre à jour
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SpectateurUpdate'
 *     responses:
 *       200:
 *         description: Informations mises à jour du spectateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Spectateur'
 *       400:
 *         description: Requête invalide. Veuillez vérifier les données envoyées.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur
 *       401:
 *         description: Non autorisé. Veuillez vous connecter en tant qu'administrateur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur
 *       404:
 *         description: Spectateur non trouvé
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
 */

    app.patch('/spectateurs/:id', authAdmin, async (req: Request, res: Response) => {
        applyUpdate(req, res, parseInt(req.params.id));
    });
}

export const updateSelfSpectateur = (app: Express) => {
    /**
 * @openapi
 * /spectateurs:
 *   patch:
 *     tags:
 *       - Spectateurs
 *     summary: Mettre à jour les informations du spectateur connecté
 *     description: Seuls les spectateurs authentifiés sont autorisés à effectuer cette action.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Données du spectateur à mettre à jour
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SpectateurUpdate'
 *     responses:
 *       200:
 *         description: Informations mises à jour du spectateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Spectateur'
 *       400:
 *         description: Requête invalide. Veuillez vérifier les données envoyées.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur
 *       401:
 *         description: Non autorisé. Veuillez vous connecter en tant que spectateur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur
 *       404:
 *         description: Spectateur non trouvé
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
 * components:
 *   schemas:
 *     SpectateurUpdate:
 *       type: object
 *       properties:
 *         nom:
 *           type: string
 *           description: Nouveau nom du spectateur
 *         prenom:
 *           type: string
 *           description: Nouveau prénom du spectateur
 *         sexe:
 *           type: string
 *           description: Nouveau sexe du spectateur
 *         date_naissance:
 *           type: string
 *           format: date
 *           description: Nouvelle date de naissance du spectateur au format AAAA-MM-JJ
 *         email:
 *           type: string
 *           format: email
 *           description: Nouvelle adresse e-mail du spectateur
 *         mdp:
 *           type: string
 *           description: Nouveau mot de passe du spectateur
 *       required:
 *         - nom
 *         - prenom
 *         - sexe
 *         - date_naissance
 *         - email
 *         - mdp
 */

    app.patch('/spectateurs',authSpectateur , async (req: Request, res: Response) => {
       const spectateur = (req as any).user;
       applyUpdate(req, res, spectateur.id)
    });
}

const applyUpdate = async (req: Request, res: Response, IDspectateur: number) => {
    const validation = updateSpectateurValidation.validate({...req.body, idSpectateur: IDspectateur});
    if (validation.error) {
        res.status(400).send(generateValidationErrorMessage(validation.error.details));
        return;
    }

    let spectateurRequest = validation.value;
    if(spectateurRequest.mdp) spectateurRequest = { ...spectateurRequest, mdp: await hash(spectateurRequest.mdp, 10) };
    const spectateurRepo = AppDataSource.getRepository(Spectateur);

    try {
        const spectateurUpdated = await spectateurRepo.update(IDspectateur, spectateurRequest);
        res.status(200).send(spectateurUpdated);
    } catch (error) {
        res.status(500).send({ error: 'Internal error' });
    }
}