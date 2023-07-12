import { Link, To, useMatch } from 'react-router-dom';

export const CustomLink: ({ children, to }: { children: React.ReactNode, to: string }) => JSX.Element = ({ children, to, ...props }) => {
    const match = useMatch({
        path: to,
        end: to.length === 1,
    });

    return (
        <Link
            to={to}
            style={{
                color: match ? 'var(--color-active)' : 'white',
            }}
            {...props}
        >
            {children}
        </Link>
    )
};