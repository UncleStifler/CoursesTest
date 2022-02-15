import {courseApi, CourseListType} from "../api/course-api";
import {Dispatch} from "redux";
import {loadModulesTC} from "./modules-reducer";
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from "../app/app-reducer";
import {AxiosError} from "axios";
import {IFormInput} from "../utils/Forms/CustomizedCourseForm";


export type FilterValuesType = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type CourseDomainType = CourseListType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

const initialState: CourseDomainType[] = []

export const CoursesReducer = (state: CourseDomainType[] = initialState, action: ActionTypes): CourseDomainType[] => {
    switch (action.type) {
        case "COURSE/SET-COURSE": {
            return action.courseArray.map(t => {
                return {...t, filter: 'DRAFT', entityStatus: 'idle', city: ""}
            })
        }
        case "COURSE/REMOVE-COURSE": {
            return state.filter(t => t.id !== action.id)
        }
        case "COURSE/ADD-COURSE": {
            return [{
                id: action.courseId,
                title: action.title,
                filter: 'DRAFT',
                addedDate: '',
                order: 0,
                entityStatus: 'idle',
                city: action.city,
                date: action.date,
                country: action.country,
                courseIdentifier: action.courseIdentifier
            }, ...state]
        }
        case "COURSE/CHANGE-COURSE-TITLE" : {
            return state.map(tl =>
                tl.title === action.title ? {...tl, title: action.title} : tl)

        }
        case "COURSE/CHANGE-COURSE-FILTER" : {
            return state.map(tl =>
                tl.id === action.id ? {...tl, filter: action.filter} : tl)
        }
        case "COURSE/CHANGE-COURSE-ENTITY-STATUS": {
            return state.map(tl => tl.id === action.courseId ?
                {...tl, entityStatus: action.entityStatus} : tl)
        }
        default:
            return state
    }
}

export const setCourseAC = (courseArray: CourseListType[]) => {
    return {type: 'COURSE/SET-COURSE', courseArray} as const
}

export const removeCourseAC = (courseId: string) => {
    return {type: "COURSE/REMOVE-COURSE", id: courseId} as const
}

export const addCourseAC = (todo: any) => {
    return {
        type: "COURSE/ADD-COURSE",
        title: todo.title,
        courseId: todo.id,
        city: todo.city,
        date: todo.date,
        country: todo.country,
        courseIdentifier: todo.courseId
    } as const
}
export const changeCourseTitleAC = (courseId: string, title: string) => {
    return {
        type: "COURSE/CHANGE-COURSE-TITLE",
        id: courseId,
        title: title
    } as const
}

export const changeCourseFilterAC = (filter: FilterValuesType, courseId: string) => {
    return {
        type: "COURSE/CHANGE-COURSE-FILTER",
        id: courseId,
        filter: filter
    } as const
}

export const changeCourseEntityStatusAC = (courseId: string, entityStatus: RequestStatusType) => ({
    type: "COURSE/CHANGE-COURSE-ENTITY-STATUS",
    courseId, entityStatus
} as const)

export const loadCoursesTC = (dispatch: Dispatch<any>): void => {
    dispatch(setAppStatusAC('loading'))
    courseApi.getCourses()
        .then((res) => {
            dispatch(setCourseAC(res.data))
            res.data.forEach((course) => {
                dispatch(loadModulesTC(course.id))
                dispatch(setAppStatusAC('succeeded'))
            })
        })
}

enum ResultCodes {
    success = 0,
    error = 1,
    captcha = 10
}

export const createCourseTC = (data: IFormInput, date: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC('loading'))
        courseApi.createCourse(data.courseName)
            .then((res) => {
                if (res.data.resultCode === ResultCodes.success) {
                    dispatch(addCourseAC({...res.data.data.item,
                        city: data.city, date: date, country: data.country, courseId: data.courseId}))
                } else {
                    dispatch(setAppErrorAC(res.data.messages.length ?
                        res.data.messages[0] : 'some error'))
                }
            })
            .catch((error: AxiosError) => {
                dispatch(setAppErrorAC(error.message))
            })
            .finally(() => {
                dispatch(setAppStatusAC('failed'))
            })
    }
}

export const removeCourseTC = (courseId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC('loading'))
        dispatch(changeCourseEntityStatusAC(courseId, 'loading'))
        courseApi.deleteCourse(courseId)
            .then((res) => {
                if (res.data.resultCode === ResultCodes.success) {
                    dispatch(removeCourseAC(courseId))
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

export const changeCourseTitleTC = (courseId: string, title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC('loading'))
        courseApi.updateCourse(courseId, title)
            .then(() => {
                dispatch(changeCourseTitleAC(courseId, title))
            })
            .catch((error: AxiosError) => {
                dispatch(setAppErrorAC(error.message))
            })
            .finally(() => {
                dispatch(setAppStatusAC('succeeded'))
            })
    }
}

export type RemoveCourseActionType = ReturnType<typeof removeCourseAC>
export type AddCourseActionType = ReturnType<typeof addCourseAC>
export type ChangeCourseTitleActionType = ReturnType<typeof changeCourseTitleAC>
export type ChangeCourseFilterActionType = ReturnType<typeof changeCourseFilterAC>
export type changeCourseFilterActionType = ReturnType<typeof changeCourseFilterAC>
export type SetCourseActionType = ReturnType<typeof setCourseAC>
export type changeCourseEntityStatusActionType = ReturnType<typeof changeCourseEntityStatusAC>

type ActionTypes =
    RemoveCourseActionType |
    AddCourseActionType |
    ChangeCourseTitleActionType |
    ChangeCourseFilterActionType |
    SetCourseActionType |
    changeCourseEntityStatusActionType




