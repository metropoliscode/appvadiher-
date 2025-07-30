import { ImgHTMLAttributes } from 'react';
import Logo from './../../../public/vadiher.png';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img src={Logo} alt="logo" {...props} />
    );
}
