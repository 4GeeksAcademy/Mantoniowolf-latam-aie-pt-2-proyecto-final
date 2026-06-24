document.addEventListener("DOMContentLoaded", function () {
	const form = document.getElementById("application-form")
	const status = document.getElementById("form-status")

	if (!form || !status) return

	const fields = {
		nombre: document.getElementById("nombre"),
		correo: document.getElementById("correo"),
		telefono: document.getElementById("telefono"),
		fecha_demo: document.getElementById("fecha-demo"),
		sucursales: document.getElementById("sucursales"),
		mensaje: document.getElementById("mensaje")
	}

	const radioGroup = Array.from(form.querySelectorAll('input[name="objetivo"]'))
	const today = new Date()
	today.setHours(0, 0, 0, 0)
	let preserveStatusOnReset = false

	if (fields.fecha_demo) {
		fields.fecha_demo.min = today.toISOString().split("T")[0]
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

	const validateFecha = () => {
		const value = fields.fecha_demo.value

		if (!value) return setFieldState(fields.fecha_demo, "fecha-demo-error", "Selecciona una fecha para tu reserva.")

		const selectedDate = new Date(value + "T00:00:00")
		if (Number.isNaN(selectedDate.getTime())) {
			return setFieldState(fields.fecha_demo, "fecha-demo-error", "La fecha seleccionada no es valida.")
		}
		if (selectedDate < today) {
			return setFieldState(fields.fecha_demo, "fecha-demo-error", "La fecha debe ser hoy o posterior.")
		}

		return setFieldState(fields.fecha_demo, "fecha-demo-error", "")
	}

	const validateSucursales = () => {
		const value = fields.sucursales.value.trim()
		const parsed = Number(value)

		if (!value) return setFieldState(fields.sucursales, "sucursales-error", "Indica cuantas personas asistiran.")
		if (!Number.isInteger(parsed)) return setFieldState(fields.sucursales, "sucursales-error", "Ingresa un numero entero de comensales.")
		if (parsed < 1) return setFieldState(fields.sucursales, "sucursales-error", "El numero de comensales debe ser mayor o igual a 1.")

		return setFieldState(fields.sucursales, "sucursales-error", "")
	}

	const validateObjetivo = () => {
		const selected = radioGroup.some((radio) => radio.checked)
		if (!selected) return setRadioState("Selecciona la ocasion de tu visita.")
		return setRadioState("")
	}

	const validateMensaje = () => {
		const value = fields.mensaje.value.trim()

		if (!value) return setFieldState(fields.mensaje, "mensaje-error", "Comparte cualquier detalle importante para tu reserva.")
		if (value.length < 20) {
			return setFieldState(fields.mensaje, "mensaje-error", "Describe tu reserva con al menos 20 caracteres.")
		}

		return setFieldState(fields.mensaje, "mensaje-error", "")
	}

	const validators = {
		nombre: validateNombre,
		correo: validateCorreo,
		telefono: validateTelefono,
		fecha_demo: validateFecha,
		sucursales: validateSucursales,
		mensaje: validateMensaje,
		objetivo: validateObjetivo
	}

	const validateFieldByName = (name) => {
		const validator = validators[name]
		if (!validator) return true
		return validator()
	}

	const validateForm = () => {
		const results = [
			validateNombre(),
			validateCorreo(),
			validateTelefono(),
			validateFecha(),
			validateSucursales(),
			validateObjetivo(),
			validateMensaje()
		]

		return results.every(Boolean)
	}

	Object.entries(fields).forEach(([name, field]) => {
		field.addEventListener("input", function () {
			validateFieldByName(name)
			clearStatus()
		})

		field.addEventListener("blur", function () {
			validateFieldByName(name)
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

	form.addEventListener("reset", function () {
		window.setTimeout(function () {
			if (!preserveStatusOnReset) {
				clearStatus()
			}

			clearFieldState(fields.nombre, "nombre-error")
			clearFieldState(fields.correo, "correo-error")
			clearFieldState(fields.telefono, "telefono-error")
			clearFieldState(fields.fecha_demo, "fecha-demo-error")
			clearFieldState(fields.sucursales, "sucursales-error")
			clearFieldState(fields.mensaje, "mensaje-error")
			clearRadioState()
			preserveStatusOnReset = false
		}, 0)
	})

	form.addEventListener("submit", function (event) {
		event.preventDefault()
		clearStatus()

		if (!validateForm()) {
			setStatus("Revisa los campos marcados antes de confirmar tu reserva.", "error")
			const firstInvalid = form.querySelector('[aria-invalid="true"]')
			if (firstInvalid) firstInvalid.focus()
			return
		}

		preserveStatusOnReset = true
		form.reset()
		setStatus("Reserva enviada. Te confirmaremos tu mesa dentro de las proximas 24 horas.", "success")
	})
})

