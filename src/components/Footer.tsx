import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className='bg-dark-black rounded-2xl mt-5 p-8 bottom-0'>
            <div >
                <p >&copy; 2026 Formula 1 Educational Project.</p>
                <p >Data source <a href='https://openf1.org/docs/' className='text-blue-600'>Open F1</a></p>
                <p className='text-sm mt-2'>It is an unofficial project and is not associated in any way with the Formula 1 companies. F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and related marks are trade marks of Formula One Licensing B.V.</p>
            </div>
        </footer>
    );
};

export default Footer;