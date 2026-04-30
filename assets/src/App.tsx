import { Link } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import './App.css';
import { AppRoutes } from './Routes';

const bookstoreIcon = "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjMycHgiIGhlaWdodD0iMzJweCIgdmlld0JveD0iMCAwIDMzNS4wOCAzMzUuMDc5IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzMzUuMDggMzM1LjA3OTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik0zMTEuMTc1LDExNS43NzVjLTEuMzU1LTEwLjE4Ni0xLjU0Ni0yNy43Myw3LjkxNS0zMy42MjFjMC4xNjktMC4xMDgsMC4yOTUtMC4yNjQsMC40NDMtMC4zOTggICAgYzcuNzM1LTIuNDc0LDEzLjA4OC01Ljk0Niw4Ljg4Ni0xMC42MThsLTExNC4xMDItMzQuMzhMMjkuNTYsNjIuNDQ1YzAsMC0yMS4xNTcsMy4wMjQtMTkuMjY3LDM1Ljg5NCAgICBjMS4wMjYsMTcuODksNi42MzcsMjYuNjc2LDExLjU0NCwzMWwtMTUuMTYxLDQuNTY5Yy00LjIwOCw0LjY3MiwxLjE0NCw4LjE0NSw4Ljg4LDEwLjYxNWMwLjE0NywwLjEzOCwwLjI3MSwwLjI5MywwLjQ0MywwLjQwMSAgICBjOS40NTUsNS44OTYsOS4yNzMsMjMuNDM4LDcuOTEzLDMzLjYyNmMtMzMuOTY3LDkuNjQ1LTIxLjc3NCwxMi43ODgtMjEuNzc0LDEyLjc4OGw3LjQ1MSwxLjgwMyAgICBjLTUuMjQxLDQuNzM2LTEwLjQ0NiwxMy43MTctOS40NzEsMzAuNzVjMS44OTEsMzIuODY0LDE5LjI2OSwzNS4xMzIsMTkuMjY5LDM1LjEzMmwxMjAuOTA0LDM5LjI5OGwxODIuNDktNDQuMjAyICAgIGMwLDAsMTIuMTk3LTMuMTQ4LTIxLjc3OS0xMi43OTRjLTEuMzY2LTEwLjE3Mi0xLjU1Ni0yNy43MTIsNy45MjEtMzMuNjIzYzAuMTc0LTAuMTA1LDAuMzAxLTAuMjY0LDAuNDQyLTAuMzk2ICAgIGM3LjczNi0yLjQ3NCwxMy4wODQtNS45NDMsOC44ODEtMTAuNjE1bC03LjkzMi0yLjM5NWM1LjI5LTMuMTksMTMuMjM2LTExLjUyNywxNC40ODEtMzMuMTgzICAgIGMwLjg1OS0xNC44OTYtMy4wMjctMjMuNjItNy41MjUtMjguNzU2bDE1LjY3OC0zLjc5NEMzMzIuOTQ5LDEyOC41NjksMzQ1LjE0NiwxMjUuNDIxLDMxMS4xNzUsMTE1Ljc3NXoiIGZpbGw9IiNmNjk4MjciLz4KCTwvZz4KPC9nPgo8L3N2Zz4K";

function App() {
  return (
    <Container className="App">
      <Navbar expand="lg" className="mb-3">
        <Navbar.Brand as={Link} to="/">
          <span className="orange"><img src={bookstoreIcon} alt="bookstore" /> BOOKSTORE</span>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <Nav.Link as={Link} to="/past"><span className="orange">Past orders</span></Nav.Link>
            <Nav.Link as={Link} to="/best"><span className="orange">Best sellers</span></Nav.Link>
            <Nav.Link as={Link} to="/cart">
              <span className="shopping-icon-container">🛒</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <AppRoutes />
    </Container>
  );
}

export default App;
