import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';
import ProviderAvailableDaysController from '../controllers/ProviderAvailableDaysController';
import ProviderAvailableHoursController from '../controllers/ProviderAvailableHoursController';

const providersRouter = Router();
const providersController = new ProvidersController();
const providerAvailableDaysController = new ProviderAvailableDaysController();
const providerAvailableHoursController = new ProviderAvailableHoursController();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.index);
providersRouter.get(
	'/:provider_id/month-availability',
	celebrate({
		[Segments.PARAMS]: {
			provider_id: Joi.string().uuid().required(),
		},
	}),
	providerAvailableDaysController.index,
);
providersRouter.get(
	'/:provider_id/day-availability',
	celebrate({
		[Segments.PARAMS]: {
			provider_id: Joi.string().uuid().required(),
		},
	}),
	providerAvailableHoursController.index,
);

export default providersRouter;
