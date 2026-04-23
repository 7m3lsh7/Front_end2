import '@mui/material/styles';
import '@mui/material/Typography';
import type { CSSProperties } from 'react';



declare module '@mui/material/styles' {
    interface TypeBackground {
        main: string;
    }

    interface PartialTypeBackground {
        main?: string;
    }

    interface TypographyVariants {
        body3: CSSProperties;
        body4: CSSProperties;
    }

    interface TypographyVariantsOptions {
        body3?: CSSProperties;
        body4?: CSSProperties;
    }
}

declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        body3: true;
        body4: true;
    }
}