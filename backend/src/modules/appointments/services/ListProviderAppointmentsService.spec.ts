import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let listProviderAppointments: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointments', () => {
	beforeEach(() => {
		fakeAppointmentRepository = new FakeAppointmentRepository();
		fakeCacheProvider = new FakeCacheProvider();

		listProviderAppointments = new ListProviderAppointmentsService(
			fakeAppointmentRepository,
			fakeCacheProvider,
		);
	});

	it('should be able to list the appointments of day', async () => {
		const appointment1 = await fakeAppointmentRepository.create({
			provider_id: 'provider',
			user_id: 'user',
			date: new Date(2020, 4, 20, 8, 0, 0),
		});

		const appointment2 = await fakeAppointmentRepository.create({
			provider_id: 'provider',
			user_id: 'user',
			date: new Date(2020, 4, 20, 9, 0, 0),
		});

		const appointments = await listProviderAppointments.execute({
			provider_id: 'provider',
			year: 2020,
			month: 5,
			day: 20,
		});

		expect(appointments).toEqual([appointment1, appointment2]);
	});
});
