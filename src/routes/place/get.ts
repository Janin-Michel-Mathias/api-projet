import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Place } from '../../database/entities/Place';
import { getPlaceValidation } from '../../handlers/validators/place-validation';
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message';
import { authSpectateur } from '../../middlewares/authSpectateur';
import { PlaceUsecase } from '../../domain/place-usecase';
import { In } from 'typeorm/find-options/operator/In';
import { Billet } from '../../database/entities/Billet';
import { Spectateur } from '../../database/entities/Spectateur';
import { authAdmin } from '../../middlewares/authAdmin';


export const getPlaces = (app: Express): void => {
/**
 * Retrieves all places.
 * 
 * @openapi
 * 
 * /places:
 *   get:
 *     tags:
 *       - Places
 *     summary: Retrieve all places
 *     description: Retrieves all places from the database.
 *     responses:
 *       '200':
 *         description: Successful operation. Returns an array of places.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Place'
 *       '500':
 *         description: Internal server error.
 * components:
 *   schemas:
 *     Place:
 *       type: object
 *       properties:
 *         idBillet:
 *           type: number
 *           description: The ID of the associated billet.
 *         idPlace:
 *           type: number
 *           description: The ID of the place.
 *         idSeance:
 *           type: number
 *           description: The ID of the associated seance.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object used to send the HTTP response.
 * @returns {Response} The HTTP response containing an array of places.
 */
    app.get('/places', authAdmin, async (req: Request, res: Response) => {
        const repo = AppDataSource.getRepository(Place);
        const places = await repo.find();
        res.status(200).send(places);
    });
};

export const getPlace = (app: Express): void => {
        /**
 * Retrieves a specific place by ID.
 * 
 * @openapi
 * 
 * /places/{id}:
 *   get:
 *     tags:
 *      - Places
 *     summary: Retrieve a specific place by ID
 *     description: Retrieves a specific place from the database based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the place to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the requested place.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Place'
 *       '400':
 *         description: Bad request. Invalid parameters provided.
 *       '404':
 *         description: Place not found. The specified place ID does not exist.
 *       '500':
 *         description: Internal server error.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object used to send the HTTP response.
 * @returns {Response} The HTTP response containing the requested place.
 */
    app.get('/places/:id', authAdmin, async (req: Request, res: Response) => {
        const validation = getPlaceValidation.validate({ ...req.params });

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const getPlaceRequest = validation.value;

        try {
            const placeUsecase = new PlaceUsecase(AppDataSource);
            const getPlace = await placeUsecase.getPlace(getPlaceRequest.id);
            if (getPlace === null) {
                res.status(404).send({ "error": `Place ${getPlaceRequest.id} not found` });
                return;
            }
            res.status(200).send(getPlace);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
};


export const getMyPlace = (app: Express) => {
    /**
 * Retrieves places booked by the authenticated spectator.
 * 
 * @openapi
 * 
 * /me/places/:
 *   get:
 *     tags:
 *      - Places
 *     summary: Retrieve places booked by the authenticated spectator
 *     description: Retrieves places that have been booked by the authenticated spectator.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the places booked by the authenticated spectator.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Place'
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '404':
 *         description: Spectator not found. The authenticated spectator could not be found.
 *       '500':
 *         description: Internal server error.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object used to send the HTTP response.
 * @returns {Response} The HTTP response containing the places booked by the authenticated spectator.
 */
    app.get('/me/places/', authSpectateur, async (req: Request, res: Response) => {

        const spectateur = (req as any).user;

        const spectateurRepo = AppDataSource.getRepository(Spectateur);
        const spectateurFound = await spectateurRepo.findOne({ where: { idSpectateur: spectateur.id } });
        if (!spectateurFound) return res.status(404).json({ error: 'Spectateur not found' });


        const repo = AppDataSource.getRepository(Place);
        const places = await AppDataSource.getRepository(Place).find()

        const billetIds = await AppDataSource.getRepository(Billet)
            .createQueryBuilder("billet")
            .select("billet.idBillet")
            .where("billet.idSpectateur = :idSpectateur", { idSpectateur: spectateurFound.idSpectateur })
            .getMany()
            .then(billets => billets.map(billet => billet.idBillet));

        const spectateurIds = await AppDataSource.getRepository(Billet)
            .createQueryBuilder("billet")
            .select("billet.idSpectateur")
            .where("billet.idBillet IN (:...billetIds)", { billetIds })
            .getMany()
            .then(billets => billets.map(billet => billet.idSpectateur));



        console.log("-----------DEBUG---------")
        console.log(billetIds);

        const filteredPlaces = places.filter(place => billetIds.includes(place.idBillet));

        res.status(200).send(filteredPlaces);
    });
}