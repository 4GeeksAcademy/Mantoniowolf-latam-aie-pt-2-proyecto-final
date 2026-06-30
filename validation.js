document.addEventListener("DOMContentLoaded", function () {
	const form = document.getElementById("application-form")
	const status = document.getElementById("form-status")

	if (!form || !status) return

	const fields = {
		nombre: document.getElementById("nombre"),
		fecha_nacimiento: document.getElementById("fecha-nacimiento"),
		correo: document.getElementById("correo"),
		telefono: document.getElementById("telefono"),
		pais: document.getElementById("pais"),
		tipo_documento: document.getElementById("tipo-documento"),
		numero_documento: document.getElementById("numero-documento"),
		ciudad: document.getElementById("ciudad"),
		ubicacion: document.getElementById("ubicacion"),
		sucursal_favorita: document.getElementById("sucursal-favorita"),
		canal: document.getElementById("canal"),
		mensaje: document.getElementById("mensaje")
	}

	const radioGroup = Array.from(form.querySelectorAll('input[name="objetivo"]'))
	const requiredChecks = {
		acepta_terminos: document.getElementById("acepta-terminos"),
		acepta_datos: document.getElementById("acepta-datos")
	}
	const today = new Date()
	today.setHours(0, 0, 0, 0)
	const minimumBirthDate = new Date(today)
	minimumBirthDate.setFullYear(minimumBirthDate.getFullYear() - 18)
	const locationBySucursal = {
		bogota: { pais: "colombia", ciudad: "bogota" },
		medellin: { pais: "colombia", ciudad: "medellin" },
		miami: { pais: "estados-unidos", ciudad: "miami" }
	}
	let preserveStatusOnReset = false

	if (fields.fecha_nacimiento) {
		fields.fecha_nacimiento.max = minimumBirthDate.toISOString().split("T")[0]
	}

	const setStatus = (message, type) => {
		status.textContent = message
		status.className = "rounded-xl border px-4 py-3 text-sm font-medium"
		status.classList.remove("hidden")

		if (type === "success") {
			status.classList.add("border-emerald-400/30", "bg-emerald-500/10", "text-emerald-200")
			return
		}

		status.classList.add("border-red-400/30", "bg-red-500/10", "text-red-200")
	}

	const clearStatus = () => {
		status.textContent = ""
		status.className = "hidden rounded-xl border px-4 py-3 text-sm font-medium"
	}

	const clearFieldState = (field, errorId) => {
		const errorNode = document.getElementById(errorId)
		if (!field || !errorNode) return

		errorNode.textContent = ""
		errorNode.classList.add("hidden")
		field.setAttribute("aria-invalid", "false")
		field.classList.remove("border-red-400/70", "bg-red-500/10", "focus:border-red-300", "focus:ring-red-400/40")
		field.classList.add("border-white/15", "focus:border-brand-gold", "focus:ring-brand-gold/40")
	}

	const setFieldState = (field, errorId, message) => {
		const errorNode = document.getElementById(errorId)
		if (!field || !errorNode) return false

		if (message) {
			errorNode.textContent = message
			errorNode.classList.remove("hidden")
			field.setAttribute("aria-invalid", "true")
			field.classList.add("border-red-400/70", "bg-red-500/10", "focus:border-red-300", "focus:ring-red-400/40")
			field.classList.remove("border-white/15", "focus:border-brand-gold", "focus:ring-brand-gold/40")
			return false
		}

		errorNode.textContent = ""
		errorNode.classList.add("hidden")
		field.setAttribute("aria-invalid", "false")
		field.classList.remove("border-red-400/70", "bg-red-500/10", "focus:border-red-300", "focus:ring-red-400/40")
		field.classList.add("border-white/15", "focus:border-brand-gold", "focus:ring-brand-gold/40")
		return true
	}

	const setRadioState = (message) => {
		const errorNode = document.getElementById("objetivo-error")
		if (!errorNode) return false

		radioGroup.forEach((radio) => {
			if (message) {
				radio.setAttribute("aria-invalid", "true")
			} else {
				radio.setAttribute("aria-invalid", "false")
			}
		})

		if (message) {
			errorNode.textContent = message
			errorNode.classList.remove("hidden")
			return false
		}

		errorNode.textContent = ""
		errorNode.classList.add("hidden")
		return true
	}

	const clearRadioState = () => {
		setRadioState("")
		radioGroup.forEach((radio) => radio.setAttribute("aria-invalid", "false"))
	}

	const setCheckState = (checkbox, errorId, message) => {
		const errorNode = document.getElementById(errorId)
		if (!checkbox || !errorNode) return false

		if (message) {
			errorNode.textContent = message
			errorNode.classList.remove("hidden")
			checkbox.setAttribute("aria-invalid", "true")
			return false
		}

		errorNode.textContent = ""
		errorNode.classList.add("hidden")
		checkbox.setAttribute("aria-invalid", "false")
		return true
	}

	const clearCheckState = (checkbox, errorId) => {
		setCheckState(checkbox, errorId, "")
	}

	const validateNombre = () => {
		const value = fields.nombre.value.trim()

		if (!value) return setFieldState(fields.nombre, "nombre-error", "Ingresa tu nombre completo.")
		if (value.length < 3) return setFieldState(fields.nombre, "nombre-error", "El nombre debe tener al menos 3 caracteres.")
		if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'.-]+$/.test(value)) {
			return setFieldState(fields.nombre, "nombre-error", "El nombre solo puede contener letras y espacios.")
		}

		return setFieldState(fields.nombre, "nombre-error", "")
	}

	const validateCorreo = () => {
		const value = fields.correo.value.trim()

		if (!value) return setFieldState(fields.correo, "correo-error", "Ingresa tu correo electronico.")
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
			return setFieldState(fields.correo, "correo-error", "Ingresa un correo electronico valido.")
		}

		return setFieldState(fields.correo, "correo-error", "")
	}

	const validateFechaNacimiento = () => {
		const value = fields.fecha_nacimiento.value

		if (!value) return setFieldState(fields.fecha_nacimiento, "fecha-nacimiento-error", "Selecciona tu fecha de nacimiento.")

		const selectedDate = new Date(value + "T00:00:00")
		if (Number.isNaN(selectedDate.getTime())) {
			return setFieldState(fields.fecha_nacimiento, "fecha-nacimiento-error", "La fecha de nacimiento no es valida.")
		}

		if (selectedDate > minimumBirthDate) {
			return setFieldState(fields.fecha_nacimiento, "fecha-nacimiento-error", "Debes ser mayor de edad para registrarte en Brasa Points.")
		}

		return setFieldState(fields.fecha_nacimiento, "fecha-nacimiento-error", "")
	}

	const validateTelefono = () => {
		const value = fields.telefono.value.trim()
		const digits = value.replace(/\D/g, "")

		if (!value) return setFieldState(fields.telefono, "telefono-error", "Ingresa un numero de telefono.")
		if (digits.length < 7) return setFieldState(fields.telefono, "telefono-error", "El telefono debe tener al menos 7 digitos.")
		if (!/^\+?[0-9\s()-]{7,}$/.test(value)) {
			return setFieldState(fields.telefono, "telefono-error", "Usa solo numeros, espacios, parentesis o guiones.")
		}

		return setFieldState(fields.telefono, "telefono-error", "")
	}

	const validatePais = () => {
		const value = fields.pais.value.trim()

		if (!value) return setFieldState(fields.pais, "pais-error", "Selecciona tu pais de residencia.")

		return setFieldState(fields.pais, "pais-error", "")
	}

	const validateTipoDocumento = () => {
		const value = fields.tipo_documento.value.trim()

		if (!value) return setFieldState(fields.tipo_documento, "tipo-documento-error", "Selecciona tu tipo de documento.")

		return setFieldState(fields.tipo_documento, "tipo-documento-error", "")
	}

	const validateNumeroDocumento = () => {
		const value = fields.numero_documento.value.trim()

		if (!value) return setFieldState(fields.numero_documento, "numero-documento-error", "Ingresa tu numero de documento.")
		if (value.length < 5) return setFieldState(fields.numero_documento, "numero-documento-error", "El numero de documento debe tener al menos 5 caracteres.")
		if (!/^[A-Za-z0-9-]+$/.test(value)) {
			return setFieldState(fields.numero_documento, "numero-documento-error", "Usa solo letras, numeros o guiones.")
		}

		return setFieldState(fields.numero_documento, "numero-documento-error", "")
	}

	const validateCiudad = () => {
		const value = fields.ciudad.value.trim()

		if (!value) return setFieldState(fields.ciudad, "ciudad-error", "Selecciona tu ciudad de residencia.")

		return setFieldState(fields.ciudad, "ciudad-error", "")
	}

	const validateUbicacion = () => {
		const value = fields.ubicacion.value.trim()

		if (!value) return setFieldState(fields.ubicacion, "ubicacion-error", "Ingresa tu ubicacion o zona.")
		if (value.length < 5) return setFieldState(fields.ubicacion, "ubicacion-error", "La ubicacion debe tener al menos 5 caracteres.")
		if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s'.#,-]+$/.test(value)) {
			return setFieldState(fields.ubicacion, "ubicacion-error", "La ubicacion contiene caracteres no permitidos.")
		}

		return setFieldState(fields.ubicacion, "ubicacion-error", "")
	}

	const validateSucursalFavorita = () => {
		const value = fields.sucursal_favorita.value.trim()

		if (!value) return setFieldState(fields.sucursal_favorita, "sucursal-favorita-error", "Selecciona tu sucursal favorita.")

		return setFieldState(fields.sucursal_favorita, "sucursal-favorita-error", "")
	}

	const validateCountryCityLocation = () => {
		const sucursal = fields.sucursal_favorita.value.trim()
		const pais = fields.pais.value.trim()
		const ciudad = fields.ciudad.value.trim()

		if (!sucursal || !pais || !ciudad) return true

		const expected = locationBySucursal[sucursal]
		if (!expected) return true

		if (pais !== expected.pais || ciudad !== expected.ciudad) {
			setFieldState(fields.pais, "pais-error", "Pais y ciudad deben coincidir con la sucursal seleccionada.")
			setFieldState(fields.ciudad, "ciudad-error", "Ciudad incompatible con la sucursal favorita.")
			setFieldState(fields.sucursal_favorita, "sucursal-favorita-error", "Ajusta sucursal, pais o ciudad para que coincidan.")
			return false
		}

		setFieldState(fields.pais, "pais-error", "")
		setFieldState(fields.ciudad, "ciudad-error", "")
		setFieldState(fields.sucursal_favorita, "sucursal-favorita-error", "")
		return true
	}

	const validateCanal = () => {
		const value = fields.canal.value.trim()

		if (!value) return setFieldState(fields.canal, "canal-error", "Selecciona un canal de contacto.")

		return setFieldState(fields.canal, "canal-error", "")
	}

	const validateAceptaTerminos = () => {
		if (!requiredChecks.acepta_terminos.checked) {
			return setCheckState(requiredChecks.acepta_terminos, "acepta-terminos-error", "Debes aceptar los terminos y condiciones para continuar.")
		}

		return setCheckState(requiredChecks.acepta_terminos, "acepta-terminos-error", "")
	}

	const validateAceptaDatos = () => {
		if (!requiredChecks.acepta_datos.checked) {
			return setCheckState(requiredChecks.acepta_datos, "acepta-datos-error", "Debes autorizar el tratamiento de datos para activar tu cuenta.")
		}

		return setCheckState(requiredChecks.acepta_datos, "acepta-datos-error", "")
	}

	const validateObjetivo = () => {
		const selected = radioGroup.some((radio) => radio.checked)
		if (!selected) return setRadioState("Selecciona la ocasion de tu visita.")
		return setRadioState("")
	}

	const validateMensaje = () => {
		const value = fields.mensaje.value.trim()

		if (!value) return setFieldState(fields.mensaje, "mensaje-error", "Comparte cualquier detalle importante para tu perfil.")
		if (value.length < 20) {
			return setFieldState(fields.mensaje, "mensaje-error", "Describe tu perfil con al menos 20 caracteres.")
		}

		return setFieldState(fields.mensaje, "mensaje-error", "")
	}

	const validators = {
		nombre: validateNombre,
		fecha_nacimiento: validateFechaNacimiento,
		correo: validateCorreo,
		telefono: validateTelefono,
		pais: validatePais,
		tipo_documento: validateTipoDocumento,
		numero_documento: validateNumeroDocumento,
		ciudad: validateCiudad,
		ubicacion: validateUbicacion,
		sucursal_favorita: validateSucursalFavorita,
		canal: validateCanal,
		mensaje: validateMensaje,
		objetivo: validateObjetivo,
		acepta_terminos: validateAceptaTerminos,
		acepta_datos: validateAceptaDatos
	}

	const validateFieldByName = (name) => {
		const validator = validators[name]
		if (!validator) return true
		return validator()
	}

	const validateForm = () => {
		const results = [
			validateNombre(),
			validateFechaNacimiento(),
			validateCorreo(),
			validateTelefono(),
			validatePais(),
			validateTipoDocumento(),
			validateNumeroDocumento(),
			validateCiudad(),
			validateUbicacion(),
			validateSucursalFavorita(),
			validateCountryCityLocation(),
			validateCanal(),
			validateObjetivo(),
			validateMensaje(),
			validateAceptaTerminos(),
			validateAceptaDatos()
		]

		return results.every(Boolean)
	}

	Object.entries(fields).forEach(([name, field]) => {
		field.addEventListener("input", function () {
			validateFieldByName(name)
			validateCountryCityLocation()
			clearStatus()
		})

		field.addEventListener("blur", function () {
			validateFieldByName(name)
			validateCountryCityLocation()
		})
	})

	radioGroup.forEach((radio) => {
		radio.addEventListener("change", function () {
			validateObjetivo()
			clearStatus()
		})

		radio.addEventListener("blur", function () {
			validateObjetivo()
		})
	})

	Object.entries(requiredChecks).forEach(([name, checkbox]) => {
		checkbox.addEventListener("change", function () {
			validateFieldByName(name)
			clearStatus()
		})

		checkbox.addEventListener("blur", function () {
			validateFieldByName(name)
		})
	})

	form.addEventListener("reset", function () {
		window.setTimeout(function () {
			if (!preserveStatusOnReset) {
				clearStatus()
			}

			clearFieldState(fields.nombre, "nombre-error")
			clearFieldState(fields.fecha_nacimiento, "fecha-nacimiento-error")
			clearFieldState(fields.correo, "correo-error")
			clearFieldState(fields.telefono, "telefono-error")
			clearFieldState(fields.pais, "pais-error")
			clearFieldState(fields.tipo_documento, "tipo-documento-error")
			clearFieldState(fields.numero_documento, "numero-documento-error")
			clearFieldState(fields.ciudad, "ciudad-error")
			clearFieldState(fields.ubicacion, "ubicacion-error")
			clearFieldState(fields.sucursal_favorita, "sucursal-favorita-error")
			clearFieldState(fields.canal, "canal-error")
			clearFieldState(fields.mensaje, "mensaje-error")
			clearCheckState(requiredChecks.acepta_terminos, "acepta-terminos-error")
			clearCheckState(requiredChecks.acepta_datos, "acepta-datos-error")
			clearRadioState()
			preserveStatusOnReset = false
		}, 0)
	})

	form.addEventListener("submit", function (event) {
		event.preventDefault()
		clearStatus()

		if (!validateForm()) {
			setStatus("Revisa los campos obligatorios para completar tu registro de fidelizacion.", "error")
			const firstInvalid = form.querySelector('[aria-invalid="true"]')
			if (firstInvalid) firstInvalid.focus()
			return
		}

		preserveStatusOnReset = true
		form.reset()
		setStatus("Registro enviado. Tu cuenta Brasa Points fue activada correctamente.", "success")
	})
})

