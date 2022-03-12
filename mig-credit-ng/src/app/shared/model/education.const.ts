import { EducationEnum } from 'src/app/shared/model/education.enum';

export const EducationConst = {
	[EducationEnum.SECONDARY]: 'Среднее в т.ч. cпециальное',
	[EducationEnum.INCOMPLETE_HIGHER]: 'Неполное высшее',
	[EducationEnum.HIGHER]: 'Высшее (одно и более)',
};
