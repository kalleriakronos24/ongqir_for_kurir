interface InitState {
    device_token: string
}

interface ActionProps {
    type: string,
    token: string
}

let initialState: InitState = {
    device_token: ''
};


const DeviceReducer = (state = initialState, action: ActionProps): InitState | undefined => {
    switch (action.type) {
        case 'add_device_token':
            return {
                ...state,
                device_token: action.token
            }
        default:
            return state;
    }
}

export default DeviceReducer;