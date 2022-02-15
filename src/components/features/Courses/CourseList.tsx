import React, {useCallback} from 'react';
import {EditableSpan} from "../../utils/EditableSpan";
import {Modules} from "../Modules/Modules";
import {Delete} from "@mui/icons-material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import {ModuleStatuses} from "../../api/course-api";
import {RequestStatusType} from "../../app/app-reducer";
import {useTranslation} from "react-i18next";
import style from "./courses.module.css"
import Typography from "@mui/material/Typography";
import {ModuleFormInput, NewModuleForm} from "../../utils/Forms/NewModuleForm";
import {ModulesDomain_Type} from "../../state/modules-reducer";
import {FilterValuesType} from "../../state/courses-reducer";
import Paper from "@mui/material/Paper";

export type CourseType = {
    city: string
    date: string
    country: string
    courseIdentifier: string
    courseListId: string
    courseTitle: string
    modulesForCourse: ModulesDomain_Type[]
    removeModule: (idModules: string, courseId: string) => void
    changeFilter: (value: FilterValuesType, courseId: string) => void
    addModule: (dataModule: ModuleFormInput, courseId: string, dateOfModule: string) => void
    changeStatusCheckbox: (moduleID: string, status: ModuleStatuses, courseId: string) => void
    changeModuleTitle: (id: string, newValue: string, courseId: string) => void
    changeCourseTitle: (courseId: string, newCourseTitle: string) => void
    filter: FilterValuesType
    removeCourse: (courseId: string) => void
    entityStatus: RequestStatusType
}

export const CourseList = React.memo(function (props: CourseType) {
    const {t} = useTranslation()
    const {
        changeFilter, courseListId,
        removeCourse, addModule, changeCourseTitle,
        modulesForCourse, filter, courseTitle, removeModule,
        changeStatusCheckbox, changeModuleTitle, entityStatus
    } = props

    const onAllClickHandler = useCallback(() => {
        changeFilter("DRAFT", courseListId)
    }, [changeFilter, courseListId])
    const onActiveClickHandler = useCallback(() => {
        changeFilter("PUBLISHED", courseListId)
    }, [changeFilter, courseListId])
    const onCompletedClickHandler = useCallback(() => {
        changeFilter("ARCHIVED", courseListId)
    }, [changeFilter, courseListId])

    const removeCourseHandler = () => {
        removeCourse(courseListId)
    }

    const addModuleForAddItem = useCallback((dataModule: ModuleFormInput, dateOfModule: string) => {
        addModule(dataModule, courseListId, dateOfModule)
    }, [addModule, courseListId])

    const changeCourseTitleHandler = useCallback((newTodoListTitle: string) => {
        changeCourseTitle(courseListId, newTodoListTitle)
    }, [changeCourseTitle, courseListId])

    let allModulesForCourse = props.modulesForCourse

    if (filter === "PUBLISHED") {
        allModulesForCourse = modulesForCourse.filter(t => t.status === ModuleStatuses.New)
    }
    if (filter === "ARCHIVED") {
        allModulesForCourse = modulesForCourse.filter(t => t.status === ModuleStatuses.Completed)
    }

    return (
        <div>
            <Link>
                <h3 className={style.nameOfCourse}>
                    <div style={{marginTop: "5px"}}>
                    </div>
                    <div>
                        <EditableSpan
                            title={`${t("course_name")}: ${courseTitle}`}
                            onChange={changeCourseTitleHandler}/>
                        <IconButton
                            onClick={removeCourseHandler}
                            disabled={entityStatus === 'loading'}>
                            <Delete/>
                        </IconButton>
                    </div>
                </h3>
            </Link>
            <Paper
                elevation={2}
                style={{padding: "15px", marginBottom: "15px"}}>
                <Typography style={{marginBottom: "10px"}}>{t("course_info")}</Typography>
                <Typography component={'span'} className={style.infoBlock}>
                    <div className={style.inlineInfoBlock}>
                        <span>{`${t("date")}:`}</span>
                        <span className={style.propsData}>{props.date}</span>
                    </div>
                    <div className={style.inlineInfoBlock}>
                        <span>{`${t("course_id")}:`}</span>
                        <span className={style.propsData}>{props.courseIdentifier}</span>
                    </div>
                </Typography>
                <Typography component={'span'} className={style.infoBlock}>
                    <div className={style.inlineInfoBlock}>
                        <span>{`${t("city")}:`}</span>
                        <span className={style.propsData}>{props.city}</span>
                    </div>
                    <div className={style.inlineInfoBlock}>
                        <span>{`${t("country")}`}</span>
                        <span className={style.propsData}>{props.country}</span>
                    </div>
                </Typography>
            </Paper>
            <NewModuleForm addModuleForAddItem={addModuleForAddItem}/>
            <ul>
                {allModulesForCourse && allModulesForCourse.map(t =>
                    <Modules
                        key={t.id}
                        moduleId={t.moduleId}
                        dateOfModule={t.dateOfModule}
                        courseId={courseListId}
                        removeModule={removeModule}
                        changeStatusCheckbox={changeStatusCheckbox}
                        changeModuleTitle={changeModuleTitle}
                        module={t}
                        entityStatus={entityStatus}
                        entityTaskStatus={t.entityModuleStatus}
                    />)}
            </ul>
            <div>
                <Button
                    variant={filter === "DRAFT" ? "outlined" : "text"}
                    onClick={onAllClickHandler}>
                    {t("button_draft")}
                </Button>
                <Button
                    color={'success'}
                    variant={filter === "PUBLISHED" ? "outlined" : "text"}
                    onClick={onActiveClickHandler}>
                    {t("button_published")}
                </Button>
                <Button
                    color={'warning'}
                    variant={filter === "PUBLISHED" ? "outlined" : "text"}
                    onClick={onCompletedClickHandler}>
                    {t("button_archived")}
                </Button>
            </div>
        </div>
    );
});

export default CourseList




