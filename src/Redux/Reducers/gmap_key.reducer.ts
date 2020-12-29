let initialState = {
    key : null
};

type ActionProps = {
    type : string,
    key : string
};

const GmapKeyReducer = (state = initialState, action: ActionProps) => {

    switch(action.type){
        case "add_gmap_key":
            return {
                ...state,
                key : action.key
            }
        default: 
            return state
    }
};

export default GmapKeyReducer;