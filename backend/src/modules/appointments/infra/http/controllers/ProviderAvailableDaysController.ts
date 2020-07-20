import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderAvailableDaysService from '@modules/appointments/services/ListProviderAvailableDaysService';

export default class ProvidersAvailableDaysController {
	public async index(request: Request, response: Response): Promise<Response> {
		const { year, month } = request.query;
		const { provider_id } = request.params;

		const listAvailableDays = container.resolve(
			ListProviderAvailableDaysService,
		);

		const availability = await listAvailableDays.execute({
			provider_id,
			year: Number(year),
			month: Number(month),
		});

		return response.json(availability);
	}
}
