import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { ChildrenEnum } from 'src/app/shared/model/children.enum';
import { DocTypeEnum } from 'src/app/shared/model/doc-type.enum';
import { EducationEnum } from 'src/app/shared/model/education.enum';
import { ExperienceEnum } from 'src/app/shared/model/Experience.enum';
import { MaritalStatusEnum } from 'src/app/shared/model/marital-status.enum';
import { NewData } from 'src/app/shared/model/new-data.model';
import { SexEnum } from 'src/app/shared/model/sex.enum';
import { WebsocketService } from 'src/app/shared/services/websocket.service';
import { DateUtils } from 'src/app/shared/utils/date-utils';

@Component({
	selector: 'mig-application-form',
	templateUrl: './application-form.component.html',
	styleUrls: ['./application-form.component.scss'],
	providers: [ConfirmationService],
})
export class ApplicationFormComponent implements OnInit {
	@Input() public editMode: boolean;
	@Input() public sessionId: string;

	public form: FormGroup;
	public sex: SelectItem[];
	public docType: SelectItem[];
	public education: SelectItem[];
	public maritalStatus: SelectItem[];
	public children: SelectItem[];
	public experience: SelectItem[];
	public birthdayYearRange: string;
	public birthdayMaxDate: Date;
	public validToYearRange: string;
	public validToMinDate: Date;
	public locale: any;
	public datePlaceholder: string;

	constructor(
		private formBuilder: FormBuilder,
		private websocketService: WebsocketService,
		private confirmationService: ConfirmationService
	) {
		this.editMode = false;
		this.sex = [];
		this.docType = [];
		this.education = [];
		this.maritalStatus = [];
		this.children = [];
		this.experience = [];
		const currentDate = new Date();
		const currentYear = currentDate.getFullYear();
		this.birthdayYearRange = currentYear - 100 + ':' + currentYear;
		this.validToYearRange = currentYear + ':' + (currentYear + 100);
		this.birthdayMaxDate = currentDate;
		this.validToMinDate = currentDate;
		this.locale = DateUtils.getLocaleToCalendar();
		this.datePlaceholder = 'дд.мм.гггг';
	}

	public ngOnInit(): void {
		this.initializeValues();
		this.initializeWs();
		this.form = this.generatePaymentForm();
	}

	public submit(): void {}

	public hasError(mnemo: string): boolean {
		const fc = this.form.get(mnemo);
		if (fc === null) {
			return false;
		}
		return !!(fc.touched && fc.errors);
	}

	public decodeError(mnemo: string): string {
		const fc = this.form.get(mnemo);
		if (fc && fc.errors) {
			if (fc.errors.required) {
				return 'Значение обязательно';
			}
		}
		return 'Неверный формат данных';
	}

	public sendNewData(field: string): void {
		if (this.editMode && this.sessionId) {
			const newData = new NewData();
			newData.fieldName = field;
			newData.fieldValue = this.form.get(field)?.value;
			newData.sessionId = this.sessionId;
			this.websocketService.sendNewData(newData);
		}
	}

	public inputDate(event: any, field: string): void {
		let cursorPosition = event.target.selectionEnd;

		if (event.inputType === 'deleteContentBackward' && (cursorPosition === 2 || cursorPosition === 5)) {
			event.target.value =
				event.target.value.substring(0, cursorPosition - 1) + event.target.value.substring(cursorPosition);
			cursorPosition--;
		}
		if (event.inputType === 'insertText' && event.target.value.length > 10) {
			event.target.value = event.target.value.substring(0, event.target.value.length - 1);
		}

		let dateMask = event.target.value.toString();
		dateMask = dateMask.replace(/\D/g, '');

		let mask = '';
		for (let i = 0; i < dateMask.length; i++) {
			mask += dateMask[i];
			if (i === 1 || i === 3) {
				mask += '.';
				if (cursorPosition === 2 || cursorPosition === 5) {
					cursorPosition++;
				}
			}
		}
		event.target.value = mask.toString();
		event.target.selectionStart = cursorPosition;
		event.target.selectionEnd = cursorPosition;

		if (event.target.value.length === 10) {
			let dateParts: string[] = event.target.value.split('.');
			let date: Date = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
			this.form.get(field)?.setValue(date);
			this.sendNewData(field);
		}
	}

	public confirmCancel(): void {
		this.confirmationService.confirm({
			key: 'cancel',
			message: 'Вы уверены, что хотите отменить оформление заявки?',
			accept: () => {
				this.cancel();
			},
			reject: () => {},
		});
	}

	public confirmSave(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			Object.keys(this.form.controls).forEach((mnemo) => {
				this.hasError(mnemo);
			});
			return;
		}
		this.confirmationService.confirm({
			key: 'save',
			message: 'Вы уверены, что хотите сохранить заявку?',
			accept: () => {
				this.save();
			},
			reject: () => {},
		});
	}

	private cancel(): void {
		Object.keys(this.form.controls).forEach((key: string) => {
			this.form.get(key)?.setValue(null);
			this.sendNewData(key);

			this.form.get(key)?.markAsPristine();
			this.form.get(key)?.markAsUntouched();
		});
	}

	private save(): void {
		// Отправка данных на сервер
	}

	private generatePaymentForm(): FormGroup {
		const f: FormGroup = this.formBuilder.group({
			firstname: [{ value: null, disabled: !this.editMode }, [Validators.required]],
			lastname: [{ value: null, disabled: !this.editMode }, [Validators.required]],
			patronymic: [{ value: null, disabled: !this.editMode }, [Validators.required]],
			sex: [{ value: null, disabled: !this.editMode }, [Validators.required]],
			birthday: [{ value: null, disabled: !this.editMode }, [Validators.required]],
			document: [{ value: null, disabled: !this.editMode }, [Validators.required]],
			persNumber: [{ value: null, disabled: !this.editMode }, [Validators.required]],
			docNumber: [{ value: null, disabled: !this.editMode }, [Validators.required]],
			validTo: [{ value: null, disabled: !this.editMode }, [Validators.required]],
			education: [{ value: null, disabled: !this.editMode }, [Validators.required]],
			address: [{ value: null, disabled: !this.editMode }, [Validators.required]],
			phone: [{ value: null, disabled: !this.editMode }, [Validators.required]],
			phone2: [{ value: null, disabled: !this.editMode }, [Validators.required]],
			maritalStatus: [{ value: null, disabled: !this.editMode }, [Validators.required]],
			children: [{ value: null, disabled: !this.editMode }, [Validators.required]],
			organization: [{ value: null, disabled: !this.editMode }, [Validators.required]],
			position: [{ value: null, disabled: !this.editMode }, [Validators.required]],
			experience: [{ value: null, disabled: !this.editMode }, [Validators.required]],
			averageIncome: [{ value: null, disabled: !this.editMode }, [Validators.required]],
		});
		return f;
	}

	private initializeWs(): void {
		if (this.editMode) {
			this.websocketService.connect();
		} else {
			this.websocketService.connectAndSubscribe(this.sessionId).subscribe((data: NewData) => {
				this.onMessageReceived(data);
			});
		}
	}

	private initializeValues(): void {
		this.sex = [
			{ value: SexEnum.FEMAIL, label: 'Женский' },
			{ value: SexEnum.MALE, label: 'Мужской' },
		];

		this.docType = [
			{ value: DocTypeEnum.PASSPORT, label: 'Паспорт' },
			{ value: DocTypeEnum.RESIDENT_CARD, label: 'Вид на жительство' },
		];

		this.education = [
			{ value: EducationEnum.SECONDARY, label: 'Среднее в т.ч. Специальное' },
			{ value: EducationEnum.INCOMPLETE_HIGHER, label: 'Неполное высшее' },
			{ value: EducationEnum.HIGHER, label: 'Высшее (одно и более)' },
		];

		this.maritalStatus = [
			{ value: MaritalStatusEnum.MARRIED, label: 'Женат/замужем' },
			{ value: MaritalStatusEnum.NOT_MARRIED, label: 'Холост/не замужем' },
		];

		this.children = [
			{ value: ChildrenEnum.NO, label: 'Нет' },
			{ value: ChildrenEnum.ONE, label: '1' },
			{ value: ChildrenEnum.TWO, label: '2' },
			{ value: ChildrenEnum.THREE, label: '3' },
			{ value: ChildrenEnum.MORE_THAN_THREE, label: 'больше 3' },
		];

		this.experience = [
			{ value: ExperienceEnum.LESS_THAN_3M, label: 'меньше 3 месяцев' },
			{ value: ExperienceEnum.FROM_3M_TO_1Y, label: 'от 3 месяцев до 1 года' },
			{ value: ExperienceEnum.FROM_1Y_TO_3Y, label: 'от 1 года до 3 лет' },
			{ value: ExperienceEnum.MORE_THAN_3Y, label: 'больше 3 лет' },
		];
	}

	private onMessageReceived(data: NewData): void {
		if (data.sessionId === this.sessionId) {
			let value: any = data.fieldValue;
			if ((data.fieldName === 'birthday' || data.fieldName === 'validTo') && data.fieldValue) {
				value = new Date(data.fieldValue);
			}
			this.form.get(data.fieldName)?.setValue(value);

			var element = document.getElementById(data.fieldName);
			var elementL = document.getElementById(data.fieldName + 'L');
			if (element && elementL) {
				var elementPosition = {
					top: window.pageYOffset + element.getBoundingClientRect().top,
					bottom: window.pageYOffset + element.getBoundingClientRect().bottom,
				};
				var labelPosition = {
					top: window.pageYOffset + elementL.getBoundingClientRect().top,
					bottom: window.pageYOffset + elementL.getBoundingClientRect().bottom,
				};
				// Получаем позиции окна
				var windowPosition = {
					top: window.pageYOffset,
					bottom: window.pageYOffset + document.documentElement.clientHeight,
				};

				if (
					elementPosition.bottom > windowPosition.bottom ||
					// elementPosition.top < 0 ||

					// labelPosition.bottom < windowPosition.top ||
					labelPosition.top < 0
				) {
					elementL.scrollIntoView();
				}
			}
		}
	}
}
