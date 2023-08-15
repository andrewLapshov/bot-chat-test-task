declare module '*.css' {
    const styles: { [className: string]: string };
    export default styles;
}

declare module '*.svg' {
    const image: string;
    export default image;
}
