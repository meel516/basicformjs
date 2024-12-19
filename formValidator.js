export class FormValidator {
    constructor(form, schema) {
        this.form = form;
        this.schema = schema;
        this.submitBtn = form.querySelector('.submit-btn');
        this.init();
    }

    init() {
        // Handle conditional fields
        this.form.querySelectorAll('[data-toggle]').forEach(toggle => {
            toggle.addEventListener('change', () => this.toggleGroup(toggle));
        });

        // Handle form validation
        this.form.addEventListener('input', () => this.validateForm());
        this.form.addEventListener('change', () => this.validateForm());
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    toggleGroup(toggle) {
        const groupName = toggle.dataset.toggle;
        const group = this.form.querySelector(`[data-group="${groupName}"]`);
        const isVisible = toggle.checked;

        group.classList.toggle('hidden', !isVisible);
        
        // Update required attributes
        if (group) {
            const inputs = group.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.required = isVisible;
                if (!isVisible) {
                    input.value = '';
                    this.clearError(input);
                }
            });
        }

        this.validateForm();
    }

    validateField(input) {
        const groupElement = input.closest('[data-group]');
        if (!groupElement) return true;

        const groupName = groupElement.dataset.group;
        const fieldName = input.name;
        const fieldSchema = this.schema.groups[groupName]?.fields[fieldName];

        if (!fieldSchema) return true;

        // Skip validation if group is hidden
        if (groupElement.classList.contains('hidden')) {
            return true;
        }

        // Skip validation if field is not required and empty
        if (!fieldSchema.required && !input.value) {
            this.clearError(input);
            return true;
        }

        // Validate the input based on its type
        let value = input.type === 'checkbox' || input.type === 'radio' ? input.checked : input.value;
        if (input.type === 'select-one') {
            value = input.value; // Select dropdown validation
        }

        const isValid = fieldSchema.validate(value);

        if (!isValid) {
            this.showError(input, `Please enter a valid ${fieldName}`);
            return false;
        }

        this.clearError(input);
        return true;
    }

    showError(input, message) {
        const field = input.closest('.form-field');
        const errorElement = field.querySelector('.error-message');
        input.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    clearError(input) {
        const field = input.closest('.form-field');
        const errorElement = field.querySelector('.error-message');
        input.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    validateForm() {
        let isValid = true;

        // Validate all visible inputs
        this.form.querySelectorAll('.form-group:not(.hidden) input, textarea, select').forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        this.submitBtn.disabled = !isValid;
        return isValid;
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.validateForm()) {
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData.entries());
            console.log('Form submitted:', data);
            alert('Form submitted successfully!');
            this.form.reset();
            
            // Reset conditional groups
            this.form.querySelectorAll('[data-group]').forEach(group => {
                if (group.dataset.group !== 'basic') {
                    group.classList.add('hidden');
                }
            });
            
            this.submitBtn.disabled = true;
        }
    }
}
