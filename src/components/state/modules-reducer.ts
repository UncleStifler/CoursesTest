import {
    AddCourseActionType,
    RemoveCourseActionType,
    SetCourseActionType
} from "./courses-reducer";
import {ModuleStatuses, ModuleType} from "../api/course-api";
import {modulesListsAPI, UpdateModuleType} from "../api/modules-api";
import {AppRootStateType} from "./store";
import {Dispatch} from "redux";
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from "../app/app-reducer";
import {AxiosError} from "axios";
import {ModuleFormInput} from "../utils/Forms/NewModuleForm";


export type ModulesDomain_Type = ModuleType & {
    entityModuleStatus: RequestStatusType

}
export type ModulesStateType = {
    [key: string]: ModulesDomain_Type[]
}

const initialState: ModulesStateType = {}


export const modulesReducer = (state: ModulesStateType = initialState, action: ActionTypes): ModulesStateType => {
    switch (action.type) {
        case "MODULE/LOAD-MODULE": {
            const stateCopy = {...state}
            stateCopy[action.moduleId] = action.arrayModules
                .map(tl => ({...tl, entityModuleStatus: 'idle'}))
            return stateCopy
        }

        case "MODULE/REMOVE-MODULE": {
            const stateCopy = {...state}
            const modules = state[action.courseId]
            stateCopy[action.courseId] = modules.filter(t => t.id !== action.moduleId)
            return stateCopy
        }
        case "MODULE/ADD-MODULE": {
            const stateCopy = {...state}
            const module = stateCopy[action.module.todoListId]
            stateCopy[action.module.todoListId] = [action.module, ...module]
                .map(tl => ({...tl,
                    entityModuleStatus: 'idle',
                    moduleId: action.moduleId,
                    dateOfModule: action.dateOfModule
                }))
            return {...stateCopy}
        }
        case "MODULE/CHANGE-CHECKBOX-STATUS": {
            let courseModule = state[action.courseId];
            state[action.courseId] = courseModule
                .map(t => t.id === action.moduleId ? {...t, status: action.status} : t);
            return ({...state});
        }
        case "MODULE/CHANGE-MODULE-TITLE": {
            let modules = state[action.courseId]
            state[action.courseId] = modules
                .map(t => t.id === action.moduleId ? {...t, title: action.title} : t)
            return ({...state})
        }
        case "COURSE/ADD-COURSE": {
            const stateCopy = {...state}
            stateCopy[action.courseId] = []
            return stateCopy
        }
        case "COURSE/REMOVE-COURSE": {
            const stateCopy = {...state}
            delete stateCopy[action.id]
            return stateCopy
        }
        case "COURSE/SET-COURSE": {
            const copyState = {...state}
            action.courseArray.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case "MODULE/CHANGE-MODULE-ENTITY-STATUS": {
            let modules = state[action.courseId]
            state[action.courseId] = modules
                .map(ent => ent.id === action.moduleId ? {...ent, entityModuleStatus: action.entityModuleStatus} : ent)
            return ({...state})
        }
        default:
            return state
    }
}


export type loadModulesActionType = ReturnType<typeof getModulesAC>

export const getModulesAC = (moduleId: string, arrayModules: ModuleType[]) => {
    return {type: 'MODULE/LOAD-MODULE', moduleId: moduleId, arrayModules: arrayModules} as const
}

export const removeModulesAC = (modelId: string, courseId: string) => {
    return {
        type: "MODULE/REMOVE-MODULE",
        moduleId: modelId,
        courseId: courseId
    } as const
}
export const addModulesAC = (modules: ModuleType) => {
    return {
        type: "MODULE/ADD-MODULE",
        module: modules,
        moduleId: modules.moduleId,
        dateOfModule: modules.dateOfModule
    } as const
}

export const changeStatusCheckboxAC = (moduleId: string, status: ModuleStatuses, courseId: string) => {
    return {
        type: "MODULE/CHANGE-CHECKBOX-STATUS",
        status,
        courseId: courseId,
        moduleId: moduleId,
    } as const
}

export const changeModuleTitleAC = (moduleId: string, title: string, courseId: string) => {
    return {
        type: "MODULE/CHANGE-MODULE-TITLE",
        title,
        courseId: courseId,
        moduleId: moduleId,
    } as const
}

export const changeModuleEntityStatusAC = (moduleId: string, courseId: string, entityModuleStatus: RequestStatusType) => ({
    type: "MODULE/CHANGE-MODULE-ENTITY-STATUS",
    moduleId: moduleId,
    courseId: courseId,
    entityModuleStatus
} as const)


export const loadModulesTC = (courseId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC('loading'))
        modulesListsAPI.getModules(courseId)
            .then((res) => {
                dispatch(getModulesAC(courseId, res.data.items))
                dispatch(setAppStatusAC('succeeded'))
            })
    }
}

export const removeModuleTC = (moduleId: string, courseId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC('loading'))
        dispatch(changeModuleEntityStatusAC(moduleId, courseId, 'loading'))
        modulesListsAPI.deleteModule(courseId, moduleId)
            .then(() => {
                dispatch(removeModulesAC(moduleId, courseId))
                dispatch(setAppStatusAC('succeeded'))
            })
    }
}

enum ResultCodes {
    success = 0,
    error = 1,
    captcha = 10
}

export const addModuleTC = (courseId: string, dataModule: ModuleFormInput, dateOfModule: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC('loading'))
        modulesListsAPI.createModule(courseId, dataModule.moduleName)
            .then((res) => {
                if (res.data.resultCode === ResultCodes.success) {
                    dispatch(addModulesAC({...res.data.data.item,
                    moduleId: dataModule.moduleId, dateOfModule: dateOfModule}))
                } else {
                    dispatch(setAppErrorAC(res.data.messages.length ?
                        res.data.messages[0] : 'some error'))
                }
            })
            .catch((error: AxiosError) => {
                dispatch(setAppErrorAC(error.message))
            })
            .finally(() => {
                dispatch(setAppStatusAC('idle'))
            })
    }
}

export const updateModuleStatusTC = (courseId: string, moduleId: string, status: ModuleStatuses) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
        const state = getState()
        const allModules = state.modules
        const modulesForThisCourse = allModules[courseId]
        const currentModule = modulesForThisCourse.find(t => t.id === moduleId)

        if (currentModule) {
            const model: UpdateModuleType = {
                title: currentModule.title,
                status,
                priority: currentModule.priority,
                startDate: currentModule.startDate,
                deadline: currentModule.description,
                description: currentModule.description,
            }
            dispatch(setAppStatusAC('loading'))
            dispatch(changeModuleEntityStatusAC(moduleId, courseId, 'loading'))
            modulesListsAPI.updateModule(courseId, moduleId, model)
                .then(() => {
                    dispatch(changeStatusCheckboxAC(moduleId, status, courseId))
                    dispatch(setAppStatusAC('succeeded'))
                    dispatch(changeModuleEntityStatusAC(moduleId, courseId, 'idle'))
                })
        }
    }

export const changeModuleTitleTC = (moduleId: string, title: string, courseId: string) => {
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {
        const state = getState()
        const currentModule = state.modules[courseId].find((t => t.id === moduleId))
        if (currentModule) {
            const model: UpdateModuleType = {
                title: title,
                status: currentModule.status,
                priority: currentModule.priority,
                startDate: currentModule.startDate,
                deadline: currentModule.description,
                description: currentModule.description,
            }
            dispatch(setAppStatusAC('loading'))
            dispatch(changeModuleEntityStatusAC(moduleId, courseId, 'loading'))
            modulesListsAPI.updateModule(courseId, moduleId, model)
                .then(() => {
                    dispatch(changeModuleTitleAC(moduleId, title, courseId))
                })
                .catch((error: AxiosError) => {
                    dispatch(setAppErrorAC(error.message))
                })
                .finally(() => {
                    dispatch(setAppStatusAC('succeeded'))
                    dispatch(changeModuleEntityStatusAC(moduleId, courseId, 'idle'))
                })
        }
    }
}

type ActionTypes = RemoveModuleActionType | AddModuleActionType |
    ChangeFilterStatusType | ChangeModuleTitleType | AddCourseActionType |
    RemoveCourseActionType | loadModulesActionType | SetCourseActionType |
    changeModuleEntityActionType

export type RemoveModuleActionType = ReturnType<typeof removeModulesAC>
export type AddModuleActionType = ReturnType<typeof addModulesAC>
export type ChangeFilterStatusType = ReturnType<typeof changeStatusCheckboxAC>
export type ChangeModuleTitleType = ReturnType<typeof changeModuleTitleAC>
export type changeModuleEntityActionType = ReturnType<typeof changeModuleEntityStatusAC>
