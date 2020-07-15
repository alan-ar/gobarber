import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderAvailableHoursService from '@modules/appointments/services/ListProviderAvailableHoursService';

export default class ProvidersAvailableHoursController {
	public async index(request: Request, response: Response): Promise<Response> {
		const { year, month, day } = request.body;
		const provider_id = request.params.id;

		const listAvailableHours = container.resolve(
			ListProviderAvailableHoursService,
		);

		const availability = await listAvailableHours.execute({
			provider_id,
			year,
			month,
			day,
		});

		return response.json(availability);
	}
}
