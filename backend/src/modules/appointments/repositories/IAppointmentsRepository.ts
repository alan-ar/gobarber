import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindProviderMonthDaysDTO from '../dtos/IFindProviderMonthDaysDTO';
import IFindProviderDayHoursDTO from '../dtos/IFindProviderDayHoursDTO';

export default interface IAppointmentsRepository {
	create(date: ICreateAppointmentDTO): Promise<Appointment>;
	findByDate(date: Date): Promise<Appointment | undefined>;
	findProviderMonthDays(
		data: IFindProviderMonthDaysDTO,
	): Promise<Appointment[]>;
	findProviderDayHours(data: IFindProviderDayHoursDTO): Promise<Appointment[]>;
}
