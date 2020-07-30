import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

export default class ProvidersAppointmentsController {
	public async index(request: Request, response: Response): Promise<Response> {
		const { year, month, day } = request.query;
		const provider_id = request.user.id;

		const listProviderAppointments = container.resolve(
			ListProviderAppointmentsService,
		);

		const appointments = await listProviderAppointments.execute({
			provider_id,
			year: Number(year),
			month: Number(month),
			day: Number(day),
		});

		return response.json(appointments);
	}
}
