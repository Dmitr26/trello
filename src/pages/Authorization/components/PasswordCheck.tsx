import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { passwordWrong, passwordNotWrong } from '../../../common/store/authSlice';
import {
    SmallLettersPattern,
    CapitalLettersPattern,
    NumbersPattern,
    SpecialSymbolPattern,
    LengthPattern
} from '../../../common/patterns/PasswordPattern';

interface PasswordCheckProps {
    passwordToCheck: string
}

export const PasswordCheck: React.FC<PasswordCheckProps> = ({ passwordToCheck }) => {

    const dispatch = useDispatch();
    const [warning, setWarning] = useState<string>('');
    const [warningColor, setWarningColor] = useState<string>('#ff0303ff');
    const [passwordLevel, setPasswordLevel] = useState<number>(0);
    const passwordLevels: string[] = ['Дуже слабкий пароль', 'Слабкий пароль', 'Хороший пароль', 'Надійний пароль'];
    const warningColors: string[] = ['#ff0303ff', '#ffaa00ff', '#22ff00ff', '#00e1ffff'];

    const checkStrengthLevel = (passLength: number, numbers: boolean, specialSymbols: boolean) => {
        let level = 1;
        let levelUp = [passLength > 10, numbers, specialSymbols].filter((value) => value === true).length;
        return level + levelUp;
    }

    const checkPasswordStrength = () => {
        const lengthCheck = LengthPattern.test(passwordToCheck);
        const smallLettersCheck = SmallLettersPattern.test(passwordToCheck);
        const capitalLettersCheck = CapitalLettersPattern.test(passwordToCheck);
        const numbersCheck = NumbersPattern.test(passwordToCheck);
        const specialSymbolsCheck = SpecialSymbolPattern.test(passwordToCheck);

        if (!lengthCheck) {
            setWarning('Пароль має містити не менше 6 символів!');
            dispatch(passwordWrong());
        } else if (!smallLettersCheck) {
            setWarning('Пароль має містити маленькі літери!');
            dispatch(passwordWrong());
        } else if (!capitalLettersCheck) {
            setWarning('Пароль має містити великі літери!');
            dispatch(passwordWrong());
        } else {
            dispatch(passwordNotWrong());
            if (passwordLevel === 0) setPasswordLevel(1);
            setPasswordLevel(checkStrengthLevel(passwordToCheck.length, numbersCheck, specialSymbolsCheck));
        }
    }

    useEffect(() => {
        if (passwordLevel !== 0) {
            setWarning(passwordLevels[passwordLevel - 1]);
            setWarningColor(warningColors[passwordLevel - 1]);
        }
    }, [passwordLevel]);

    useEffect(() => {
        if (passwordToCheck !== '') {
            checkPasswordStrength();
        }
        if (passwordToCheck === '') {
            setPasswordLevel(0);
            setWarning('');
        }
    }, [passwordToCheck]);

    return <div className="pass-check">
        <div className="pass-levels">
            <div className="pass-level" style={{ backgroundColor: (passwordLevel > 0) ? warningColors[0] : '#ffffff' }}></div>
            <div className="pass-level" style={{ backgroundColor: (passwordLevel > 1) ? warningColors[1] : '#ffffff' }}></div>
            <div className="pass-level" style={{ backgroundColor: (passwordLevel > 2) ? warningColors[2] : '#ffffff' }}></div>
            <div className="pass-level" style={{ backgroundColor: (passwordLevel > 3) ? warningColors[3] : '#ffffff' }}></div>
        </div>
        <div className="pass-warning" style={{ color: warningColor }}>{warning}</div>
    </div>
}