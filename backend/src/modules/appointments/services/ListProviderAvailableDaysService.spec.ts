import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';
import ListProviderAvailableDaysService from './ListProviderAvailableDaysService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let listProviderAvailableDays: ListProviderAvailableDaysService;

describe('ListProviderAvailableDays', () => {
	beforeEach(() => {
		fakeAppointmentRepository = new FakeAppointmentRepository();
		listProviderAvailableDays = new ListProviderAvailableDaysService(
			fakeAppointmentRepository,
		);
	});

	it('should be able to list the available days from provider', async () => {
		await fakeAppointmentRepository.create({
			provider_id: 'provider',
			user_id: 'user',
			date: new Date(2020, 4, 20, 8, 0, 0),
		});

		await fakeAppointmentRepository.create({
			provider_id: 'provider',
			user_id: 'user',
			date: new Date(2020, 4, 20, 9, 0, 0),
		});

		await fakeAppointmentRepository.create({
			provider_id: 'provider',
			user_id: 'user',
			date: new Date(2020, 4, 20, 10, 0, 0),
		});

		await fakeAppointmentRepository.create({
			provider_id: 'provider',
			user_id: 'user',
			date: new Date(2020, 4, 20, 11, 0, 0),
		});

		await fakeAppointmentRepository.create({
			provider_id: 'provider',
			user_id: 'user',
			date: new Date(2020, 4, 20, 12, 0, 0),
		});

		await fakeAppointmentRepository.create({
			provider_id: 'provider',
			user_id: 'user',
			date: new Date(2020, 4, 20, 13, 0, 0),
		});

		await fakeAppointmentRepository.create({
			provider_id: 'provider',
			user_id: 'user',
			date: new Date(2020, 4, 20, 14, 0, 0),
		});

		await fakeAppointmentRepository.create({
			provider_id: 'provider',
			user_id: 'user',
			date: new Date(2020, 4, 20, 15, 0, 0),
		});

		await fakeAppointmentRepository.create({
			provider_id: 'provider',
			user_id: 'user',
			date: new Date(2020, 4, 20, 16, 0, 0),
		});

		await fakeAppointmentRepository.create({
			provider_id: 'provider',
			user_id: 'user',
			date: new Date(2020, 4, 20, 17, 0, 0),
		});

		await fakeAppointmentRepository.create({
			provider_id: 'provider',
			user_id: 'user',
			date: new Date(2020, 4, 21, 8, 0, 0),
		});

		const available = await listProviderAvailableDays.execute({
			provider_id: 'provider',
			year: 2020,
			month: 5,
		});

		expect(available).toEqual(
			expect.arrayContaining([
				{ day: 19, available: true },
				{ day: 20, available: false },
				{ day: 21, available: true },
			]),
		);
	});
});
