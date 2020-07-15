import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

export default class ProvidersAppointmentsController {
	public async index(request: Request, response: Response): Promise<Response> {
		const { year, month, day } = request.body;
		const provider_id = request.params.id;

		const listProviderAppointments = container.resolve(
			ListProviderAppointmentsService,
		);

		const appointments = await listProviderAppointments.execute({
			provider_id,
			year,
			month,
			day,
		});

		return response.json(appointments);
	}
}
