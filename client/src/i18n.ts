import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

import enMessages from "./locales/en/messages.json";
import ruMessages from "./locales/ru/messages.json";

const resources = {
    en: {
        translation: enMessages
    },
    ru: {
        translation: ruMessages
    }
}

const detection = {
    order: ['localStorage'],
    caches: ['localStorage']
};

i18next.use(initReactI18next).use(LanguageDetector).init({
    detection,
    resources,
    fallbackLng: "en"
});

export default i18next;