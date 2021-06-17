let signupValidationSchema = {
    email: {
        required: {
            errorMsg: 'Email is required'
        }
    },
    password: {
        required: {
            errorMsg: 'Password is required'
        },
    },
    first_name: {
        required: {
            errorMsg: 'First Name is required'
        }
    },
    last_name: {
        required: {
            errorMsg: 'Last Name is required'
        }
    }
}

let loginValidationSchema = {
    email: {
        required: {
            errorMsg: 'Email is required'
        }
    },
    password: {
        required: {
            errorMsg: 'Password is required'
        },
    }
}

let forgotValidationSchema = {
    email: {
        required: {
            errorMsg: 'Email is required'
        }
    }
}

const validationHelpers = {
    signupValidationSchema,
    loginValidationSchema,
    forgotValidationSchema
}
export default validationHelpers