import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { EmailPattern } from "../../../common/patterns/EmailPattern";
import { RootState } from "../../../common/store/store";
import { createUser } from "../../../common/store/authSlice";
import { PasswordCheck } from "./PasswordCheck";

export const Registration = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userEmail, setUserEmail] = useState<string>('');
    const [userPassword, setUserPassword] = useState<string>('');
    const [repeatedPassword, setRepeatedPassword] = useState<string>('');
    const [emailWarning, setEmailWarning] = useState(false);
    const [emailWarningText, setEmailWarningText] = useState('');
    const [passwordWarning, setPasswordWarning] = useState(false);
    const [passwordWarningText, setPasswordWarningText] = useState('');
    const [repeatedPasswordWarning, setRepeatedPasswordWarning] = useState(false);
    const [repeatedPasswordWarningText, setRepeatedPasswordWarningText] = useState('');
    const [registrationError, setRegistrationError] = useState(false);

    const { isPasswordWrong } = useSelector((state: RootState) => state.auth);

    const checkEmail = () => {
        if (userEmail === '') {
            setEmailWarning(true);
            setEmailWarningText('Будь ласка, введіть email!');
            return true;
        } else if (!EmailPattern.test(userEmail)) {
            setEmailWarning(true);
            setEmailWarningText('Ви ввели некоректний email!');
            return true;
        } else {
            setEmailWarning(false);
            setEmailWarningText('');
            return false;
        }
    }

    const checkPassword = () => {
        if (userPassword === '') {
            setPasswordWarning(true);
            setPasswordWarningText('Будь ласка, введіть пароль!');
            return true;
        } else if (userPassword !== '' && isPasswordWrong) {
            setPasswordWarning(true);
            setPasswordWarningText('Пароль не відповідає вимогам щодо безпеки!');
            return true;
        } else {
            setPasswordWarning(false);
            setPasswordWarningText('');
            return false;
        }
    }

    const checkRepeatedPassword = () => {
        if (repeatedPassword === '') {
            setRepeatedPasswordWarning(true);
            setRepeatedPasswordWarningText('Будь ласка, введіть ваш пароль ще раз!');
            return true;
        } else if (repeatedPassword !== userPassword) {
            setRepeatedPasswordWarning(true);
            setRepeatedPasswordWarningText('Паролі не співпадають!');
            return true;
        } else {
            setRepeatedPasswordWarning(false);
            setRepeatedPasswordWarningText('');
            return false;
        }
    }

    const newUserRegistration = async () => {

        if (checkEmail()) return;
        if (checkPassword()) return;
        if (checkRepeatedPassword()) return;

        await dispatch<any>(createUser({ email: userEmail, password: repeatedPassword })).then(() => {
            navigate('/');
        }).catch(() => {
            setRegistrationError(true);
        });
    }

    return <div className="auto-form">
        <div className="header">Реєстрація</div>
        <div className="input-and-label">
            <label className="form-label">Email:</label>
            <input className="form-input" type="text" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
        </div>
        {emailWarning && <div className="warning">{emailWarningText}</div>}
        <div className="input-and-label">
            <label className="form-label">Пароль:</label>
            <input className="form-input" type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} />
        </div>
        {userPassword !== '' && <PasswordCheck passwordToCheck={userPassword} />}
        {passwordWarning && <div className="warning">{passwordWarningText}</div>}
        <div className="input-and-label">
            <label className="form-label">Повторіть пароль:</label>
            <input className="form-input" type="password" value={repeatedPassword} onChange={(e) => setRepeatedPassword(e.target.value)} />
        </div>
        {repeatedPasswordWarning && <div className="warning">{repeatedPasswordWarningText}</div>}
        {registrationError && <div className="warning">Виникла непередбачена помилка! Можливо, є проблеми з інтернет-з'єднанням!</div>}
        <button className="form-button" onClick={() => newUserRegistration()}>Зареєструватись</button>
        <div className="form-bottom">Вже є аккаунт? <Link to="/login">Увійти</Link></div>
    </div>
}