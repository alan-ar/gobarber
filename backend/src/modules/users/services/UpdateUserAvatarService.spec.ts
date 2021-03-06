import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUserRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
	beforeEach(() => {
		fakeUserRepository = new FakeUsersRepository();
		fakeStorageProvider = new FakeStorageProvider();
		updateUserAvatar = new UpdateUserAvatarService(
			fakeUserRepository,
			fakeStorageProvider,
		);
	});

	it('should be able to update the user avatar', async () => {
		const user = await fakeUserRepository.create({
			name: 'John Doe',
			email: 'johndoe@gmail.com',
			password: '123456',
		});

		await updateUserAvatar.execute({
			user_id: user.id,
			avatarFilename: 'avatar.jpg',
		});

		expect(user.avatar).toBe('avatar.jpg');
	});

	it('should not be able to update a non-existent user avatar', async () => {
		await expect(
			updateUserAvatar.execute({
				user_id: 'non-existent',
				avatarFilename: 'avatar.jpg',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should be able to update the user avatar and delete the old one', async () => {
		const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

		const user = await fakeUserRepository.create({
			name: 'John Doe',
			email: 'johndoe@gmail.com',
			password: '123456',
		});

		await updateUserAvatar.execute({
			user_id: user.id,
			avatarFilename: 'avatar.jpg',
		});

		await updateUserAvatar.execute({
			user_id: user.id,
			avatarFilename: 'avatar_new.jpg',
		});

		expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
		expect(user.avatar).toBe('avatar_new.jpg');
	});
});
