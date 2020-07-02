import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
	beforeEach(() => {
		fakeUserRepository = new FakeUsersRepository();
		fakeHashProvider = new FakeHashProvider();
		updateProfile = new UpdateProfileService(
			fakeUserRepository,
			fakeHashProvider,
		);
	});

	it('should be able to update the user profile', async () => {
		const user = await fakeUserRepository.create({
			name: 'John Doe',
			email: 'johndoe@gmail.com',
			password: '123456',
		});

		const updatedUser = await updateProfile.execute({
			user_id: user.id,
			name: 'John Tre',
			email: 'johntre@gmail.com',
		});

		expect(updatedUser.name).toBe('John Tre');
		expect(updatedUser.email).toBe('johntre@gmail.com');
	});

	it('should not be able to update to another user email', async () => {
		await fakeUserRepository.create({
			name: 'John Doe',
			email: 'johndoe@gmail.com',
			password: '123456',
		});

		const user = await fakeUserRepository.create({
			name: 'Teste',
			email: 'teste@gmail.com',
			password: '123456',
		});

		await expect(
			updateProfile.execute({
				user_id: user.id,
				name: 'Teste',
				email: 'johndoe@gmail.com',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should be able to update the user password', async () => {
		const user = await fakeUserRepository.create({
			name: 'John Doe',
			email: 'johndoe@gmail.com',
			password: '123456',
		});

		const updatedUser = await updateProfile.execute({
			user_id: user.id,
			name: 'John Doe',
			email: 'johndoe@gmail.com',
			old_password: '123456',
			password: '123123',
		});

		expect(updatedUser.password).toBe('123123');
	});

	it('should not be able to update the user password without the old', async () => {
		const user = await fakeUserRepository.create({
			name: 'John Doe',
			email: 'johndoe@gmail.com',
			password: '123456',
		});

		await expect(
			updateProfile.execute({
				user_id: user.id,
				name: 'John Doe',
				email: 'johndoe@gmail.com',
				password: '123123',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to update the user password with the incorrect old password', async () => {
		const user = await fakeUserRepository.create({
			name: 'John Doe',
			email: 'johndoe@gmail.com',
			password: '123456',
		});

		await expect(
			updateProfile.execute({
				user_id: user.id,
				name: 'John Doe',
				email: 'johndoe@gmail.com',
				old_password: 'incorrect-old-password',
				password: '123123',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to update non-existing user', async () => {
		await expect(
			updateProfile.execute({
				user_id: 'non-existing-user-id',
				name: 'John Doe',
				email: 'johndoe@gmail.com',
				old_password: 'incorrect-old-password',
				password: '123123',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
