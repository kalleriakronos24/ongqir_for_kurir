import loginToken from './token.reducer';
import { combineReducers } from 'redux'
import DeviceReducer from './device.reducer';

const Root = combineReducers({
    token: loginToken,
    device: DeviceReducer
});

export default Root;