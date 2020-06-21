import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
	it('should be able to create a new appointment', async () => {
		const fakeAppointmentRepository = new FakeAppointmentsRepository();
		const createAppointment = new CreateAppointmentService(
			fakeAppointmentRepository,
		);

		const appointment = await createAppointment.execute({
			date: new Date(),
			provider_id: '1',
		});

		expect(appointment).toHaveProperty('id');
		expect(appointment.provider_id).toBe('1');
	});

	it('should not be able to create a new appointment with the same date and time', async () => {
		const fakeAppointmentRepository = new FakeAppointmentsRepository();
		const createAppointment = new CreateAppointmentService(
			fakeAppointmentRepository,
		);

		const date = new Date();

		await createAppointment.execute({
			date,
			provider_id: '1',
		});

		expect(
			createAppointment.execute({
				date,
				provider_id: '1',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
