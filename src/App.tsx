import React, {useState} from 'react';
import './App.css';
import {useAppReducer} from "./components/state/store";
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import {Menu} from "@mui/icons-material";
import {ErrorSnackbar} from "./components/ErrorSnackBar/ErrorSnackBar";
import {RequestStatusType} from "./components/app/app-reducer";
import {Routes, Route} from "react-router-dom"
import CourseListsContainer from "./components/features/Courses/CourseListsContainer";
import {useTranslation} from "react-i18next";
import {MenuItem, Select, SelectChangeEvent} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import i18n, {languages} from "./components/features/Translation/i18n";

function App() {
    const {t} = useTranslation()
    const status = useAppReducer<RequestStatusType>(state => state.app.status)

    const [language, setLanguage] = useState(languages[0].code)
    const selectLanguageHandler = (e: SelectChangeEvent) => {
        setLanguage(e.target.value)
        i18n.changeLanguage(e.target.value)
    }

    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="Active Todo List"
                        sx={{mr: 2}}>
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        {t("main-header-text")}
                    </Typography>
                    <FormControl variant="standard">
                        <Select
                            name="language"
                            value={language}
                            variant="standard"
                            sx={{color: "white"}}
                            onChange={selectLanguageHandler}>
                            {languages.map(({code, name, country_code}) => {
                                return (
                                    <MenuItem
                                        disabled={code === language}
                                        key={country_code}
                                        value={code}>
                                        {name}
                                    </MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                </Toolbar>
                {status === 'loading' && <LinearProgress/>}
            </AppBar>
            <Container fixed>
                <Routes>
                    {/*<Route path="/login" element={<Login/>}/>*/}
                    <Route path="/" element={<CourseListsContainer/>}/>
                </Routes>
            </Container>
        </div>

    );
}

export default App;
