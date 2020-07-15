import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeNotificationRepository from '@modules/notifications/repositories/fakes/FakeNotificationRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;
let fakeNotificationRepository: FakeNotificationRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppointment', () => {
	beforeEach(() => {
		fakeAppointmentRepository = new FakeAppointmentsRepository();
		fakeNotificationRepository = new FakeNotificationRepository();
		fakeCacheProvider = new FakeCacheProvider();

		createAppointment = new CreateAppointmentService(
			fakeAppointmentRepository,
			fakeNotificationRepository,
			fakeCacheProvider,
		);
	});

	it('should be able to create a new appointment', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});

		const appointment = await createAppointment.execute({
			user_id: 'user',
			provider_id: 'provider',
			date: new Date(2020, 4, 10, 13),
		});

		expect(appointment).toHaveProperty('id');
		expect(appointment.provider_id).toBe('provider');
	});

	it('should not be able to create a new appointment with the same date and time', async () => {
		jest.spyOn(Date, 'now').mockImplementation(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});

		const appointmentDate = new Date(2020, 4, 11, 14);

		await createAppointment.execute({
			user_id: 'user',
			provider_id: 'provider',
			date: appointmentDate,
		});

		await expect(
			createAppointment.execute({
				user_id: 'user',
				provider_id: 'provider',
				date: appointmentDate,
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create a new appointment in the past', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});

		await expect(
			createAppointment.execute({
				user_id: 'user',
				provider_id: 'provider',
				date: new Date(2020, 4, 10, 11),
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create a new appointment with the same user as provider', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});

		await expect(
			createAppointment.execute({
				user_id: 'provider',
				provider_id: 'provider',
				date: new Date(2020, 4, 10, 13),
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create a new appointment outside 8am and 5pm', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});

		await expect(
			createAppointment.execute({
				user_id: 'user',
				provider_id: 'provider',
				date: new Date(2020, 4, 11, 7),
			}),
		).rejects.toBeInstanceOf(AppError);

		await expect(
			createAppointment.execute({
				user_id: 'user',
				provider_id: 'provider',
				date: new Date(2020, 4, 11, 18),
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
