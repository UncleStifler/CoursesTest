import React, {useCallback, useEffect} from 'react';
import {useDispatch} from "react-redux";
import {useAppReducer} from "../../state/store";
import {
    changeCourseFilterAC, changeCourseTitleTC, createCourseTC,
    FilterValuesType,
    loadCoursesTC, removeCourseTC,
    CourseDomainType
} from "../../state/courses-reducer";
import {
    addModuleTC,
    changeModuleTitleTC,
    removeModuleTC,
    ModulesStateType,
    updateModuleStatusTC
} from "../../state/modules-reducer";
import {ModuleStatuses} from "../../api/course-api";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import {CustomizedCourseForm, IFormInput} from "../../utils/Forms/CustomizedCourseForm";
import {ModuleFormInput} from "../../utils/Forms/NewModuleForm";
import CourseList from "./CourseList";


const CourseListsContainer = () => {

    const dispatch = useDispatch()

    const courseLists = useAppReducer<CourseDomainType[]>(state => state.courses)
    const moduleObj = useAppReducer<ModulesStateType>(state => state.modules)

    useEffect(() => {
        dispatch(loadCoursesTC)
    }, [dispatch])

    const addModule = useCallback((dataModule: ModuleFormInput, courseId: string, dateOfModule: string) => {
        dispatch(addModuleTC(courseId, dataModule, dateOfModule))
    }, [dispatch])

    const removeModule = useCallback((idModule: string, courseId: string) => {
        dispatch(removeModuleTC(idModule, courseId))
    }, [dispatch])

    const changeFilter = useCallback((value: FilterValuesType, courseId: string) => {
        const action = changeCourseFilterAC(value, courseId)
        dispatch(action)
    }, [dispatch])

    const changeStatusCheckbox = useCallback((moduleID: string, status: ModuleStatuses, courseId: string) => {
        dispatch(updateModuleStatusTC(courseId, moduleID, status))
    }, [dispatch])

    const removeCourse = useCallback((courseId: string) => {
        dispatch(removeCourseTC(courseId))
    }, [dispatch])

    const addCourse = useCallback((data: IFormInput, date: string) => {
        dispatch(createCourseTC(data, date))
    }, [dispatch])

    const changeModuleTitle = useCallback((id: string, newValue: string, courseId: string) => {
        dispatch(changeModuleTitleTC(id, newValue, courseId))
    }, [dispatch])

    const changeCourseTitle = useCallback((courseId: string, newCourseTitle: string) => {
        const thunk = changeCourseTitleTC(courseId, newCourseTitle)
        dispatch(thunk)
    }, [dispatch])

    return (
        <>
            <Grid container style={{padding: "20px"}}>
                <CustomizedCourseForm
                    addItem={addCourse}
                />
            </Grid>
            <Grid container spacing={5}>
                {courseLists.map(t => {
                    let modulesForCourse = moduleObj[t.id]
                    return (
                        <Grid item key={t.id}>
                            <Paper
                                elevation={3}
                                style={{padding: "15px"}}>
                                <CourseList
                                    key={t.id}
                                    city={t.city}
                                    country={t.country}
                                    courseIdentifier={t.courseIdentifier}
                                    date={t.date}
                                    courseListId={t.id}
                                    courseTitle={t.title}
                                    entityStatus={t.entityStatus}
                                    modulesForCourse={modulesForCourse}
                                    removeModule={removeModule}
                                    changeFilter={changeFilter}
                                    addModule={addModule}
                                    changeStatusCheckbox={changeStatusCheckbox}
                                    filter={t.filter}
                                    removeCourse={removeCourse}
                                    changeModuleTitle={changeModuleTitle}
                                    changeCourseTitle={changeCourseTitle}
                                />
                            </Paper>
                        </Grid>)
                })
                }
            </Grid>
        </>
    );
};

export default CourseListsContainer;
