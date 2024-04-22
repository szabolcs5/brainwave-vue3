export const rules = {
	required: (value: string) => !!value,
	email: (value: string) => {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regex.test(value);
	},
	sameAs: (value: string, sameAs: string) => value === sameAs,
};

const errorMessages = {
	required: 'This field is required',
	email: 'Invalid email',
	sameAs: 'This field must be the same as the previous one',
};

export function validate<T>(fields: T, fieldRules: Record<keyof T, keyof typeof rules>) {
	const errors: Record<keyof T, string> = {} as Record<keyof T, string>;

	for (const field in fields) {
		const ruleToApply = fieldRules[field];
		const value = fields[field];

		const isValid = rules[ruleToApply as keyof typeof rules](value as string, fields[ruleToApply as keyof typeof fields] as string);

		if (!isValid) {
			errors[field as keyof typeof errors] = errorMessages[ruleToApply as keyof typeof errorMessages];
		}
	}

	return errors;
}
