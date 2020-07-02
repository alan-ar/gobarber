import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
	beforeEach(() => {
		fakeAppointmentRepository = new FakeAppointmentsRepository();
		createAppointment = new CreateAppointmentService(fakeAppointmentRepository);
	});

	it('should be able to create a new appointment', async () => {
		const appointment = await createAppointment.execute({
			date: new Date(),
			provider_id: '1',
		});

		expect(appointment).toHaveProperty('id');
		expect(appointment.provider_id).toBe('1');
	});

	it('should not be able to create a new appointment with the same date and time', async () => {
		const date = new Date();

		await createAppointment.execute({
			date,
			provider_id: '1',
		});

		await expect(
			createAppointment.execute({
				date,
				provider_id: '1',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
