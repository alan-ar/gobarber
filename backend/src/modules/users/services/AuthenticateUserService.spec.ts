import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
	beforeEach(() => {
		fakeUserRepository = new FakeUsersRepository();
		fakeHashProvider = new FakeHashProvider();
		authenticateUser = new AuthenticateUserService(
			fakeUserRepository,
			fakeHashProvider,
		);
	});

	it('should be able to authenticate a user', async () => {
		const user = await fakeUserRepository.create({
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
		await expect(
			authenticateUser.execute({
				email: 'johndoe@gmail.com',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to authenticate a user with an incorrect password', async () => {
		await fakeUserRepository.create({
			name: 'John Doe',
			email: 'johndoe@gmail.com',
			password: '123456',
		});

		await expect(
			authenticateUser.execute({
				email: 'johndoe@gmail.com',
				password: 'incorrect',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
