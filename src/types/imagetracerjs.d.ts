declare module 'imagetracerjs' {
    export interface ImageTracerOptions {
        corsenabled?: boolean;
        ltres?: number;
        qtres?: number;
        pathomit?: number;
        rightangleenhance?: boolean;
        colorsampling?: number;
        numberofcolors?: number;
        mincolorratio?: number;
        colorquantcycles?: number;
        layering?: number;
        strokewidth?: number;
        linefilter?: boolean;
        scale?: number;
        roundcoords?: number;
        viewbox?: boolean;
        desc?: boolean;
        lcpr?: number;
        qcpr?: number;
        blurradius?: number;
        blurdelta?: number;
        pal?: Array<{ r: number; g: number; b: number; a: number }>;
    }

    export interface ImageTracer {
        imageToSVG(
            url: string,
            callback: (svgString: string) => void,
            options?: ImageTracerOptions | string
        ): void;
        imagedataToSVG(
            imagedata: ImageData,
            options?: ImageTracerOptions | string
        ): string;
        optionpresets: {
            [key: string]: ImageTracerOptions;
        };
    }

    const imageTracer: ImageTracer;
    export default imageTracer;
}
