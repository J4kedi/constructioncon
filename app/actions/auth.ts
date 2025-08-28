import { FormState, SignupFormSchema } from "../lib/definitions";

export async function signup(state: FormState, formData: FormData) {
    const validateFields = SignupFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    })

    if (!validateFields.success) {
        return {
            errors: validateFields.error.flatten().fieldErrors,
            message: 'Dados inválidos. Por favor, corrija os campos destacados.',
        }
    }

    

}