import { useEffect, useState } from "react";
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
    const [noUserEmail, setNoUserEmail] = useState(false);
    const [incorrectEmail, setIncorrectEmail] = useState(false);
    const [incorrectEmailWarning, setIncorrectEmailWarning] = useState(false);
    const [noUserPassword, setNoUserPassword] = useState(false);
    const [unsafePassword, setUnsafePassword] = useState(false);
    const [noRepeatedPassword, setNoRepeatedPassword] = useState(false);
    const [differentPasswords, setDifferentPasswords] = useState(false);
    const [registrationError, setRegistrationError] = useState(false);

    const { isPasswordWrong } = useSelector((state: RootState) => state.auth);

    const checkEmailCorrectness = (email: string) => {
        const correctEmail = EmailPattern.test(email);
        (correctEmail === false) ? setIncorrectEmail(true) : setIncorrectEmail(false);
    }

    const newUserRegistration = async () => {

        if (userEmail === '') {
            setNoUserEmail(true);
            return;
        } else {
            setNoUserEmail(false);
        }

        if (incorrectEmail) {
            setIncorrectEmailWarning(true);
            return;
        } else {
            setIncorrectEmailWarning(false);
        }

        if (userPassword === '') {
            setNoUserPassword(true);
            return;
        } else {
            setNoUserPassword(false);
        }

        if (userPassword !== '' && isPasswordWrong) {
            setUnsafePassword(true);
            return;
        } else {
            setUnsafePassword(false);
        }

        if (repeatedPassword === '') {
            setNoRepeatedPassword(true);
            return;
        } else {
            setNoRepeatedPassword(false);
        }

        if (repeatedPassword !== userPassword) {
            setDifferentPasswords(true);
            return;
        } else {
            setDifferentPasswords(false);
        }

        const registrationProcess = await dispatch<any>(createUser({ email: userEmail, password: repeatedPassword }));

        if (registrationProcess.meta.requestStatus === 'fulfilled') {
            navigate('/');
        } else {
            setRegistrationError(true);
        }
    }

    useEffect(() => {
        if (userEmail !== '') {
            checkEmailCorrectness(userEmail);
        }
    }, [userEmail]);

    return <div className="auto-form">
        <div className="header">Реєстрація</div>
        <div className="input-and-label">
            <label className="form-label">Email:</label>
            <input className="form-input" type="text" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
        </div>
        {noUserEmail && <div className="warning">Будь ласка, введіть email!</div>}
        {incorrectEmailWarning && <div className="warning">Ви ввели некоректний email!</div>}
        <div className="input-and-label">
            <label className="form-label">Пароль:</label>
            <input className="form-input" type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} />
        </div>
        {userPassword !== '' && <PasswordCheck passwordToCheck={userPassword} />}
        {noUserPassword && <div className="warning">Будь ласка, введіть пароль!</div>}
        {unsafePassword && <div className="warning">Пароль не відповідає вимогам щодо безпеки!</div>}
        <div className="input-and-label">
            <label className="form-label">Повторіть пароль:</label>
            <input className="form-input" type="password" value={repeatedPassword} onChange={(e) => setRepeatedPassword(e.target.value)} />
        </div>
        {noRepeatedPassword && <div className="warning">Будь ласка, введіть ваш пароль ще раз!</div>}
        {differentPasswords && <div className="warning">Паролі не співпадають!</div>}
        {registrationError && <div className="warning">Виникла непередбачена помилка! Можливо, є проблеми з інтернет-з'єднанням!</div>}
        <button className="form-button" onClick={() => newUserRegistration()}>Зареєструватись</button>
        <div className="form-bottom">Вже є аккаунт? <Link to="/login">Увійти</Link></div>
    </div>
}