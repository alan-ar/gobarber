import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
	user_id: string;
	provider_id: string;
	date: Date;
}

@injectable()
class CreateAppointmentService {
	constructor(
		@inject('AppointmentsRepository')
		private appointmentsRepository: IAppointmentsRepository,

		@inject('NotificationRepository')
		private notificationsRepository: INotificationsRepository,

		@inject('CacheProvider')
		private cacheProvider: ICacheProvider,
	) {}

	public async execute({
		user_id,
		provider_id,
		date,
	}: IRequest): Promise<Appointment> {
		const appointmentDate = startOfHour(date);

		if (isBefore(appointmentDate, Date.now())) {
			throw new AppError('You cannot create an appointment in the past.');
		}

		if (user_id === provider_id) {
			throw new AppError('You cannot create an appointment with yourself.');
		}

		if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
			throw new AppError(
				'You can only create an appointment between 8am and 5pm.',
			);
		}

		const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
			appointmentDate,
		);

		if (findAppointmentInSameDate) {
			throw new AppError('This appointment is already booked.');
		}

		const appointment = await this.appointmentsRepository.create({
			user_id,
			provider_id,
			date: appointmentDate,
		});

		const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH'h'mm");

		await this.notificationsRepository.create({
			recipient_id: provider_id,
			content: `Novo agendamento para dia ${dateFormatted}`,
		});

		await this.cacheProvider.invalidate(
			`provider-appointments:${provider_id}:${format(
				appointmentDate,
				'yyyy-M-d',
			)}`,
		);

		return appointment;
	}
}

export default CreateAppointmentService;
