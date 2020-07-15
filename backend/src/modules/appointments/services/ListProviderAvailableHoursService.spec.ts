import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';
import ListProviderAvailableHoursService from './ListProviderAvailableHoursService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let listProviderAvailableHours: ListProviderAvailableHoursService;

describe('ListProviderAvailableHours', () => {
	beforeEach(() => {
		fakeAppointmentRepository = new FakeAppointmentRepository();
		listProviderAvailableHours = new ListProviderAvailableHoursService(
			fakeAppointmentRepository,
		);
	});

	it('should be able to list the available hours from provider', async () => {
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

		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 20, 11).getTime();
		});

		const available = await listProviderAvailableHours.execute({
			provider_id: 'provider',
			year: 2020,
			month: 5,
			day: 20,
		});

		expect(available).toEqual(
			expect.arrayContaining([
				{ hour: 13, available: true },
				{ hour: 14, available: false },
				{ hour: 15, available: false },
				{ hour: 16, available: true },
			]),
		);
	});
});
