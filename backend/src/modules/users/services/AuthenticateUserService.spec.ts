import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
	it('should be able to authenticate a user', async () => {
		const fakeUserRepository = new FakeUsersRepository();
		const fakeHashProvider = new FakeHashProvider();
		const createUser = new CreateUserService(
			fakeUserRepository,
			fakeHashProvider,
		);
		const authenticateUser = new AuthenticateUserService(
			fakeUserRepository,
			fakeHashProvider,
		);

		const user = await createUser.execute({
			name: 'John Doe',
			email: 'johndoe@gmail.com',
			password: '123456',
		});

		const response = await authenticateUser.execute({
			email: 'johndoe@gmail.com',
			password: '123456',
		});

		expect(response).toHaveProperty('token');
		expect(response.user).toEqual(user);
	});

	it('should not be able to authenticate a non-existent user', async () => {
		const fakeUserRepository = new FakeUsersRepository();
		const fakeHashProvider = new FakeHashProvider();
		const authenticateUser = new AuthenticateUserService(
			fakeUserRepository,
			fakeHashProvider,
		);

		expect(
			authenticateUser.execute({
				email: 'johndoe@gmail.com',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to authenticate a user with an incorrect password', async () => {
		const fakeUserRepository = new FakeUsersRepository();
		const fakeHashProvider = new FakeHashProvider();
		const createUser = new CreateUserService(
			fakeUserRepository,
			fakeHashProvider,
		);
		const authenticateUser = new AuthenticateUserService(
			fakeUserRepository,
			fakeHashProvider,
		);

		await createUser.execute({
			name: 'John Doe',
			email: 'johndoe@gmail.com',
			password: '123456',
		});

		expect(
			authenticateUser.execute({
				email: 'johndoe@gmail.com',
				password: 'incorrect',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
