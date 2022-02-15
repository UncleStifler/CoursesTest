import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend'

type LanguagesType = {
    code: string,
    name: string,
    country_code: string,
}

export const languages: LanguagesType[] = [
    {
        code: 'en',
        name: 'English',
        country_code: 'gb'
    },
    {
        code: 'fr',
        name: 'French',
        country_code: 'fr'
    }
]

i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(HttpApi)
    .init({
        supportedLngs: ["en", "fr"],
        fallbackLng: "en",
        detection: {
            order: ['path', 'cookie', 'htmlTag'],
            caches: ['cookie']
        },
        backend: {
            loadPath: '/assets/locales/{{lng}}/translation.json',
        },
        react: {useSuspense: false}
    });


export default i18n;
