import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
	it('should be able to create a new user', async () => {
		const fakeUserRepository = new FakeUsersRepository();
		const fakeHashProvider = new FakeHashProvider();
		const createUser = new CreateUserService(
			fakeUserRepository,
			fakeHashProvider,
		);

		const User = await createUser.execute({
			name: 'John Doe',
			email: 'johndoe@gmail.com',
			password: '123456',
		});

		expect(User).toHaveProperty('id');
	});

	it('should not be able to create a new user with the same email', async () => {
		const fakeUserRepository = new FakeUsersRepository();
		const fakeHashProvider = new FakeHashProvider();
		const createUser = new CreateUserService(
			fakeUserRepository,
			fakeHashProvider,
		);

		await createUser.execute({
			name: 'John Doe',
			email: 'johndoe@gmail.com',
			password: '123456',
		});

		expect(
			createUser.execute({
				name: 'John Doe',
				email: 'johndoe@gmail.com',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
