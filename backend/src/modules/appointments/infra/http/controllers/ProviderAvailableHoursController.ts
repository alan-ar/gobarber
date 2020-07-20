import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderAvailableHoursService from '@modules/appointments/services/ListProviderAvailableHoursService';

export default class ProvidersAvailableHoursController {
	public async index(request: Request, response: Response): Promise<Response> {
		const { year, month, day } = request.query;
		const { provider_id } = request.params;

		const listAvailableHours = container.resolve(
			ListProviderAvailableHoursService,
		);

		const availability = await listAvailableHours.execute({
			provider_id,
			year: Number(year),
			month: Number(month),
			day: Number(day),
		});

		return response.json(availability);
	}
}
