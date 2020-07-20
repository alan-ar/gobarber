import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindProviderMonthDaysDTO from '@modules/appointments/dtos/IFindProviderMonthDaysDTO';
import IFindProviderDayHoursDTO from '@modules/appointments/dtos/IFindProviderDayHoursDTO';
import Appointment from '../../infra/typeorm/entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
	private appointments: Appointment[] = [];

	public async findProviderDayHours({
		provider_id,
		day,
		month,
		year,
	}: IFindProviderDayHoursDTO): Promise<Appointment[]> {
		const appointments = this.appointments.filter(appointment => {
			return (
				appointment.provider_id === provider_id &&
				getDate(appointment.date) === day &&
				getMonth(appointment.date) + 1 === month &&
				getYear(appointment.date) === year
			);
		});

		return appointments;
	}

	public async findProviderMonthDays({
		provider_id,
		month,
		year,
	}: IFindProviderMonthDaysDTO): Promise<Appointment[]> {
		const appointments = this.appointments.filter(appointment => {
			return (
				appointment.provider_id === provider_id &&
				getMonth(appointment.date) + 1 === month &&
				getYear(appointment.date) === year
			);
		});

		return appointments;
	}

	public async findByDate(
		date: Date,
		provider_id: string,
	): Promise<Appointment | undefined> {
		const findApponitment = this.appointments.find(
			appointment =>
				isEqual(appointment.date, date) &&
				appointment.provider_id === provider_id,
		);

		return findApponitment;
	}

	public async create({
		user_id,
		provider_id,
		date,
	}: ICreateAppointmentDTO): Promise<Appointment> {
		const appointment = new Appointment();

		Object.assign(appointment, { id: uuid(), date, provider_id, user_id });

		this.appointments.push(appointment);

		return appointment;
	}
}

export default AppointmentsRepository;
