"use client";
import { store } from './store';
import { Provider } from 'react-redux';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <main className="flex-grow  bg-gradient-to-br from-background to-secondary/20">
                {children}
            </main>
        </Provider>
    );
};