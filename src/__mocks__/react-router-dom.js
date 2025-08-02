// Mock for react-router-dom
module.exports = {
  BrowserRouter: ({ children }) => children,
  Router: ({ children }) => children,
  Route: ({ children }) => children,
  Routes: ({ children }) => children,
  Link: ({ children, to, ...props }) => React.createElement('a', { href: to, ...props }, children),
  NavLink: ({ children, to, ...props }) => React.createElement('a', { href: to, ...props }, children),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: '/',
    search: '',
    hash: '',
    state: null,
    key: 'default'
  }),
  useParams: () => ({}),
  Outlet: () => null,
  Navigate: () => null,
  createBrowserRouter: jest.fn(),
  RouterProvider: ({ children }) => children
};
