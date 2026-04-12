# RegIntel AI Design System Specification

This document defines the visual language, typography, and light-theme architecture for the Autonomous Compliance & Regulatory Intelligence System, inspired by premium logistics and travel interfaces.

## 1. Design Philosophy
The interface must balance **Regulatory Authority** with **Modern Intelligence**. It uses a "Clean-Room" light theme to ensure long-term readability of complex legal documents while using sophisticated typography to maintain a premium, data-driven aesthetic.

---

## 2. Color Palette (Light Theme)
We prioritize high-contrast readability and "Boutique" accents.

| Role | Color (HEX) | Token | Usage |
| :--- | :--- | :--- | :--- |
| **Background** | `#FAFAFA` | `--bg-base` | Main application background |
| **Surface** | `#FFFFFF` | `--bg-surface` | Cards, Sidebar, Navigation |
| **Heading** | `#0F172A` | `--text-primary` | Hero text, Section titles |
| **Body** | `#334155` | `--text-secondary` | Paragraphs, Regulatory text |
| **Accent Primary** | `#4F46E5` | `--brand-indigo` | Primary buttons, Active states |
| **Accent Authority** | `#854D0E` | `--brand-gold` | Urgency indicators, Secondary accents |
| **Success** | `#10B981` | `--system-green` | Compliant status |
| **Warning** | `#F59E0B` | `--system-amber` | Conflict flags |

---

## 3. Typography Strategy
Inspired by the bold hierarchy of modern logistics (Vertex) and the refined clarity of high-end travel (Travelora).

### **Primary Heading: Aventa**
*   **Role**: Hero Statements, H1, H2.
*   **Aesthetic**: Geometric, bold, high-contrast.
*   **Style**: Extra Bold (800) for hero sections; Medium (500) for dashboard summaries.
*   **Inspiration**: Derived from the "Specialized Flatbed Partner" bold sans-serif.

### **Authority Serif: Apple Garamond**
*   **Role**: Subheaders, Blockquotes, Legal citations.
*   **Aesthetic**: Classical, authoritative, intellectual.
*   **Style**: Regular (400) / Italic.
*   **Usage**: Used for citing RBI/SEBI circular text within cards to give a sense of documented permanence.

### **Utility Sans: Helvetica / Inter**
*   **Role**: Body Copy, Nav Items, Form inputs.
*   **Aesthetic**: Industrial, neutral, efficient.
*   **Style**: Regular (400) / Semibold (600).
*   **Usage**: The "workhorse" for heavy reading sections in the Document Analyzer.

---

## 4. Visual Components & Layout Patterns

### **The "Intelligence Glass"**
*   **Implementation**: Subtle `backdrop-filter: blur(8px)` with a very faint white overlay (`rgba(255, 255, 255, 0.4)`).
*   **Usage**: Applied to the Sidebar and Header to create a layered, modern feel without the heaviness of dark-mode glassmorphism.

### **Regulatory Cards**
*   **Style**: `border: 1px solid #E2E8F0; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);`
*   **Interaction**: Subtle lift on hover (`transform: translateY(-2px)`).
*   **Typography**: Aventa headers with Apple Garamond citation links.

### **Urgency Badges**
*   **High Urgency**: Aventa (Bold) text on a soft gold background.
*   **Human Review**: Apple Garamond (Italic) label with a Warning Amber icon.

---

## 5. Micro-Animations (Framer Motion)
*   **Page Transitions**: Horizontal slide (20px) with cubic-bezier easing.
*   **Hover States**: Color-shift on brand-indigo with a short bounce effect.
*   **Data loading**: Shimmer effect on high-contrast surfaces.
