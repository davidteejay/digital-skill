import express from 'express';

import CountriesController from '../controllers/Countries';

const router = express.Router();

router.get('/', CountriesController.getCountries);
router.get('/:country', CountriesController.getStates);
router.get('/:country/:state', CountriesController.getCommunities);

export default router;
