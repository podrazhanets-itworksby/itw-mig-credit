import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { Application } from 'src/app/shared/model/application.model';
import { ChildrenConst } from 'src/app/shared/model/children.const';
import { ChildrenEnum } from 'src/app/shared/model/children.enum';
import { ConfirmationRequest } from 'src/app/shared/model/confirmation-request.model';
import { ConfirmationResponse } from 'src/app/shared/model/confirmation-response.model';
import { DocTypeConst } from 'src/app/shared/model/doc-type.const';
import { DocTypeEnum } from 'src/app/shared/model/doc-type.enum';
import { EducationConst } from 'src/app/shared/model/education.const';
import { EducationEnum } from 'src/app/shared/model/education.enum';
import { ExperienceConst } from 'src/app/shared/model/experience.const';
import { ExperienceEnum } from 'src/app/shared/model/experience.enum';
import { MaritalStatusConst } from 'src/app/shared/model/marital-status.const';
import { MaritalStatusEnum } from 'src/app/shared/model/marital-status.enum';
import { NewData } from 'src/app/shared/model/new-data.model';
import { SessionId } from 'src/app/shared/model/session-id.model';
import { SexConst } from 'src/app/shared/model/sex.const';
import { SexEnum } from 'src/app/shared/model/sex.enum';
import { WebsocketService } from 'src/app/shared/services/websocket.service';
import { DateUtils } from 'src/app/shared/utils/date-utils';

@Component({
	selector: 'mig-application-form',
	templateUrl: './application-form.component.html',
	styleUrls: ['./application-form.component.scss'],
	providers: [ConfirmationService],
})
export class ApplicationFormComponent implements OnInit, OnDestroy {
	@Input() public editMode: boolean;
	@Input() public sessionId: string;
	@Input() public actionButton: boolean;

	@Output() public saveApplicationEvent: EventEmitter<Application>;
	@Output() public cancelApplicationEvent: EventEmitter<void>;

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
	public clientAgree: boolean;
	public confirmationRequestText: string;
	public confirmationRequestValue: boolean;
	public confirmationFieldDisabled: boolean;

	private currentApplication: Application;
	private dateFields: Set<string>;
	private dropdownFields: Set<string>;

	constructor(
		private formBuilder: FormBuilder,
		private websocketService: WebsocketService,
		private confirmationService: ConfirmationService,
		@Inject(LOCALE_ID) private datePipelocale: string
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
		this.clientAgree = false;
		this.actionButton = false;
		this.saveApplicationEvent = new EventEmitter();
		this.cancelApplicationEvent = new EventEmitter();

		this.dateFields = new Set();
		this.dateFields.add('birthday');
		this.dateFields.add('validTo');

		this.dropdownFields = new Set();
		this.dropdownFields.add('sex');
		this.dropdownFields.add('document');
		this.dropdownFields.add('education');
		this.dropdownFields.add('maritalStatus');
		this.dropdownFields.add('children');
		this.dropdownFields.add('experience');
	}

	public ngOnInit(): void {
		this.initializeValues();
		this.initializeWs();
		this.form = this.generatePaymentForm();
	}

	public ngOnDestroy(): void {
		this.websocketService.disconnect();
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
			message: 'Вы уверены, что хотите отправить заявку на анализ?',
			accept: () => {
				this.save();
			},
			reject: () => {},
		});
	}

	public sendConfirmationRequest(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			Object.keys(this.form.controls).forEach((mnemo) => {
				this.hasError(mnemo);
			});
			return;
		}

		const sessionId = new SessionId();
		sessionId.id = this.sessionId;

		this.websocketService.sendConfirmationRequest(sessionId);
		Object.keys(this.form.controls).forEach((mnemo) => {
			this.form.get(mnemo)?.disable();
		});

		this.currentApplication = this.prepareApplication();
	}

	public changeConfirmationState($event: any): void {
		if ($event.checked) {
			this.confirmationFieldDisabled = $event.checked;
			const response = new ConfirmationResponse();
			response.sessionId = this.sessionId;
			response.isConfirmed = $event.checked;
			this.websocketService.sendConfirmationResponse(response);
		}
	}

	private cancel(): void {
		this.form.reset();
		Object.keys(this.form.controls).forEach((key: string) => {
			this.sendNewData(key);
			this.form.get(key)?.enable();
		});

		this.currentApplication = new Application();
		this.clientAgree = false;
		this.cancelApplicationEvent.emit();
	}

	private save(): void {
		this.saveApplicationEvent.emit(this.currentApplication);
	}

	private generatePaymentForm(): FormGroup {
		const f: FormGroup = this.formBuilder.group({
			firstname: [{ value: null, disabled: !this.editMode }, [Validators.required]],
			lastname: [{ value: null, disabled: !this.editMode }, [Validators.required]],
			patronymic: [{ value: null, disabled: !this.editMode }],
			sex: [{ value: null, disabled: !this.editMode }, [Validators.required]],
			birthday: [{ value: null, disabled: !this.editMode }, [Validators.required]],
			document: [{ value: null, disabled: !this.editMode }, [Validators.required]],
			persNumber: [{ value: null, disabled: !this.editMode }, [Validators.required]],
			docNumber: [{ value: null, disabled: !this.editMode }, [Validators.required]],
			validTo: [{ value: null, disabled: !this.editMode }, [Validators.required]],
			education: [{ value: null, disabled: !this.editMode }, [Validators.required]],
			address: [{ value: null, disabled: !this.editMode }, [Validators.required]],
			phone: [{ value: null, disabled: !this.editMode }, [Validators.required]],
			phone2: [{ value: null, disabled: !this.editMode }],
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
			this.websocketService.connectOperator(this.sessionId);

			this.websocketService.subscribeToConfirmationResponse().subscribe((data: ConfirmationResponse) => {
				this.clientAgree = data.isConfirmed;
			});
		} else {
			this.websocketService.connectClient(this.sessionId);

			this.websocketService.subscribeToNewData().subscribe((data: NewData) => {
				this.onNewDataReceived(data);
			});

			this.websocketService.subscribeToConfirmationRequest().subscribe((request: ConfirmationRequest) => {
				this.onConfirmationRequestReceived(request.text);
			});
		}
	}

	private initializeValues(): void {
		Object.values(SexEnum).forEach((value: SexEnum) => {
			this.sex.push({ value, label: SexConst[value] });
		});

		Object.values(DocTypeEnum).forEach((value: DocTypeEnum) => {
			this.docType.push({ value, label: DocTypeConst[value] });
		});

		Object.values(EducationEnum).forEach((value: EducationEnum) => {
			this.education.push({ value, label: EducationConst[value] });
		});

		Object.values(MaritalStatusEnum).forEach((value: MaritalStatusEnum) => {
			this.maritalStatus.push({ value, label: MaritalStatusConst[value] });
		});

		Object.values(ChildrenEnum).forEach((value: ChildrenEnum) => {
			this.children.push({ value, label: ChildrenConst[value] });
		});

		Object.values(ExperienceEnum).forEach((value: ExperienceEnum) => {
			this.experience.push({ value, label: ExperienceConst[value] });
		});
	}

	private onNewDataReceived(data: NewData): void {
		if (data.sessionId === this.sessionId) {
			this.form.get(data.fieldName)?.setValue(this.getValueForClientSide(data));

			var element = document.getElementById(data.fieldName);
			var elementL = document.getElementById(data.fieldName + 'L');

			if (element && elementL) {
				const elementPositionBottom = window.pageYOffset + element.getBoundingClientRect().bottom;
				const labelPositionTop = window.pageYOffset + elementL.getBoundingClientRect().top;
				const windowPositionBottom = window.pageYOffset + document.documentElement.clientHeight;

				if (elementPositionBottom > windowPositionBottom || labelPositionTop < 0) {
					elementL.scrollIntoView();
				}
			}
		}
	}

	private getValueForClientSide(data: NewData): string {
		if (this.dateFields.has(data.fieldName) && data.fieldValue) {
			let datePipe: DatePipe = new DatePipe(this.datePipelocale);
			const date = datePipe.transform(new Date(data.fieldValue), 'dd.MM.yyyy');
			const value = date === null ? data.fieldValue : date;
			return value;
		}

		if (data.fieldName === 'sex') {
			const value = Object.values(SexEnum).filter((value: SexEnum) => {
				return value.toString() === data.fieldValue;
			})[0];
			return SexConst[value];
		}

		if (data.fieldName === 'document') {
			const value = Object.values(DocTypeEnum).filter((value: DocTypeEnum) => {
				return value.toString() === data.fieldValue;
			})[0];
			return DocTypeConst[value];
		}

		if (data.fieldName === 'education') {
			const value = Object.values(EducationEnum).filter((value: EducationEnum) => {
				return value.toString() === data.fieldValue;
			})[0];
			return EducationConst[value];
		}

		if (data.fieldName === 'maritalStatus') {
			const value = Object.values(MaritalStatusEnum).filter((value: MaritalStatusEnum) => {
				return value.toString() === data.fieldValue;
			})[0];
			return MaritalStatusConst[value];
		}

		if (data.fieldName === 'children') {
			const value = Object.values(ChildrenEnum).filter((value: ChildrenEnum) => {
				return value.toString() === data.fieldValue;
			})[0];
			return ChildrenConst[value];
		}

		if (data.fieldName === 'experience') {
			const value = Object.values(ExperienceEnum).filter((value: ExperienceEnum) => {
				return value.toString() === data.fieldValue;
			})[0];
			return ExperienceConst[value];
		}

		return data.fieldValue;
	}

	private prepareApplication(): Application {
		const birthday = this.form.get('birthday')?.value;
		const validTo = this.form.get('validTo')?.value;
		const averageIncome = this.form.get('averageIncome')?.value;

		const application = new Application();
		application.firstname = this.form.get('firstname')?.value;
		application.lastname = this.form.get('lastname')?.value;
		application.patronymic = this.form.get('patronymic')?.value;
		application.sex = this.form.get('sex')?.value;
		application.birthday = birthday ? new Date(birthday) : birthday;
		application.document = this.form.get('document')?.value;
		application.persNumber = this.form.get('persNumber')?.value;
		application.docNumber = this.form.get('docNumber')?.value;
		application.validTo = validTo ? new Date(validTo) : validTo;
		application.education = this.form.get('education')?.value;
		application.address = this.form.get('address')?.value;
		application.phone = this.form.get('phone')?.value;
		application.phone2 = this.form.get('phone2')?.value;
		application.maritalStatus = this.form.get('maritalStatus')?.value;
		application.children = this.form.get('children')?.value;
		application.organization = this.form.get('organization')?.value;
		application.position = this.form.get('position')?.value;
		application.experience = this.form.get('experience')?.value;
		application.averageIncome = isNaN(averageIncome) ? averageIncome : +averageIncome;

		return application;
	}

	private onConfirmationRequestReceived(data: string): void {
		this.confirmationRequestText = data;
		this.confirmationRequestValue = false;
		this.confirmationFieldDisabled = false;
	}
}
