import loginToken from './token.reducer';
import { combineReducers } from 'redux'
import DeviceReducer from './device.reducer';
import GmapKeyReducer from './gmap_key.reducer';

const Root = combineReducers({
    token: loginToken,
    device: DeviceReducer,
    gmap : GmapKeyReducer
});

export default Root;