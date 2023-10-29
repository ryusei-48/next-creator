export const devtool: string;
export namespace performance {
    const hints: boolean;
}
export const entry: any;
export namespace output {
    const library: string;
    const path: any;
    const filename: string;
    const libraryTarget: string;
    const libraryExport: string;
}
export namespace optimization {
    const minimizer: any[];
}
export const plugins: any[];
export namespace resolve {
    const extensions: string[];
}
export namespace module {
    const rules: ({
        test: RegExp;
        use: string[];
    } | {
        test: RegExp;
        use: string;
    } | {
        test: RegExp;
        use: ({
            loader: string;
            options: {
                injectType: string;
                attributes: {
                    'data-cke': boolean;
                };
                postcssOptions?: undefined;
            };
        } | {
            loader: string;
            options?: undefined;
        } | {
            loader: string;
            options: {
                postcssOptions: any;
                injectType?: undefined;
                attributes?: undefined;
            };
        })[];
    })[];
}
