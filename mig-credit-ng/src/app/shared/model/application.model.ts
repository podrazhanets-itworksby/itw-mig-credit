import { ChildrenEnum } from 'src/app/shared/model/children.enum';
import { DocTypeEnum } from 'src/app/shared/model/doc-type.enum';
import { EducationEnum } from 'src/app/shared/model/education.enum';
import { ExperienceEnum } from 'src/app/shared/model/experience.enum';
import { MaritalStatusEnum } from 'src/app/shared/model/marital-status.enum';
import { SexEnum } from 'src/app/shared/model/sex.enum';

export class Application {
	public firstname: string;
	public lastname: string;
	public patronymic: string;
	public sex: SexEnum;
	public birthday: Date;
	public document: DocTypeEnum;
	public persNumber: string;
	public docNumber: string;
	public validTo: Date;
	public education: EducationEnum;
	public address: string;
	public phone: string;
	public phone2: string;
	public maritalStatus: MaritalStatusEnum;
	public children: ChildrenEnum;
	public organization: string;
	public position: string;
	public experience: ExperienceEnum;
	public averageIncome: number;

	public constructor(app: any = {}) {
		this.firstname = app.firstname;
		this.lastname = app.lastname;
		this.patronymic = app.patronymic;
		this.sex = app.sex;
		this.birthday = app.birthday ? new Date(app.birthday) : app.birthday;
		this.document = app.document;
		this.persNumber = app.persNumber;
		this.docNumber = app.docNumber;
		this.validTo = app.validTo ? new Date(app.validTo) : app.validTo;
		this.education = app.education;
		this.address = app.address;
		this.phone = app.phone;
		this.phone2 = app.phone2;
		this.maritalStatus = app.maritalStatus;
		this.children = app.children;
		this.organization = app.organization;
		this.position = app.position;
		this.experience = app.experience;
		this.averageIncome = app.averageIncome;
	}
}
