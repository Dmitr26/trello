import { ReactElement } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export function MainRoute(): ReactElement {
    return localStorage.getItem('authToken') ? <Outlet /> : <Navigate to="/login" />;
}