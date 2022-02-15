import {applyMiddleware, combineReducers, createStore} from 'redux'
import {CoursesReducer} from "./courses-reducer";
import {modulesReducer} from "./modules-reducer";
import thunk from "redux-thunk";
import {appReducer} from "../app/app-reducer";
import {TypedUseSelectorHook, useSelector} from "react-redux";

export type AppRootStateType = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
    courses: CoursesReducer,
    modules: modulesReducer,
    app: appReducer
})

export const store = createStore(rootReducer, applyMiddleware(thunk))

export const useAppReducer : TypedUseSelectorHook<AppRootStateType> = useSelector

// @ts-ignore
window.store = store
