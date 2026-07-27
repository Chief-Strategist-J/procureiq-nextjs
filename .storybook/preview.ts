import type { Preview } from "@storybook/react";
import "../shared/src/styles/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "dark",
      values: [
        {
          name: "light",
          value: "#f1f5f9",
        },
        {
          name: "dark",
          value: "#030712",
        },
      ],
    },
    viewport: {
      viewports: {
        mobile: {
          name: "Mobile Device",
          styles: {
            width: "375px",
            height: "667px",
          },
        },
        tablet: {
          name: "Tablet",
          styles: {
            width: "768px",
            height: "1024px",
          },
        },
        desktop: {
          name: "Desktop Screen",
          styles: {
            width: "1440px",
            height: "900px",
          },
        },
      },
      defaultViewport: "desktop",
    },
  },
  // Injects themes selector or toggler to let us review components with light/dark layouts
  decorators: [
    (Story, context) => {
      // Toggle dark mode class on preview body
      const isDark = context.globals.backgrounds?.value !== "#f1f5f9";
      if (typeof document !== "undefined") {
        if (isDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
      return Story();
    },
  ],
};

export default preview;
