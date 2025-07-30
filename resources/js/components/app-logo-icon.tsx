import { SVGAttributes } from 'react';
import Logo from './../../../public/vadiher.png';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <img {...props} src={Logo} alt="" />
    );
}
