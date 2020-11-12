let initialState = {
    dummy: '',
    token: null
}


interface ActionProps {
    type: string,
    token: string
}

const loginToken = (state = initialState, action: ActionProps) => {
    switch (action.type) {
        case 'LOGIN_TOKEN':
            return {
                ...state,
                token: action.token
            }
        case 'LOGOUT':
            return {
                ...state,
                token: null
            }
        default:
            return state
    }
}

export default loginToken;