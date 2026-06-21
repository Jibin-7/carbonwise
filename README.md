# CarbonWise: Environmental Intelligence Platform

## 🎯 Core Problem Alignment
**Challenge:** Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

**Our Solution:** CarbonWise is an enterprise-grade web application engineered specifically to solve the root challenge through a cohesive user journey:
- **Understand:** Translates abstract data into accessible visual matrices (Doughnut charts), energy equivalencies (e.g., smartphone charges), and national benchmarking.
- **Track:** Utilizes secure, token-based session management to generate historical timeline vectors (Line charts) and localized CSV compliance exports.
- **Reduce:** Features an interactive "Algorithmic Mitigation Protocol" that provides behavioral action items with precise, quantifiable CO₂ reduction targets.

## 📊 Evaluation Criteria Met

### 1. Code Quality & Structure
- **Architecture:** Clean separation of concerns using a decoupled React frontend and a RESTful Flask backend.
- **Readability:** Extensively documented using Python docstrings, modular React components, and semantic naming conventions.
- **Maintainability:** Abstracted configuration files (e.g., centralized `config.js` for API routing) and reusable UI components.

### 2. Security & Safe Practices
- **Input Sanitization:** Dual-layer validation boundaries. The frontend prevents malformed submissions, while the Python backend enforces strict type casting and numerical clamping (e.g., `max(0.0, min(val, 15000.0))`).
- **Database Safety:** Complete mitigation of SQL injection vulnerabilities via parameterized SQLite queries (`(?, ?, ?)`).
- **Graceful Error Handling:** Backend exceptions trigger safe `abort()` sequences, preventing stack trace leaks to the client architecture.

### 3. Resource Efficiency
- **Memory Management:** Utilizes Python's `@lru_cache` to memorize repetitive programmatic calculations, drastically saving CPU cycles. 
- **Database Pooling:** Implements Flask's `g` application context manager to safely open and securely close database connections per request loop.
- **Data Streaming:** CSV compliance exports are dynamically generated in RAM via `io.StringIO()`, bypassing slow disk read/write operations.

### 4. Testing & Validation
- **Isolated Environments:** Pytest suite natively generates and destroys a temporary, isolated database file per test run, ensuring production data remains pristine.
- **Boundary Verification:** Tests aggressively target negative bounds, invalid payload structures, and expected data type mutations.

### 5. Accessibility & Usability
- **WCAG Compliance:** Implements a high-contrast Tailwind palette, custom focus rings (`focus-visible:ring-2`), and complete keyboard navigation support.
- **Semantic HTML & ARIA:** Leverages strict screen-reader anchors (`aria-invalid`, `aria-describedby`, `role="progressbar"`) and native semantic groups (`<fieldset>`, `<legend>`).
- **Cross-Environment:** Fluid, responsive layouts ensure perfect usability across mobile, tablet, and desktop viewports.

## 🚀 Local Installation & Deployment

### Backend Initialization
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\activate
pip install -r requirements.txt
pytest test_app.py        # Run the validation suite
python app.py             # Initiates server on port 5000