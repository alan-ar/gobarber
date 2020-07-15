import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderService from './ListProviderService';

let fakeUserRepository: FakeUsersRepository;
let listProviders: ListProviderService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProvider', () => {
	beforeEach(() => {
		fakeUserRepository = new FakeUsersRepository();
		fakeCacheProvider = new FakeCacheProvider();

		listProviders = new ListProviderService(
			fakeUserRepository,
			fakeCacheProvider,
		);
	});

	it('should be able to list the providers', async () => {
		const user1 = await fakeUserRepository.create({
			name: 'John Doe',
			email: 'johndoe@gmail.com',
			password: '123456',
		});

		const user2 = await fakeUserRepository.create({
			name: 'John Tre',
			email: 'johndoe@gmail.com',
			password: '123456',
		});

		const loggedUser = await fakeUserRepository.create({
			name: 'John Qua',
			email: 'johndoe@gmail.com',
			password: '123456',
		});

		const providers = await listProviders.execute({
			user_id: loggedUser.id,
		});

		expect(providers).toEqual([user1, user2]);
	});
});
