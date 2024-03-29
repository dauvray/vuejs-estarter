import { defaults } from "../../../services/helpers";
import fecha from "fecha";

let resources = {
	fieldIsRequired: "Ce champ est obligatoire",
	invalidFormat: "Format invalide",

	numberTooSmall: "Le nombre est trop petit, minimum: {0}",
	numberTooBig: "Le nombre est trop grand, maximum: {0}",
	invalidNumber: "Nombre invalide",
	invalidInteger: "La valeur attendue est un nombre",

	textTooSmall: "Le texte est trop court. Actuel: {0}, Minimum: {1}",
	textTooBig: "Le texte est trop long. Actuel: {0}, Maximum: {1}",
	thisNotText:"Texte attendu",

	thisNotArray: "Tableau attendu",

	selectMinItems: "Sélectionnez au moins {0} éléments",
	selectMaxItems: "Sélectionnez au maximum {0} éléments",

	invalidDate: "Date invalide",
	dateIsEarly: "La date est trop proche. Actuelle: {0}, Minimum: {1}",
	dateIsLate: "La date est trop éloignée. Actuelle: {0}, Maximum: {1}",

	invalidEmail: "Format d'email invalide",
	invalidURL: "URL invalide",

	invalidCard: "Format de carte invalide",
	invalidCardNumber: "Numéro de carte invalide",

	invalidTextContainNumber: "Texte invalide, ne peut contenir de chiffre ou de caractères spéciaux",
	invalidTextContainSpec: "Texte invalide, ne peut contenir de caractères spéciaux"
};

function checkEmpty(value, required, messages = resources) {
	if (value == null || value === "") {
		if (required) {
			return [msg(messages.fieldIsRequired)];
		} else {
			return [];
		}
	}
	return null;
}

function msg(text) {
	if (text != null && arguments.length > 1) {
		for (let i = 1; i < arguments.length; i++) {
			text = text.replace("{" + (i - 1) + "}", arguments[i]);
		}
	}

	return text;
}

const validators = {
	resources,

	required(value, field, model, messages = resources) {
		return checkEmpty(value, field.required, messages);
	},

	number(value, field, model, messages = resources) {
		let res = checkEmpty(value, field.required, messages);
		if (res != null) return res;

		let err = [];
		if (Number.isFinite(value)) {
			if (field.min != null && value < field.min) {
				err.push(msg(messages.numberTooSmall, field.min));
			}

			if (field.max != null && value > field.max) {
				err.push(msg(messages.numberTooBig, field.max));
			}
		} else {
			err.push(msg(messages.invalidNumber));
		}

		return err;
	},

	integer(value, field, model, messages = resources) {
		let res = checkEmpty(value, field.required, messages);
		if (res != null) return res;
		let errs = validators.number(value, field, model, messages);

		if (!Number.isInteger(value)) {
			errs.push(msg(messages.invalidInteger));
		}

		return errs;
	},

	double(value, field, model, messages = resources) {
		let res = checkEmpty(value, field.required, messages);
		if (res != null) return res;

		if (typeof value !== 'number' || Number.isNaN(value)) {
			return [msg(messages.invalidNumber)];
		}
	},

	string(value, field, model, messages = resources) {
		let res = checkEmpty(value, field.required, messages);
		if (res != null) return res;

		let err = [];
		if (typeof value === 'string') {
			if (field.min != null && value.length < field.min) {
				err.push(msg(messages.textTooSmall, value.length, field.min));
			}

			if (field.max != null && value.length > field.max) {
				err.push(msg(messages.textTooBig, value.length, field.max));
			}
		} else {
			err.push(msg(messages.thisNotText));
		}

		return err;
	},

	array(value, field, model, messages = resources) {
		if (field.required) {
			if (!Array.isArray(value)) {
				return [msg(messages.thisNotArray)];
			}

			if (value.length === 0) {
				return [msg(messages.fieldIsRequired)];
			}
		}

		if (value != null) {
			if (field.min != null && value.length < field.min) {
				return [msg(messages.selectMinItems, field.min)];
			}

			if (field.max != null && value.length > field.max) {
				return [msg(messages.selectMaxItems, field.max)];
			}
		}
	},

	date(value, field, model, messages = resources) {
		let res = checkEmpty(value, field.required, messages);
		if (res != null) return res;

		let m = new Date(value);
		if (isNaN(m.getDate())) {
			return [msg(messages.invalidDate)];
		}

		let err = [];

		if (field.min != null) {
			let min = new Date(field.min);
			if (m.valueOf() < min.valueOf()) {
				err.push(msg(messages.dateIsEarly, fecha.format(m), fecha.format(min)));
			}
		}

		if (field.max != null) {
			let max = new Date(field.max);
			if (m.valueOf() > max.valueOf()) {
				err.push(msg(messages.dateIsLate, fecha.format(m), fecha.format(max)));
			}
		}

		return err;
	},

	regexp(value, field, model, messages = resources) {
		let res = checkEmpty(value, field.required, messages);
		if (res != null) return res;

		if (field.pattern != null) {
			let re = new RegExp(field.pattern);
			if (!re.test(value)) {
				return [msg(messages.invalidFormat)];
			}
		}
	},

	email(value, field, model, messages = resources) {
		let res = checkEmpty(value, field.required, messages);
		if (res != null) return res;

		let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line no-useless-escape
		if (!re.test(value)) {
			return [msg(messages.invalidEmail)];
		}
	},

	url(value, field, model, messages = resources) {
		let res = checkEmpty(value, field.required, messages);
		if (res != null) return res;

		let re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g; // eslint-disable-line no-useless-escape
		if (!re.test(value)) {
			return [msg(messages.invalidURL)];
		}
	},

	creditCard(value, field, model, messages = resources) {
		let res = checkEmpty(value, field.required, messages);
		if (res != null) return res;

		/*  From validator.js code
			https://github.com/chriso/validator.js/blob/master/src/lib/isCreditCard.js
		*/
		const creditCard = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
		const sanitized = value.replace(/[^0-9]+/g, "");
		if (!creditCard.test(sanitized)) {
			return [msg(messages.invalidCard)];
		}
		let sum = 0;
		let digit;
		let tmpNum;
		let shouldDouble;
		for (let i = sanitized.length - 1; i >= 0; i--) {
			digit = sanitized.substring(i, i + 1);
			tmpNum = parseInt(digit, 10);
			if (shouldDouble) {
				tmpNum *= 2;
				if (tmpNum >= 10) {
					sum += tmpNum % 10 + 1;
				} else {
					sum += tmpNum;
				}
			} else {
				sum += tmpNum;
			}
			shouldDouble = !shouldDouble;
		}

		if (!(sum % 10 === 0 ? sanitized : false)) {
			return [msg(messages.invalidCardNumber)];
		}
	},

	alpha(value, field, model, messages = resources) {
		let res = checkEmpty(value, field.required, messages);
		if (res != null) return res;

		let re = /^[a-zA-Z]*$/;
		if (!re.test(value)) {
			return [msg(messages.invalidTextContainNumber)];
		}
	},

	alphaNumeric(value, field, model, messages = resources) {
		let res = checkEmpty(value, field.required, messages);
		if (res != null) return res;

		let re = /^[a-zA-Z0-9]*$/;
		if (!re.test(value)) {
			return [msg(messages.invalidTextContainSpec)];
		}
	}
};

Object.keys(validators).forEach(name => {
	const fn = validators[name];
	if (typeof fn === 'function') {
		fn.locale = customMessages => (value, field, model) => fn(value, field, model, defaults(customMessages, resources));
	}
});

export default validators;
