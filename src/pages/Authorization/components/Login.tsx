import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../common/store/authSlice";

export const Login = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userEmail, setUserEmail] = useState<string>('');
    const [userPassword, setUserPassword] = useState<string>('');
    const [noUserName, setNoUserName] = useState(false);
    const [noUserPassword, setNoUserPassword] = useState(false);
    const [loginError, setLoginError] = useState(false);

    const loginToSite = async () => {

        if (userEmail === '') {
            setNoUserName(true);
            return;
        } else {
            setNoUserName(false);
        }

        if (userPassword === '') {
            setNoUserPassword(true);
            return;
        } else {
            setNoUserPassword(false);
        }

        const loginProcess = await dispatch<any>(loginUser({ email: userEmail, password: userPassword }));

        if (loginProcess.meta.requestStatus === 'fulfilled') {
            navigate('/');
        } else {
            setLoginError(true);
        }
    }

    return <div className="auto-form">
        <div className="header">Вхід</div>
        <div className="input-and-label">
            <label className="form-label">Email:</label>
            <input className="form-input" type="text" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
        </div>
        {noUserName && <div className="warning">Будь ласка, вкажіть ваш email!</div>}
        <div className="input-and-label">
            <label className="form-label">Пароль:</label>
            <input className="form-input" type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} />
        </div>
        {noUserPassword && <div className="warning">Будь ласка, введіть пароль!</div>}
        {loginError && <div className="warning">Виникли проблеми! Можливо, ви ввели неправильний email або пароль!</div>}
        <button className="form-button" onClick={() => loginToSite()}>Увійти</button>
        <div className="form-bottom">Вперше на нашому сайті? <Link to="/registration">Зареєструватись</Link></div>
    </div>
}