import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
	beforeEach(() => {
		fakeUserRepository = new FakeUsersRepository();
		fakeHashProvider = new FakeHashProvider();
		createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);
	});

	it('should be able to create a new user', async () => {
		const User = await createUser.execute({
			name: 'John Doe',
			email: 'johndoe@gmail.com',
			password: '123456',
		});

		expect(User).toHaveProperty('id');
	});

	it('should not be able to create a new user with the same email', async () => {
		await createUser.execute({
			name: 'John Doe',
			email: 'johndoe@gmail.com',
			password: '123456',
		});

		await expect(
			createUser.execute({
				name: 'John Doe',
				email: 'johndoe@gmail.com',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
